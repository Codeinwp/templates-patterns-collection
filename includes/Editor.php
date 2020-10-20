<?php
/**
 * Handles code for Block Editor.
 *
 * @package    templates-patterns-collection
 */

namespace TIOB;

/**
 * Class Editor
 *
 * @package templates-patterns-collection
 */
class Editor {

	/**
	 * Initialize the Admin.
	 */
	public function init() {
		define( 'TPC_TEMPLATES_CLOUD_ENDPOINT', 'https://api.themeisle.com/templates-cloud/templates/' );

		add_action( 'init', array( $this, 'register_block' ), 11 );
		add_action( 'init', array( $this, 'register_post_meta' ), 11 );
	}

	/**
	 * Register editor blocks.
	 */
	public function register_block() {
		wp_register_script(
			'ti-tpc-block',
			TIOB_URL . 'editor/build/index.js',
			array( 'wp-i18n', 'wp-blocks', 'wp-block-editor', 'wp-components', 'wp-compose', 'wp-data', 'wp-edit-post', 'wp-element', 'wp-plugins', 'wp-primitives' ),
			time()
		);
	
		wp_localize_script(
			'ti-tpc-block',
			'tiTpc',
			array(
				'endpoint' => TPC_TEMPLATES_CLOUD_ENDPOINT,
				'params'   => array(
					'site_url'   => get_site_url(),
					'license_id' => apply_filters( 'product_neve_license_key', 'free' ),
				),
			)
		);
	
		wp_register_style(
			'ti-tpc-block',
			TIOB_URL . 'editor/build/index.css',
			array(),
			time()
		);
	
		register_block_type(
			'ti-tpc/templates-cloud',
			array(
				'editor_script' => 'ti-tpc-block',
				'editor_style'  => 'ti-tpc-block',
			)
		);
	}

	/**
	 * Register post meta.
	 */
	public function register_post_meta() {
		register_post_meta(
			'post',
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
			'post',
			'_ti_tpc_template_id',
			array(
				'show_in_rest'  => true,
				'single'        => true,
				'type'          => 'string',
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}
}
