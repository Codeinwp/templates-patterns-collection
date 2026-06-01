<?php
/**
 * Personalized starter-site ordering.
 *
 * Calls the Themeisle AI proxy workflow (`neve-starter-ranking` on
 * ai.themeisle.com) with the site's own URL and applies the returned order to
 * the catalog. Everything here is fail-open: any error, timeout, empty result,
 * or missing license degrades silently to the catalog's existing (sheet) order.
 *
 * The expensive call is cached per site+builder, and the heavy lifting (the
 * actual ranking + guardrail) lives server-side in the workflow — the plugin
 * only forwards its URL and re-orders the buckets it already has.
 *
 * @package templates-patterns-collection
 */

namespace TIOB;

/**
 * Class Starter_Ranking
 */
class Starter_Ranking {

	/**
	 * AI proxy base URL. Filterable / constant-overridable for staging + local dev.
	 */
	const DEFAULT_BASE = 'https://ai.themeisle.com';

	/**
	 * Workflow slug ({product}-{action}).
	 */
	const SLUG = 'neve-starter-ranking';

	/**
	 * Local cache-bust knob for the order/search transients. Bump this (in step
	 * with the server's RankingGuardrail::RANKING_VERSION) when the ranking
	 * changes, so stale client caches are dropped. It is NOT sent to the server
	 * and is not a handshake — the cache TTL bounds any drift if the two diverge.
	 */
	const VERSION = 'v2';

	/**
	 * How long to keep a personalized order (seconds). The server caches per
	 * domain too; this just avoids re-requesting on every onboarding view.
	 */
	const CACHE_TTL = 7 * DAY_IN_SECONDS;

	/**
	 * Total time budget for the start+poll round-trip (seconds). Kept short so an
	 * AJAX caller never hangs; on timeout we fall back to sheet order and the
	 * server-side cache makes the next call fast.
	 */
	const REQUEST_BUDGET = 6;

	/**
	 * Longer budget for free-text SEARCH (seconds). The grid already shows the
	 * instant Fuse results, so the LLM "personalize the rest" call is non-blocking
	 * and may wait longer before we fall back to the sheet backfill.
	 */
	const SEARCH_BUDGET = 8;

	/**
	 * Resolve the AI proxy base URL.
	 *
	 * @return string
	 */
	private static function base_url() {
		if ( defined( 'TPC_AI_PROXY_URL' ) && ! empty( TPC_AI_PROXY_URL ) ) {
			return rtrim( TPC_AI_PROXY_URL, '/' );
		}
		return rtrim( apply_filters( 'tpc_ai_proxy_url', self::DEFAULT_BASE ), '/' );
	}

	/**
	 * Transient key for a builder's cached order.
	 *
	 * @param string $builder Editor key (gutenberg|elementor).
	 *
	 * @return string
	 */
	private static function cache_key( $builder ) {
		return 'tpc_starter_order_' . self::VERSION . '_' . $builder;
	}

	/**
	 * Get the personalized order for a builder, fetching from the workflow if it
	 * isn't cached yet. Intended for an AJAX/REST context (it may block up to
	 * REQUEST_BUDGET). Returns an ordered list of slugs, or [] on any failure.
	 *
	 * @param string $builder Editor key.
	 *
	 * @return array<int, string>
	 */
	public static function get_order( $builder ) {
		$builder = ( 'elementor' === $builder ) ? 'elementor' : 'gutenberg';

		return self::cached_order(
			self::cache_key( $builder ),
			static function () use ( $builder ) {
				return self::fetch_order( $builder );
			},
			self::CACHE_TTL
		);
	}

	/**
	 * Read a cached order, or fetch it once (behind a per-key stampede lock) and
	 * cache the result. A non-empty order is cached for $success_ttl; an empty
	 * result is cached only briefly so the next view picks up the order the server
	 * keeps computing after a budget timeout. While a fetch is in flight, other
	 * callers fail-open with []. Shared by get_order() and search().
	 *
	 * @param string   $key         Transient cache key.
	 * @param callable $fetch       Performs the network call; returns ordered slugs.
	 * @param int      $success_ttl TTL (seconds) for a non-empty result.
	 *
	 * @return array<int, string>
	 */
	private static function cached_order( $key, callable $fetch, $success_ttl ) {
		$cached = get_transient( $key );
		if ( is_array( $cached ) ) {
			return $cached;
		}

		$lock = $key . '_lock';
		if ( get_transient( $lock ) ) {
			return array();
		}
		set_transient( $lock, 1, 2 * MINUTE_IN_SECONDS );

		try {
			$order = (array) call_user_func( $fetch );
		} finally {
			// Always release the stampede lock — even if the fetch throws — so a single
			// failure can't block retries for the full 2-minute lock TTL.
			delete_transient( $lock );
		}

		set_transient( $key, $order, ! empty( $order ) ? $success_ttl : 2 * MINUTE_IN_SECONDS );

		return $order;
	}

