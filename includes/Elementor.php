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
		$is_pro = apply_filters( 'product_neve_license_key', 'free' );

		if ( $is_pro === 'free' ) {
			return;
		}

		$deps = require( TIOB_PATH . 'elementor/build/index.asset.php' );

		wp_enqueue_script(
			'ti-tpc-elementor',
			TIOB_URL . 'elementor/build/index.js',
			array_merge( $deps['dependencies'], array( 'elementor-editor', 'lodash', 'wp-api' ) ),
			$deps['version'],
			true
		);

		wp_localize_script(
			'ti-tpc-elementor',
			'tiTpc',
			apply_filters(
				'ti_tpc_editor_data',
				array(
					'endpoint'         => TPC_TEMPLATES_CLOUD_ENDPOINT,
					'params'           => array(
						'site_url'   => get_site_url(),
						'license_id' => apply_filters( 'product_neve_license_key', 'free' ),
						'type'       => 'elementor',
					),
					'canPredefine'     => apply_filters( 'ti_tpc_can_predefine', false ),
					'postType'         => get_post_type(),
					'placeholderIndex' => '-1',
					'exporter'         => array(
						'exportLabel'         => __( 'Save to Templates Cloud' ),
						'modalLabel'          => __( 'Save Templates' ),
						'textLabel'           => __( 'Template Name' ),
						'textPlaceholder'     => __( 'Template' ),
						'buttonLabel'         => __( 'Save' ),
						'toggleLabel'         => __( 'Automatically sync to the cloud' ),
						'templateSaved'       => __( 'Template Saved.' ),
						'templatePublished'   => __( 'Template Published.' ),
						'templateUnpublished' => __( 'Template Unpublished.' ),
					),
					'library'          => array(
						'libraryButton'  => __( 'Import from Templates Cloud' ),
						'templatesCloud' => __( 'Templates Cloud' ),
						'historyMessage' => __( 'Add Template from Templates Cloud:' ),
						'tabs'           => array(
							'templates' => __( 'Page Templates' ),
							'library'   => __( 'My Library' ),
						),
						'actions'        => array(
							'sync'      => __( 'Sync Library' ),
							'save'      => __( 'Save to Templates Cloud' ),
							'close'     => __( 'Close' ),
							'cancel'    => __( 'Cancel' ),
							'edit'      => __( 'Edit' ),
							'duplicate' => __( 'Duplicate' ),
							'delete'    => __( 'Delete' ),
							'insert'    => __( 'Insert' ),
							'back'      => __( 'Back to Library' ),
						),
						'filters'        => array(
							'sortLabel'   => __( 'Sory by' ),
							'sortLabels'  => array(
								'name'     => __( 'Name' ),
								'date'     => __( 'Date' ),
								'modified' => __( 'Last Modified' ),
								'actions'  => __( 'Actions' ),
							),
							'search'      => __( 'Search' ),
							'searchLabel' => __( 'Search Templates' ),
						),
						'export'         => array(
							'save'            => __( 'Save' ),
							'title'           => __( 'Save your page to Templates Cloud' ),
							'placeholder'     => __( 'Enter Template Name' ),
							'labelScreenshot' => __( 'Screenshot URL' ),
							'labelSlug'       => __( 'Site Slug' ),
							'publish'         => __( 'Publish' ),
							'unpublish'       => __( 'Unpublish' ),
							'defaultTitle'    => __( 'Template' ),
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
		$is_pro = apply_filters( 'product_neve_license_key', 'free' );

		if ( $is_pro === 'free' ) {
			return;
		}

		$deps = require( TIOB_PATH . 'elementor/build/index.asset.php' );

		wp_enqueue_style(
			'ti-tpc-elementor-styles',
			TIOB_URL . 'elementor/build/index.css',
			array( 'wp-components' ),
			$deps['version']
		);
	}
}
