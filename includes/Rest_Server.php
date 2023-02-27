<?php
/**
 * Rest Endpoints Handler.
 *
 * @package         templates-patterns-collection
 */

namespace TIOB;

use TIOB\Importers\Cleanup\Manager;
use TIOB\TI_Beaver;
use TIOB\Importers\Content_Importer;
use TIOB\Importers\Plugin_Importer;
use TIOB\Importers\Theme_Mods_Importer;
use TIOB\Importers\Widgets_Importer;
use TIOB\Importers\Zelle_Importer;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use FLBuilderModel;

/**
 * Class Rest_Server
 */
class Rest_Server {
	/**
	 * Initialize the rest functionality.
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'rest_api_init', array( $this, 'register_endpoints' ) );
	}

	/**
	 * Register endpoints.
	 */
	public function register_endpoints() {
		register_rest_route(
			Main::API_ROOT,
			'/refresh_sites_data',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_sites_data' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);

		register_rest_route(
			Main::API_ROOT,
			'/install_plugins',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'run_plugin_importer' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);

		register_rest_route(
			Main::API_ROOT,
			'/import_content',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'run_xml_importer' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
		register_rest_route(
			Main::API_ROOT,
			'/import_theme_mods',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'run_theme_mods_importer' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
		register_rest_route(
			Main::API_ROOT,
			'/import_widgets',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'run_widgets_importer' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
		register_rest_route(
			Main::API_ROOT,
			'/migrate_frontpage',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'run_front_page_migration' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
		register_rest_route(
			Main::API_ROOT,
			'/dismiss_migration',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'dismiss_migration' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
		register_rest_route(
			Main::API_ROOT,
			'/import_single_templates',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'import_templates' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);

		register_rest_route(
			Main::API_ROOT,
			'/cleanup',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'run_cleanup' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);
	}

	public function run_cleanup() {

		return new WP_REST_Response(
			array(
				'success' => true,
				'data'    => Manager::instance()->do_cleanup(),
			)
		);
	}

	/**
	 * Refreshes the sites data.
	 */
	public function get_sites_data() {
		return new WP_REST_Response(
			array(
				'success' => true,
				'data'    => Main::instance()->admin->get_sites_data(),
			)
		);
	}

	/**
	 * Run the plugin importer.
	 *
	 * @param WP_REST_Request $request the async request.
	 *
	 * @return WP_REST_Response
	 */
	public function run_plugin_importer( WP_REST_Request $request ) {
		$plugin_importer = new Plugin_Importer();
		return $plugin_importer->install_plugins( $request );
	}

	/**
	 * Run the XML importer.
	 *
	 * @param WP_REST_Request $request the async request.
	 *
	 * @return WP_REST_Response
	 */
	public function run_xml_importer( WP_REST_Request $request ) {
		$content_importer = new Content_Importer();
		$import           = $content_importer->import_remote_xml( $request );
		set_transient( 'ti_tpc_should_flush_permalinks', 'yes', 12 * HOUR_IN_SECONDS );
		if ( get_option( 'neve_notice_dismissed', 'no' ) !== 'yes' ) {
			update_option( 'neve_notice_dismissed', 'yes' );
		}

		return $import;
	}

	/**
	 * Run the theme mods importer.
	 *
	 * @param WP_REST_Request $request the async request.
	 *
	 * @return WP_REST_Response
	 */
	public function run_theme_mods_importer( WP_REST_Request $request ) {
		$customizer_importer = new Theme_Mods_Importer();
		return $customizer_importer->import_theme_mods( $request );
	}

	/**
	 * Run the widgets importer.
	 *
	 * @param WP_REST_Request $request the async request.
	 *
	 * @return WP_REST_Response
	 */
	public function run_widgets_importer( WP_REST_Request $request ) {
		$widgets_importer = new Widgets_Importer();
		$import           = $widgets_importer->import_widgets( $request );

		set_theme_mod( 'ti_content_imported', 'yes' );

		return $import;
	}

	/**
	 * Run front page migration.
	 *
	 * @param WP_REST_Request $request
	 *
	 * @return WP_REST_Response
	 */
	public function run_front_page_migration( WP_REST_Request $request ) {
		$params = $request->get_json_params();

		if ( ! isset( $params['template'] ) || ! isset( $params['template_name'] ) ) {
			return new WP_REST_Response(
				array(
					'data'    => 'ti__ob_rest_err_5',
					'success' => false,
				)
			);
		}

		$migrator  = new Zelle_Importer();
		$old_theme = get_theme_mod( 'ti_prev_theme', 'ti_onboarding_undefined' );
		$import    = $migrator->import_zelle_frontpage( $params['template'], $old_theme );

		if ( is_wp_error( $import ) ) {
			return new WP_REST_Response(
				array(
					'data'    => $import->get_error_code(),
					'success' => false,
				)
			);
		}

		return new WP_REST_Response(
			array(
				'success' => true,
				'data'    => $import,
			)
		);
	}

	/**
	 * Dismiss the front page migration notice.
	 *
	 * @param WP_REST_Request $request
	 *
	 * @return WP_REST_Response
	 */
	public function dismiss_migration( WP_REST_Request $request ) {
		$params = $request->get_json_params();
		if ( ! isset( $params['theme_mod'] ) ) {
			return new WP_REST_Response(
				array(
					'data'    => 'ti__ob_rest_err_8',
					'success' => false,
				)
			);
		}
		set_theme_mod( $params['theme_mod'], 'yes' );

		return new WP_REST_Response( array( 'success' => true ) );
	}

	/**
	 * Import Templates.
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response
	 */
	public function import_templates( WP_REST_Request $request ) {
		$params   = $request->get_json_params();
		$imported = array();
		foreach ( $params as $template ) {
			$id = $this->insert_single_template( $template );

			if ( $id instanceof \WP_Error ) {
				return new WP_REST_Response(
					array(
						'success' => false,
						'message' => $id->get_error_message(),
					)
				);
			}

			$imported[] = array(
				'title' => get_the_title( $id ),
				'url'   => get_post_permalink( $id ),
				'edit'  => add_query_arg(
					array(
						'post'   => $id,
						'action' => 'edit',
					),
					admin_url( 'post.php' )
				),
			);
		}

		$count = get_option( Admin::IMPORTED_TEMPLATES_COUNT_OPT, 0 );
		update_option( Admin::IMPORTED_TEMPLATES_COUNT_OPT, intval( $count ) + sizeof( $imported ) );

		error_log( var_export( get_option( Admin::IMPORTED_TEMPLATES_COUNT_OPT, 0 ), true ) );

		return new WP_REST_Response(
			array(
				'success' => true,
				'pages'   => $imported,
			)
		);
	}

	/**
	 * Insert Single Template
	 *
	 * @param $template
	 * @return int|\WP_Error
	 */
	private function insert_single_template( $template ) {
		add_filter(
			'wp_insert_post_data',
			array( $this, 'parse_global_colors_unicode' ),
			10,
			2
		);

		$page_template = '';
		$post_type     = 'page';

		if ( 'gutenberg' !== $template['template_type'] ) {
			$page_template = 'page-templates/template-pagebuilder-full-width.php';
		}

		if ( isset( $template['meta'] ) ) {
			$meta = json_decode( $template['meta'], true );
			if ( isset( $meta['_wp_page_template'] ) ) {
				$page_template = $meta['_wp_page_template'];
			}

			if (
				isset( $meta['postType'] ) &&
				in_array( $meta['postType'], Editor::get_allowed_post_types(), true ) &&
				post_type_exists( $meta['postType'] )
			) {
				$post_type = $meta['postType'];
			}
		}

		if ( 'beaver' === $template['template_type'] ) {
			if ( class_exists( 'FLBuilderModel' ) ) {
				$response = TI_Beaver::get_template_content( $template['template_id'] );
			}

			$post_id = wp_insert_post(
				array(
					'post_title'    => wp_strip_all_tags( $template['template_name'] ),
					'post_status'   => 'publish',
					'post_type'     => 'page',
					'page_template' => $page_template,
					'meta_input'    => isset( $template['meta'] ) ? json_decode( $template['meta'], true ) : array(),
				)
			);

			if ( class_exists( 'FLBuilderModel' ) ) {
				if ( isset( $response->nodes ) ) {
					FLBuilderModel::update_layout_data( $response->nodes, 'published', $post_id );
				}

				if ( isset( $response->settings ) ) {
					FLBuilderModel::update_layout_settings( $response->settings, 'published', $post_id );
				}
				update_post_meta( $post_id, '_fl_builder_enabled', true );
			}

			return $post_id;
		}

		if ( 'elementor' === $template['template_type'] ) {
			return wp_insert_post(
				array(
					'post_title'    => wp_strip_all_tags( $template['template_name'] ),
					'post_status'   => 'publish',
					'post_type'     => 'page',
					'page_template' => $page_template,
					'meta_input'    => array_merge(
						array(
							'_elementor_data'          => $template['content'],
							'_elementor_template_type' => 'wp-page',
							'_elementor_edit_mode'     => 'builder',
						),
						isset( $template['meta'] ) ? json_decode( $template['meta'], true ) : array()
					),
				)
			);
		}

		return wp_insert_post(
			array(
				'post_title'    => wp_strip_all_tags( $template['template_name'] ),
				'post_content'  => wp_kses_post( $template['content'] ),
				'post_status'   => 'publish',
				'post_type'     => $post_type,
				'page_template' => $page_template,
				'meta_input'    => isset( $template['meta'] ) ? json_decode( $template['meta'], true ) : array(),
			)
		);
	}

	/**
	 * Parse global colors unicode.
	 *
	 * @param array $data    post data
	 * @param array $post_arr post array.
	 *
	 * @return array
	 */
	public function parse_global_colors_unicode( $data, $post_arr ) {
		$data['post_content'] = str_replace( 'var(\\u002d\\u002dnv', 'var(--nv', $data['post_content'] );

		return $data;
	}
}
