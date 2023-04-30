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

	/**
	 * White label config
	 *
	 * @var array
	 */
	private $wl_config = null;

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
		$white_label_module = get_option( 'nv_pro_white_label_status' );
		if ( ! empty( $white_label_module ) && (bool) $white_label_module === true ) {
			$branding = get_option( 'ti_white_label_inputs' );
			if ( ! empty( $branding ) ) {
				$this->wl_config = json_decode( $branding, true );
			}
		}

		if ( isset( $this->wl_config['my_library'] ) && (bool) $this->wl_config['my_library'] === true ) {
			return false;
		}

		if ( ! defined( 'TPC_TEMPLATES_CLOUD_ENDPOINT' ) ) {
			define( 'TPC_TEMPLATES_CLOUD_ENDPOINT', 'https://api.themeisle.com/templates-cloud/' );
		}
		add_action( 'enqueue_block_editor_assets', array( $this, 'register_block' ), 11 );
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
			array_merge( $deps['dependencies'], array( 'wp-api' ) ),
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
