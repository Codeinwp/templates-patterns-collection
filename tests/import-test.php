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

	public function setUp() {
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
				'label'             => _x( 'Product visibility', 'Taxonomy name', 'default' ),
			)
		);

		register_taxonomy(
			'product_cat',
			array( 'product' ),
			array(
				'hierarchical'          => true,
				'update_count_callback' => '_wc_term_recount',
				'label'                 => __( 'Categories', 'default' ),
				'labels'                => array(
					'name'              => __( 'Product categories', 'default' ),
					'singular_name'     => __( 'Category', 'default' ),
					'menu_name'         => _x( 'Categories', 'Admin menu name', 'default' ),
					'search_items'      => __( 'Search categories', 'default' ),
					'all_items'         => __( 'All categories', 'default' ),
					'parent_item'       => __( 'Parent category', 'default' ),
					'parent_item_colon' => __( 'Parent category:', 'default' ),
					'edit_item'         => __( 'Edit category', 'default' ),
					'update_item'       => __( 'Update category', 'default' ),
					'add_new_item'      => __( 'Add new category', 'default' ),
					'new_item_name'     => __( 'New category name', 'default' ),
					'not_found'         => __( 'No categories found', 'default' ),
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
				'label'                 => __( 'Product tags', 'default' ),
				'labels'                => array(
					'name'                       => __( 'Product tags', 'default' ),
					'singular_name'              => __( 'Tag', 'default' ),
					'menu_name'                  => _x( 'Tags', 'Admin menu name', 'default' ),
					'search_items'               => __( 'Search tags', 'default' ),
					'all_items'                  => __( 'All tags', 'default' ),
					'edit_item'                  => __( 'Edit tag', 'default' ),
					'update_item'                => __( 'Update tag', 'default' ),
					'add_new_item'               => __( 'Add new tag', 'default' ),
					'new_item_name'              => __( 'New tag name', 'default' ),
					'popular_items'              => __( 'Popular tags', 'default' ),
					'separate_items_with_commas' => __( 'Separate tags with commas', 'default' ),
					'add_or_remove_items'        => __( 'Add or remove tags', 'default' ),
					'choose_from_most_used'      => __( 'Choose from the most used tags', 'default' ),
					'not_found'                  => __( 'No tags found', 'default' ),
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
				'label'                 => __( 'Shipping classes', 'default' ),
				'labels'                => array(
					'name'              => __( 'Product shipping classes', 'default' ),
					'singular_name'     => __( 'Shipping class', 'default' ),
					'menu_name'         => _x( 'Shipping classes', 'Admin menu name', 'default' ),
					'search_items'      => __( 'Search shipping classes', 'default' ),
					'all_items'         => __( 'All shipping classes', 'default' ),
					'parent_item'       => __( 'Parent shipping class', 'default' ),
					'parent_item_colon' => __( 'Parent shipping class:', 'default' ),
					'edit_item'         => __( 'Edit shipping class', 'default' ),
					'update_item'       => __( 'Update shipping class', 'default' ),
					'add_new_item'      => __( 'Add new shipping class', 'default' ),
					'new_item_name'     => __( 'New shipping class Name', 'default' ),
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