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
		add_action( 'elementor/editor/before_enqueue_styles', array( $this, 'register_style' ) );
		add_action( 'elementor/preview/enqueue_styles', array( $this, 'register_style' ) );
	}

	/**
	 * Register editor blocks.
	 */
	public function register_script() {
		$deps = require( TIOB_PATH . 'elementor/build/index.asset.php' );

		wp_enqueue_script(
			'ti-tpc-elementor',
			TIOB_URL . 'elementor/build/index.js',
			array_merge( $deps['dependencies'], [ 'elementor-editor' ] ),
			$deps['version'],
			true
		);

		wp_localize_script(
			'ti-tpc-elementor',
			'tiTpc',
			apply_filters(
				'ti_tpc_editor_data',
				array(
					'endpoint'     => TPC_TEMPLATES_CLOUD_ENDPOINT,
					'params'       => array(
						'site_url'   => get_site_url(),
						'license_id' => apply_filters( 'product_neve_license_key', 'free' ),
						'type'       => 'elementor',
					),
					'canPredefine' => apply_filters( 'ti_tpc_can_predefine', false ),
					'exporter'     => array(
						'exportLabel'     => __( 'Save to Templates Cloud' ),
						'modalLabel'      => __( 'Save Templates' ),
						'textLabel'       => __( 'Template Name' ),
						'textPlaceholder' => __( 'Template' ),
						'buttonLabel'     => __( 'Save' ),
					),
					'library'      => array(
						'libraryButton'   => __( 'Import from Templates Cloud' ),
						'templatesCloud'  => __( 'Templates Cloud' ),
						'tabs'            => array(
							'templates' => __( 'Page Templates' ),
							'library'   => __( 'My Library' ),
						),
						'actions'         => array(
							'sync'   => __( 'Sync Library' ),
							'close'  => __( 'Close' ),
							'insert' => __( 'Insert' ),
							'back'   => __( 'Back to Library' ),
						),
					),
				)
			)
		);
	}

	/**
	 * Register editor styles.
	 */
	public function register_style() {
		$deps = require( TIOB_PATH . 'elementor/build/index.asset.php' );

		wp_enqueue_style(
			'ti-tpc-elementor-styles',
			TIOB_URL . 'elementor/build/index.css',
			[ 'wp-components' ],
			$deps['version']
		);
	}
}