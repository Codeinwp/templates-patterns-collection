<?php
/**
 * Import XML test cases.
 *
 * @author Bogdan Preda <bogdan.preda@themeisle.com>
 * @package templates-patterns-collection
 */

use TIOB\Importers\Helpers\Importer_Alterator;
use TIOB\Importers\WP\WP_Import;

/**
 * Class Import_Test
 */
class Import_Test extends WP_UnitTestCase {

	public function setUp(): void {
		parent::setUp();
		register_taxonomy(
			'product_type',
			array( 'product' ),
			array(
				'hierarchical'      => false,
				'show_ui'           => false,
				'show_in_nav_menus' => false,
				'query_var'         => is_admin(),
				'rewrite'           => false,
				'public'            => false,
				'label'             => _x( 'Product type', 'Taxonomy name', 'default' ),
			)
		);

		register_taxonomy(
			'product_visibility',
			array( 'product', 'product_variation' ),
			array(
				'hierarchical'      => false,
				'show_ui'           => false,
				'show_in_nav_menus' => false,
				'query_var'         => is_admin(),
				'rewrite'           => false,
				'public'            => false,
				'label'             => _x( 'Product visibility', 'Taxonomy name', 'templates-patterns-collection' ),
			)
		);

		register_taxonomy(
			'product_cat',
			array( 'product' ),
			array(
				'hierarchical'          => true,
				'update_count_callback' => '_wc_term_recount',
				'label'                 => __( 'Categories', 'templates-patterns-collection' ),
				'labels'                => array(
					'name'              => __( 'Product categories', 'templates-patterns-collection' ),
					'singular_name'     => __( 'Category', 'templates-patterns-collection' ),
					'menu_name'         => _x( 'Categories', 'Admin menu name', 'templates-patterns-collection' ),
					'search_items'      => __( 'Search categories', 'templates-patterns-collection' ),
					'all_items'         => __( 'All categories', 'templates-patterns-collection' ),
					'parent_item'       => __( 'Parent category', 'templates-patterns-collection' ),
					'parent_item_colon' => __( 'Parent category:', 'templates-patterns-collection' ),
					'edit_item'         => __( 'Edit category', 'templates-patterns-collection' ),
					'update_item'       => __( 'Update category', 'templates-patterns-collection' ),
					'add_new_item'      => __( 'Add new category', 'templates-patterns-collection' ),
					'new_item_name'     => __( 'New category name', 'templates-patterns-collection' ),
					'not_found'         => __( 'No categories found', 'templates-patterns-collection' ),
				),
				'show_ui'               => true,
				'query_var'             => true,
				'capabilities'          => array(
					'manage_terms' => 'manage_product_terms',
					'edit_terms'   => 'edit_product_terms',
					'delete_terms' => 'delete_product_terms',
					'assign_terms' => 'assign_product_terms',
				),
				'rewrite'               => array(
					'slug'         => 'product_cat',
					'with_front'   => false,
					'hierarchical' => true,
				),
			)
		);

		register_taxonomy(
			'product_tag',
			array( 'product' ),
			array(
				'hierarchical'          => false,
				'update_count_callback' => '_wc_term_recount',
				'label'                 => __( 'Product tags', 'templates-patterns-collection' ),
				'labels'                => array(
					'name'                       => __( 'Product tags', 'templates-patterns-collection' ),
					'singular_name'              => __( 'Tag', 'templates-patterns-collection' ),
					'menu_name'                  => _x( 'Tags', 'Admin menu name', 'templates-patterns-collection' ),
					'search_items'               => __( 'Search tags', 'templates-patterns-collection' ),
					'all_items'                  => __( 'All tags', 'templates-patterns-collection' ),
					'edit_item'                  => __( 'Edit tag', 'templates-patterns-collection' ),
					'update_item'                => __( 'Update tag', 'templates-patterns-collection' ),
					'add_new_item'               => __( 'Add new tag', 'templates-patterns-collection' ),
					'new_item_name'              => __( 'New tag name', 'templates-patterns-collection' ),
					'popular_items'              => __( 'Popular tags', 'templates-patterns-collection' ),
					'separate_items_with_commas' => __( 'Separate tags with commas', 'templates-patterns-collection' ),
					'add_or_remove_items'        => __( 'Add or remove tags', 'templates-patterns-collection' ),
					'choose_from_most_used'      => __( 'Choose from the most used tags', 'templates-patterns-collection' ),
					'not_found'                  => __( 'No tags found', 'templates-patterns-collection' ),
				),
				'show_ui'               => true,
				'query_var'             => true,
				'capabilities'          => array(
					'manage_terms' => 'manage_product_terms',
					'edit_terms'   => 'edit_product_terms',
					'delete_terms' => 'delete_product_terms',
					'assign_terms' => 'assign_product_terms',
				),
				'rewrite'               => array(
					'slug'       => 'product_tag',
					'with_front' => false,
				),
			)
		);

		register_taxonomy(
			'product_shipping_class',
			array( 'product', 'product_variation' ),
			array(
				'hierarchical'          => false,
				'update_count_callback' => '_update_post_term_count',
				'label'                 => __( 'Shipping classes', 'templates-patterns-collection' ),
				'labels'                => array(
					'name'              => __( 'Product shipping classes', 'templates-patterns-collection' ),
					'singular_name'     => __( 'Shipping class', 'templates-patterns-collection' ),
					'menu_name'         => _x( 'Shipping classes', 'Admin menu name', 'templates-patterns-collection' ),
					'search_items'      => __( 'Search shipping classes', 'templates-patterns-collection' ),
					'all_items'         => __( 'All shipping classes', 'templates-patterns-collection' ),
					'parent_item'       => __( 'Parent shipping class', 'templates-patterns-collection' ),
					'parent_item_colon' => __( 'Parent shipping class:', 'templates-patterns-collection' ),
					'edit_item'         => __( 'Edit shipping class', 'templates-patterns-collection' ),
					'update_item'       => __( 'Update shipping class', 'templates-patterns-collection' ),
					'add_new_item'      => __( 'Add new shipping class', 'templates-patterns-collection' ),
					'new_item_name'     => __( 'New shipping class Name', 'templates-patterns-collection' ),
				),
				'show_ui'               => false,
				'show_in_quick_edit'    => false,
				'show_in_nav_menus'     => false,
				'query_var'             => is_admin(),
				'capabilities'          => array(
					'manage_terms' => 'manage_product_terms',
					'edit_terms'   => 'edit_product_terms',
					'delete_terms' => 'delete_product_terms',
					'assign_terms' => 'assign_product_terms',
				),
				'rewrite'               => false,
			)
		);
	}

	final public function test_import_store_xml() {
		if ( ! class_exists( 'WP_Importer' ) ) {
			$class_wp_importer = ABSPATH . 'wp-admin/includes/class-wp-importer.php';
			if ( file_exists( $class_wp_importer ) ) {
				require $class_wp_importer;
			}
		}

		$alterator = new Importer_Alterator( array( "demoSlug" => "testImport" ) );


		$export_file_path = dirname( __FILE__ ) . '/fixtures/digital_store/export.xml';

		$importer = new WP_Import( 'gutenberg' );
		$importer->import( $export_file_path );

		$post = get_page_by_title( 'Home', OBJECT, 'page' );
		$re   = '/categoryId":(?<categoryID>\d+)/m';
		preg_match_all( $re, $post->post_content, $matches );
		foreach ( $matches['categoryID'] as $match ) {
			$this->assertTrue( in_array( $match, $importer->processed_terms ) );
		}
	}
}