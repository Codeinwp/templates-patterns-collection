<?php
/**
 * Handles code for Elementor.
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
						'license_id' => apply_filters( 'tiob_license_key', 'free' ),
						'type'       => 'elementor',
						'meta'       => Main::get_meta_fields( $post_id = get_the_ID(), $type = 'elementor' ),
					),
					'canPredefine'     => apply_filters( 'ti_tpc_can_predefine', false ),
					'postType'         => get_post_type(),
					'placeholderIndex' => '-1',
					'exporter'         => array(
						'exportLabel'         => sprintf( __( 'Save to %s', 'templates-patterns-collection' ), 'Neve Cloud' ),
						'modalLabel'          => __( 'Save Templates', 'templates-patterns-collection' ),
						'textLabel'           => __( 'Template Name', 'templates-patterns-collection' ),
						'textPlaceholder'     => __( 'Template', 'templates-patterns-collection' ),
						'buttonLabel'         => __( 'Save', 'templates-patterns-collection' ),
						'toggleLabel'         => __( 'Automatically sync to the cloud', 'templates-patterns-collection' ),
						'templateSaved'       => __( 'Template Saved.', 'templates-patterns-collection' ),
						'templatePublished'   => __( 'Template Published.', 'templates-patterns-collection' ),
						'templateUnpublished' => __( 'Template Unpublished.', 'templates-patterns-collection' ),
					),
					'library'          => array(
						'libraryButton'  => sprintf( __( 'Import from %s', 'templates-patterns-collection' ), 'Templates Cloud' ),
						'templatesCloud' => 'Templates Cloud',
						'historyMessage' => sprintf( __( 'Add Template from %s:', 'templates-patterns-collection' ), 'Templates Cloud' ),
						'tabs'           => array(
							'templates' => __( 'Page Templates', 'templates-patterns-collection' ),
							'library'   => __( 'My Library', 'templates-patterns-collection' ),
						),
						'actions'        => array(
							'sync'      => __( 'Sync Library', 'templates-patterns-collection' ),
							'save'      => sprintf( __( 'Save to %s', 'templates-patterns-collection' ), 'Neve Cloud' ),
							'close'     => __( 'Close', 'templates-patterns-collection' ),
							'cancel'    => __( 'Cancel', 'templates-patterns-collection' ),
							'edit'      => __( 'Edit', 'templates-patterns-collection' ),
							'duplicate' => __( 'Duplicate', 'templates-patterns-collection' ),
							'delete'    => __( 'Delete', 'templates-patterns-collection' ),
							'insert'    => __( 'Insert', 'templates-patterns-collection' ),
							'back'      => __( 'Back to Library', 'templates-patterns-collection' ),
						),
						'filters'        => array(
							'sortLabel'   => __( 'Sort by', 'templates-patterns-collection' ),
							'sortLabels'  => array(
								'name'     => __( 'Name', 'templates-patterns-collection' ),
								'date'     => __( 'Date', 'templates-patterns-collection' ),
								'modified' => __( 'Last Modified', 'templates-patterns-collection' ),
								'actions'  => __( 'Actions', 'templates-patterns-collection' ),
							),
							'search'      => __( 'Search', 'templates-patterns-collection' ),
							'searchLabel' => __( 'Search Templates', 'templates-patterns-collection' ),
						),
						'export'         => array(
							'save'            => __( 'Save', 'templates-patterns-collection' ),
							'title'           => sprintf( __( 'Save your page to %s', 'templates-patterns-collection' ), 'Templates Cloud' ),
							'placeholder'     => __( 'Enter Template Name', 'templates-patterns-collection' ),
							'labelScreenshot' => __( 'Screenshot URL', 'templates-patterns-collection' ),
							'labelSlug'       => __( 'Site Slug', 'templates-patterns-collection' ),
							'publish'         => __( 'Publish', 'templates-patterns-collection' ),
							'unpublish'       => __( 'Unpublish', 'templates-patterns-collection' ),
							'defaultTitle'    => __( 'Template', 'templates-patterns-collection' ),
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
			array( 'wp-components' ),
			$deps['version']
		);
	}
}