	/**
	 * Free-text semantic search over the catalog via the AI proxy. Returns an
	 * ordered list of matching slugs (best first), or [] on failure/no match.
	 * Cached per query+builder. Intended for an AJAX/REST context.
	 *
	 * @param string $query   Search query.
	 * @param string $builder Editor key.
	 *
	 * @return array<int, string>
	 */
	public static function search( $query, $builder ) {
		$query = trim( (string) $query );
		if ( '' === $query ) {
			return array();
		}
		$builder = ( 'elementor' === $builder ) ? 'elementor' : 'gutenberg';
		$key     = 'tpc_starter_search_' . self::VERSION . '_' . $builder . '_' . md5( strtolower( $query ) );

		return self::cached_order(
			$key,
			static function () use ( $builder, $query ) {
				return self::fetch_order( $builder, $query, self::SEARCH_BUDGET );
			},
			6 * HOUR_IN_SECONDS
		);
	}

	/**
	 * Call the workflow (start → poll) and return the ordered slugs.
	 * Fail-open: returns [] on any error/timeout.
	 *
	 * @param string      $builder Editor key.
	 * @param string|null $query   Optional free-text search query (search mode).
	 *
	 * @return array<int, string>
	 */
	private static function fetch_order( $builder, $query = null, $budget = null ) {
		// Start the deadline BEFORE the (up to 5s) start POST so the total round-trip
		// stays within budget rather than start-time + budget.
		$deadline = time() + ( null !== $budget ? (int) $budget : self::REQUEST_BUDGET );
		$start    = self::base_url() . '/api/workflows/' . self::SLUG . '/start';
		$body     = array(
			'site_url' => home_url(),
			'builder'  => $builder,
		);
		if ( null !== $query && '' !== $query ) {
			$body['query'] = $query;
		}

		$response = wp_remote_post(
			$start,
			array(
				'timeout' => 5,
				'headers' => self::headers(),
				'body'    => wp_json_encode( $body ),
			)
		);

		if ( is_wp_error( $response ) ) {
			return array();
		}

		$code = (int) wp_remote_retrieve_response_code( $response );
		$body = json_decode( wp_remote_retrieve_body( $response ), true );

		// A workflow may complete synchronously (returns order) or queue (poll).
		$order = self::parse_order( $body );
		if ( ! empty( $order ) ) {
			return $order;
		}

		if ( 200 !== $code && 202 !== $code ) {
			return array();
		}

		$workflow_id = is_array( $body ) && ! empty( $body['workflowId'] ) ? $body['workflowId'] : '';
		if ( '' === $workflow_id ) {
			return array();
		}

		return self::poll_order( $workflow_id, $deadline );
	}

	/**
	 * Poll the status endpoint until the workflow completes or the budget runs out.
	 *
	 * @param string $workflow_id Workflow run id.
	 *
	 * @return array<int, string>
	 */
	private static function poll_order( $workflow_id, $deadline = null ) {
		$deadline   = null !== $deadline ? (int) $deadline : ( time() + self::REQUEST_BUDGET );
		$status_url = self::base_url() . '/api/workflows/' . self::SLUG . '/' . rawurlencode( $workflow_id );

		while ( time() < $deadline ) {
			usleep( 600000 ); // 0.6s between polls.

			// Cap each poll to the remaining budget so total wall-clock can't blow
			// past REQUEST_BUDGET (a 5s poll started near the deadline would).
			$remaining = $deadline - time();
			if ( $remaining <= 0 ) {
				break;
			}

			$response = wp_remote_get(
				$status_url,
				array(
					'timeout' => min( 5, $remaining ),
					'headers' => self::headers(),
				)
			);
			if ( is_wp_error( $response ) ) {
				continue; // a single flaky poll shouldn't abort the whole budget
			}

			$body   = json_decode( wp_remote_retrieve_body( $response ), true );
			$status = is_array( $body ) && isset( $body['status'] ) ? $body['status'] : '';

			if ( 'completed' === $status ) {
				return self::parse_order( $body );
			}
			if ( 'failed' === $status ) {
				return array();
			}
		}

		return array();
	}

	/**
	 * Request headers for the proxy: licensing bearer + the required site URL.
	 *
	 * @return array<string, string>
	 */
	private static function headers() {
		$headers = array(
			'Content-Type' => 'application/json',
			'Accept'       => 'application/json',
			'X-Site-Url'   => home_url(),
		);

		$license = apply_filters( 'tiob_license_key', 'free' );
		if ( is_string( $license ) && '' !== $license && 'free' !== $license ) {
			// The proxy base64-decodes the bearer (falling back to the raw value).
			$headers['Authorization'] = 'Bearer ' . base64_encode( $license );
		}

		return $headers;
	}

	/**
	 * Extract the ordered slug list from a workflow response body. The order may
	 * sit at the top level (sync) or under `output` (async status).
	 *
	 * @param mixed $body Decoded JSON response.
	 *
	 * @return array<int, string>
	 */
	public static function parse_order( $body ) {
		if ( ! is_array( $body ) ) {
			return array();
		}

		$order = array();
		if ( isset( $body['output']['order'] ) && is_array( $body['output']['order'] ) ) {
			$order = $body['output']['order'];
		} elseif ( isset( $body['order'] ) && is_array( $body['order'] ) ) {
			$order = $body['order'];
		}

		return array_values( array_filter( array_map( 'strval', $order ) ) );
	}
}
