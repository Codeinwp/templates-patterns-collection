<?php
/**
 * Plugin Name: TPC E2E Mocks
 * Description: Test-only mu-plugin that short-circuits all external HTTP calls made by templates-patterns-collection so the Playwright suite runs offline and deterministic. Loaded only when the TPC_E2E constant is set by .wp-env.json.
 *
 * @package templates-patterns-collection
 */

if ( ! defined( 'TPC_E2E' ) || ! TPC_E2E || wp_get_environment_type() === 'production' ) {
	return;
}

define( 'TPC_E2E_FIXTURES_DIR', __DIR__ . '/fixtures' );
define( 'TPC_E2E_CONTENT_XML_URL', 'https://demo.themeisle.com/neve-charity/export.xml' );

// Pre-seed a valid tier-3 license so license-gated modules load from the very
// first request. Must be in place before plugins_loaded reads it — hence file
// scope, not a hook. update_option is a no-op once the values are set.
update_option( 'templates_patterns_collection_license', 'tpc-e2e-key' );
if ( ! is_object( get_option( 'templates_patterns_collection_license_data' ) ) ) {
	update_option(
		'templates_patterns_collection_license_data',
		(object) array(
			'license'    => 'valid',
			'key'        => 'tpc-e2e-key',
			'tier'       => 3,
			'expiration' => '',
		)
	);
}

// The Templates Cloud dashboard (admin.php?page=tiob-plugin) and the editor
// integration only load for "legacy TC" installs (tiob_tc_removed === 'no'),
// while the onboarding surface behaves differently in that mode — the two
// states are mutually exclusive, so specs toggle it per suite via this route.
add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'tpc-e2e/v1',
			'/legacy-tc',
			array(
				'methods'             => 'POST',
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
				'callback'            => function ( $request ) {
					update_option( 'tiob_tc_removed', $request->get_param( 'enabled' ) ? 'no' : 'yes' );
					return rest_ensure_response( array( 'success' => true ) );
				},
			)
		);

		register_rest_route(
			'tpc-e2e/v1',
			'/api-mode',
			array(
				'methods'             => 'POST',
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
				'args'                => array(
					'mode' => array(
						'type' => 'string',
						'enum' => array( '', 'down', 'invalid', 'personal' ),
					),
				),
				'callback'            => function ( $request ) {
					update_option( 'tpc_e2e_api_mode', $request->get_param( 'mode' ) );
					// Drop cached remote data (stored license, starter-ranking
					// order) so the next request reflects the new mode.
					delete_option( 'templates_patterns_collection_license_data' );
					delete_transient( 'templates_patterns_collection_license_check' );
					foreach ( array( 'gutenberg', 'elementor' ) as $builder ) {
						delete_transient( 'tpc_starter_order_v2_' . $builder );
					}
					return rest_ensure_response( array( 'success' => true ) );
				},
			)
		);
	}
);

/**
 * Build a WP_Http-shaped 200 response.
 *
 * @param string $body Response body.
 * @param array  $headers Extra headers.
 * @return array
 */
function tpc_e2e_response( $body, $headers = array() ) {
	return array(
		'response' => array(
			'code'    => 200,
			'message' => 'OK',
		),
		'headers'  => array_merge( array( 'content-type' => 'application/json' ), $headers ),
		'body'     => $body,
		'cookies'  => array(),
	);
}

