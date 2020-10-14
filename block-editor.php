<?php
/**
 * This file contains logic for the Block Editor part of things.
 */

define( 'TPC_TEMPLATES_CLOUD_ENDPOINT', 'https://api.themeisle.com/templates-cloud/templates/' );

function ti_tpc_register_block() {
	wp_register_script(
		'ti-tpc-block',
		plugins_url( 'build/index.js', __FILE__ ),
		array( 'wp-i18n', 'wp-blocks', 'wp-components', 'wp-data', 'wp-element', 'wp-primitives' ),
		time()
	);

	wp_localize_script( 'ti-tpc-block', 'tiTpc', array(
		'endpoint' => TPC_TEMPLATES_CLOUD_ENDPOINT,
		'params'   => array(
			'site_url'   => get_site_url(),
			'license_id' => apply_filters( 'product_neve_license_key', 'free' )
		)
	) );

	wp_register_style(
		'ti-tpc-block',
		plugins_url( 'build/editor.css', __FILE__ ),
		array(),
		time()
	);

	register_block_type( 'themeisle-blocks/templates-cloud', array(
		'editor_script' => 'ti-tpc-block',
		'editor_style' => 'ti-tpc-block',
	) );
}

add_action( 'init', 'ti_tpc_register_block' );
