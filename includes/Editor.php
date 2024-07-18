<?php
/**
 * Handles code for Block Editor.
 *
 * @package    templates-patterns-collection
 */

namespace TIOB;

use TIOB\Main;

/**
 * Class Editor
 *
 * @package templates-patterns-collection
 */
class Editor {
	use White_Label_Config;

	const ALLOWED_POST_TYPES = array( 'post', 'page', 'neve_custom_layouts' );

	/**
	 * Assets Handle.
	 *
	 * @var string
	 */
	private $handle = 'ti-tpc-block';

	/**
	 * Get allowed post types.
	 *
	 * @return array
	 */
	public static function get_allowed_post_types() {
		return apply_filters( 'ti_tpc_allowed_post_types', self::ALLOWED_POST_TYPES );
	}

	/**
	 * Initialize the Admin.
	 */
	public function init() {
		$this->setup_white_label();

		if ( $this->is_library_disabled() ) {
			return;
		}

		if ( ! defined( 'TPC_TEMPLATES_CLOUD_ENDPOINT' ) ) {
			define( 'TPC_TEMPLATES_CLOUD_ENDPOINT', Admin::get_templates_cloud_endpoint() );
		}
		add_action( 'enqueue_block_editor_assets', array( $this, 'register_block' ), 11 );
		$this->tpc_register_settings();
		$this->register_post_meta();
	}

	/**
	 * Register editor blocks.
	 */
	public function register_block() {
		$deps = require( TIOB_PATH . 'editor/build/index.asset.php' );

		$screen = get_current_screen();
		if ( ! isset( $screen->id ) ) {
			return;
		}

		if ( $screen->id === 'widgets' ) {
			return;
		}

		wp_register_script(
			$this->handle,
			TIOB_URL . 'editor/build/index.js',
			array_merge( $deps['dependencies'], array( 'wp-api', 'regenerator-runtime' ) ),
			$deps['version']
		);

		wp_localize_script(
			$this->handle,
			'tiTpc',
			apply_filters(
				'ti_tpc_editor_data',
				array(
					'endpoint'     => TPC_TEMPLATES_CLOUD_ENDPOINT,
					'params'       => array(
						'site_url'   => get_site_url(),
						'license_id' => apply_filters( 'tiob_license_key', 'free' ),
						'type'       => 'gutenberg',
						'meta'       => Main::get_meta_fields( $post_id = get_the_ID(), $type = 'gutenberg' ),
					),
					'metaKeys'     => apply_filters( 'ti_tpc_template_meta', array(), $post_id = get_the_ID(), $type = 'gutenberg' ),
					'canPredefine' => apply_filters( 'ti_tpc_can_predefine', false ),
					'allowed_post' => self::get_allowed_post_types(),
					'isSiteEditor' => $screen->id === 'site-editor',
					'isFSETheme'   => Admin::is_fse_theme(),
				)
			)
		);

		wp_register_style(
			$this->handle,
			TIOB_URL . 'editor/build/index.css',
			array(),
			$deps['version']
		);

		wp_style_add_data( $this->handle, 'rtl', 'replace' );

		register_block_type(
			'ti-tpc/templates-cloud',
			array(
				'editor_script' => $this->handle,
				'editor_style'  => $this->handle,
			)
		);
	}

	/**
	 * Register global settings for FSE templates.
	 */
	public function tpc_register_settings() {
		$can_predefine = apply_filters( 'ti_tpc_can_predefine', false );
		$properties    = array(
			'_ti_tpc_template_id'   => array(
				'type' => 'string',
			),
			'_ti_tpc_template_sync' => array(
				'type' => 'boolean',
			),
		);
		if ( $can_predefine ) {
			$properties = array_merge(
				$properties,
				array(
					'__ti_tpc_screenshot_url' => array(
						'type' => 'string',
					),
					'_ti_tpc_site_slug'       => array(
						'type' => 'string',
					),
					'_ti_tpc_published'       => array(
						'type' => 'boolean',
					),
					'_ti_tpc_previewer_url'   => array(
						'type' => 'string',
					),
				)
			);
		}

		register_setting(
			'',
			'templates_patterns_collection_fse_templates',
			array(
				'default'      => '',
				'show_in_rest' => array(
					'schema' => array(
						'type'                 => 'object',
						'additionalProperties' => array(
							'type'       => 'object',
							'properties' => $properties,
						),
						'propertyNames'        => array(
							'type' => 'string', // Specify that the key is a string
						),
					),
				),
				'type'         => 'object',
			)
		);
	}

	/**
	 * Register post meta.
	 */
	public function register_post_meta() {
		register_post_meta(
			'',
			'_ti_tpc_template_sync',
			array(
				'show_in_rest'  => true,
				'single'        => true,
				'type'          => 'boolean',
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);

		register_post_meta(
			'',
			'_ti_tpc_template_id',
			array(
				'show_in_rest'  => true,
				'single'        => true,
				'type'          => 'string',
				'auth_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);

		if ( apply_filters( 'ti_tpc_can_predefine', false ) === false ) {
			return;
		}

		register_post_meta(
			'',
			'_ti_tpc_screenshot_url',
			array(
				'show_in_rest'  => true,
				'single'        => true,
				'type'          => 'string',
				'auth_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
		register_post_meta(
			'',
			'_ti_tpc_site_slug',
			array(
				'show_in_rest'  => true,
				'single'        => true,
				'type'          => 'string',
				'auth_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
		register_post_meta(
			'',
			'_ti_tpc_published',
			array(
				'show_in_rest'  => true,
				'single'        => true,
				'type'          => 'boolean',
				'auth_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}
}