add_filter(
	'pre_http_request',
	function ( $preempt, $args, $url ) {
		if ( false !== $preempt ) {
			return $preempt;
		}

		$is_themeisle_api = false !== strpos( $url, 'api.themeisle.com' ) || false !== strpos( $url, 'ai.themeisle.com' );

		// Scenario modes (Otter pattern), set per spec via tpc-e2e/v1/api-mode:
		// 'down'     => ThemeIsle APIs unreachable.
		// 'invalid'  => license check rejects the key (a code/message body is
		//               what License::check_license treats as invalid).
		// 'personal' => the key is accepted, on a tier that does not include
		//               Templates Cloud.
		$mode = get_option( 'tpc_e2e_api_mode', '' );

		if ( 'down' === $mode && $is_themeisle_api ) {
			return new WP_Error( 'http_request_failed', 'TPC E2E: API unreachable.' );
		}

		if ( 'invalid' === $mode && false !== strpos( $url, 'api.themeisle.com/templates-cloud/' ) ) {
			return tpc_e2e_response(
				wp_json_encode(
					array(
						'code'    => 'invalid_license',
						'message' => 'TPC E2E: invalid license.',
					)
				)
			);
		}

		// A valid license on a tier that does not include Templates Cloud.
		// Must match PERSONAL_LICENSE in config/mocks.js.
		if ( 'personal' === $mode && false !== strpos( $url, 'api.themeisle.com/templates-cloud/' ) ) {
			return tpc_e2e_response(
				wp_json_encode(
					array(
						'license' => 'valid',
						'key'     => 'tpc-e2e-personal-key',
						'tier'    => 2,
						'expires' => 'lifetime',
					)
				)
			);
		}

		// Starter sites feed (Sites_Listing::API).
		if ( false !== strpos( $url, 'api.themeisle.com/sites/wp-json/demosites-api/sites' ) ) {
			return tpc_e2e_response( file_get_contents( TPC_E2E_FIXTURES_DIR . '/sites.json' ) );
		}

		// Templates Cloud: license check (License::check_license) and any other
		// server-side cloud call. A 200 body without code/message keys is treated
		// as a valid license; `license` !== not_active/invalid => active.
		if ( false !== strpos( $url, 'api.themeisle.com/templates-cloud/' ) ) {
			return tpc_e2e_response(
				wp_json_encode(
					array(
						'license'    => 'valid',
						'key'        => 'tpc-e2e-key',
						'tier'       => 3,
						'expiration' => '',
					)
				)
			);
		}

		// Starter ranking workflow (Starter_Ranking): returning the order directly
		// in the /start response makes parse_order() succeed and skips polling.
		if ( false !== strpos( $url, 'ai.themeisle.com/api/workflows/neve-starter-ranking' ) ) {
			$sites = json_decode( file_get_contents( TPC_E2E_FIXTURES_DIR . '/sites.json' ), true );
			return tpc_e2e_response(
				wp_json_encode(
					array(
						'status' => 'completed',
						'output' => array( 'order' => array_keys( $sites['gutenberg'] ) ),
					)
				)
			);
		}

		if ( false !== strpos( $url, 'demo.themeisle.com' ) ) {
			// Demo content XML fetched by Content_Importer via the content_file URL
			// that our mocked demo-data payload points here. Reuses the PHPUnit fixture.
			if ( false !== strpos( $url, 'export.xml' ) ) {
				return tpc_e2e_response(
					file_get_contents( WP_PLUGIN_DIR . '/templates-patterns-collection/tests/fixtures/export.xml' ),
					array( 'content-type' => 'text/xml' )
				);
			}

			// Demo-data endpoint. Server-side safety net only — the browser fetch is
			// mocked in the specs via page.route.
			if ( false !== strpos( $url, 'ti-demo-data/data' ) ) {
				$data                 = json_decode( file_get_contents( WP_PLUGIN_DIR . '/templates-patterns-collection/tests/fixtures/data.json' ), true );
				$data['content_file'] = TPC_E2E_CONTENT_XML_URL;
				return tpc_e2e_response( wp_json_encode( $data ) );
			}

			// Attachments referenced by export.xml. WP_Import::fetch_remote_file()
			// downloads these streamed to a file; a pre_http_request short-circuit
			// skips WP's own streaming, so write the file ourselves and report a
			// matching content-length (WP_Import errors on any mismatch or zero size).
			if ( false !== strpos( $url, '/wp-content/uploads/' ) ) {
				$gif = base64_decode( 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' );
				if ( ! empty( $args['stream'] ) && ! empty( $args['filename'] ) ) {
					file_put_contents( $args['filename'], $gif );
				}
				return tpc_e2e_response(
					empty( $args['stream'] ) ? $gif : '',
					array(
						'content-type'   => 'image/gif',
						'content-length' => (string) strlen( $gif ),
					)
				);
			}
		}

		return $preempt;
	},
	10,
	3
);

// Bust the plugin's remote-data caches so every run re-hits the (mocked) APIs
// instead of serving a stale cache from a previous, possibly unmocked, run.
add_action(
	'init',
	function () {
		if ( defined( 'TIOB_VERSION' ) ) {
			delete_transient( 'tiob_sites_' . TIOB_VERSION );
		}
		delete_transient( 'templates_patterns_collection_license_check' );
	}
);
