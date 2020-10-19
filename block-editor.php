<?php
/**
 * This file contains logic for the Block Editor part of things.
 */

define( 'TPC_TEMPLATES_CLOUD_ENDPOINT', 'https://api.themeisle.com/templates-cloud/templates/' );

function ti_tpc_register_block() {
	wp_register_script(
		'ti-tpc-block',
		plugins_url( 'editor/build/index.js', __FILE__ ),
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
		plugins_url( 'editor/build/index.css', __FILE__ ),
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

add_action( 'init', 'ti_tpc_register_block' );

function ti_tpc_register_post_meta() {
	register_post_meta(
		'post',
		'_template_sync',
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
		'_template_id',
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

add_action( 'init', 'ti_tpc_register_post_meta' );
