<?php
/**
 * Personalized starter-site ordering.
 *
 * @package templates-patterns-collection
 */

namespace TIOB;

/**
 * Class Starter_Ranking
 */
class Starter_Ranking {

	const DEFAULT_BASE   = 'https://ai.themeisle.com';
	const SLUG           = 'neve-starter-ranking';
	const VERSION        = 'v2';
	const CACHE_TTL      = 7 * DAY_IN_SECONDS;
	const REQUEST_BUDGET = 6;
	const SEARCH_BUDGET  = 8;

	private static function base_url() {
		if ( defined( 'TPC_AI_PROXY_URL' ) && ! empty( TPC_AI_PROXY_URL ) ) {
			return rtrim( TPC_AI_PROXY_URL, '/' );
		}

		return rtrim( apply_filters( 'tpc_ai_proxy_url', self::DEFAULT_BASE ), '/' );
	}

	private static function cache_key( $builder ) {
		return 'tpc_starter_order_' . self::VERSION . '_' . $builder;
	}

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
			delete_transient( $lock );
		}

		set_transient( $key, $order, ! empty( $order ) ? $success_ttl : 2 * MINUTE_IN_SECONDS );

		return $order;
	}

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

	private static function fetch_order( $builder, $query = null, $budget = null ) {
		$deadline = time() + ( null !== $budget ? (int) $budget : self::REQUEST_BUDGET );
		$start    = self::base_url() . '/api/workflows/' . self::SLUG . '/start';
		$body     = array(
			'site_url'   => home_url(),
			'site_title' => sanitize_text_field( get_bloginfo( 'name' ) ),
			'builder'    => $builder,
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

	private static function poll_order( $workflow_id, $deadline = null ) {
		$deadline   = null !== $deadline ? (int) $deadline : ( time() + self::REQUEST_BUDGET );
		$status_url = self::base_url() . '/api/workflows/' . self::SLUG . '/' . rawurlencode( $workflow_id );

		while ( time() < $deadline ) {
			usleep( 600000 );

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
				continue;
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

	private static function headers() {
		$headers = array(
			'Content-Type' => 'application/json',
			'Accept'       => 'application/json',
			'X-Site-Url'   => home_url(),
		);

		$license = apply_filters( 'tiob_license_key', 'free' );
		if ( is_string( $license ) && '' !== $license && 'free' !== $license ) {
			$headers['Authorization'] = 'Bearer ' . base64_encode( $license );
		}

		return $headers;
	}

	public static function parse_order( $body ) {
		if ( ! is_array( $body ) ) {
			return array();
		}

		$output = array();
		if ( isset( $body['output'] ) ) {
			if ( is_array( $body['output'] ) ) {
				$output = $body['output'];
			} elseif ( is_string( $body['output'] ) ) {
				$decoded_output = json_decode( $body['output'], true );
				if ( is_array( $decoded_output ) ) {
					$output = $decoded_output;
				}
			}
		}

		$order = array();
		if ( isset( $output['order'] ) && is_array( $output['order'] ) ) {
			$order = $output['order'];
		} elseif ( isset( $body['order'] ) && is_array( $body['order'] ) ) {
			$order = $body['order'];
		}

		return array_values( array_filter( array_map( 'strval', $order ) ) );
	}
}
