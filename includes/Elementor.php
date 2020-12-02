<?php
/**
 * Handles code for Elementor.
 *
 * @package    templates-patterns-collection
 */

namespace TIOB;

/**
 * Class Editor
 *
 * @package templates-patterns-collection
 */
class Elementor {

	/**
	 * Initialize the Admin.
	 */
	public function init() {
		add_action( 'elementor/editor/before_enqueue_scripts', array( $this, 'register_script' ), 999 );
	}

	/**
	 * Register editor blocks.
	 */
	public function register_script() {
		$deps = require( TIOB_PATH . 'elementor/build/index.asset.php' );

		wp_enqueue_script(
			'ti-tpc-elementor',
			TIOB_URL . 'elementor/build/index.js',
			array_merge( $deps['dependencies'], [ 'jquery', 'elementor-editor' ] ),
			$deps['version'],
			true
		);

		wp_enqueue_style( 'wp-components' );

		wp_localize_script(
			'ti-tpc-elementor',
			'tiTpc',
			apply_filters(
				'ti_tpc_editor_data',
				array(
					'endpoint'        => TPC_TEMPLATES_CLOUD_ENDPOINT,
					'params'          => array(
						'site_url'   => get_site_url(),
						'license_id' => apply_filters( 'product_neve_license_key', 'free' ),
					),
					'canPredefine'    => apply_filters( 'ti_tpc_can_predefine', false ),
					'exportLabel'     => __( 'Save to Templates Cloud' ),
					'modalLabel'      => __( 'Save Templates' ),
					'textLabel'       => __( 'Template Name' ),
					'textPlaceholder' => __( 'Template' ),
					'buttonLabel'     => __( 'Save' ),
				)
			)
		);
	}
}
