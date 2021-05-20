<?php
/**
 * Import XML test cases.
 *
 * @author Bogdan Preda <bogdan.preda@themeisle.com>
 * @package templates-patterns-collection
 */

use TIOB\Importers\WP\WP_Import;

/**
 * Class Import_Test
 */
class Import_Test extends WP_UnitTestCase {

	private $processed_terms;

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
				'label'             => _x( 'Product type', 'Taxonomy name', 'woocommerce' ),
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
				'label'             => _x( 'Product visibility', 'Taxonomy name', 'woocommerce' ),
			)
		);

		register_taxonomy(
			'product_cat',
			array( 'product' ),
			array(
				'hierarchical'          => true,
				'update_count_callback' => '_wc_term_recount',
				'label'                 => __( 'Categories', 'woocommerce' ),
				'labels'                => array(
					'name'              => __( 'Product categories', 'woocommerce' ),
					'singular_name'     => __( 'Category', 'woocommerce' ),
					'menu_name'         => _x( 'Categories', 'Admin menu name', 'woocommerce' ),
					'search_items'      => __( 'Search categories', 'woocommerce' ),
					'all_items'         => __( 'All categories', 'woocommerce' ),
					'parent_item'       => __( 'Parent category', 'woocommerce' ),
					'parent_item_colon' => __( 'Parent category:', 'woocommerce' ),
					'edit_item'         => __( 'Edit category', 'woocommerce' ),
					'update_item'       => __( 'Update category', 'woocommerce' ),
					'add_new_item'      => __( 'Add new category', 'woocommerce' ),
					'new_item_name'     => __( 'New category name', 'woocommerce' ),
					'not_found'         => __( 'No categories found', 'woocommerce' ),
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
				'label'                 => __( 'Product tags', 'woocommerce' ),
				'labels'                => array(
					'name'                       => __( 'Product tags', 'woocommerce' ),
					'singular_name'              => __( 'Tag', 'woocommerce' ),
					'menu_name'                  => _x( 'Tags', 'Admin menu name', 'woocommerce' ),
					'search_items'               => __( 'Search tags', 'woocommerce' ),
					'all_items'                  => __( 'All tags', 'woocommerce' ),
					'edit_item'                  => __( 'Edit tag', 'woocommerce' ),
					'update_item'                => __( 'Update tag', 'woocommerce' ),
					'add_new_item'               => __( 'Add new tag', 'woocommerce' ),
					'new_item_name'              => __( 'New tag name', 'woocommerce' ),
					'popular_items'              => __( 'Popular tags', 'woocommerce' ),
					'separate_items_with_commas' => __( 'Separate tags with commas', 'woocommerce' ),
					'add_or_remove_items'        => __( 'Add or remove tags', 'woocommerce' ),
					'choose_from_most_used'      => __( 'Choose from the most used tags', 'woocommerce' ),
					'not_found'                  => __( 'No tags found', 'woocommerce' ),
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
				'label'                 => __( 'Shipping classes', 'woocommerce' ),
				'labels'                => array(
					'name'              => __( 'Product shipping classes', 'woocommerce' ),
					'singular_name'     => __( 'Shipping class', 'woocommerce' ),
					'menu_name'         => _x( 'Shipping classes', 'Admin menu name', 'woocommerce' ),
					'search_items'      => __( 'Search shipping classes', 'woocommerce' ),
					'all_items'         => __( 'All shipping classes', 'woocommerce' ),
					'parent_item'       => __( 'Parent shipping class', 'woocommerce' ),
					'parent_item_colon' => __( 'Parent shipping class:', 'woocommerce' ),
					'edit_item'         => __( 'Edit shipping class', 'woocommerce' ),
					'update_item'       => __( 'Update shipping class', 'woocommerce' ),
					'add_new_item'      => __( 'Add new shipping class', 'woocommerce' ),
					'new_item_name'     => __( 'New shipping class Name', 'woocommerce' ),
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

	private function remap_category_recursively( $input ) {

		$re = '/replace_cat_(?<categoryID>\d+)/m';
		if ( is_array( $input ) ) {
			return ( isset( $this->processed_terms[ $input['categoryID'] ] ) ) ? $this->processed_terms[ $input['categoryID'] ] : $input['categoryID'];
		}
		return preg_replace_callback( $re, array( $this, 'remap_category_recursively' ), $input );
	}

	public function content_to_import( $content, $processed_terms ) {
		$this->processed_terms = $processed_terms;
		if ( strpos( $content, 'wp:woocommerce' ) !== false ) {
			$new_content = $this->remap_category_recursively( $content );
			return $new_content;
		}

		return $content;
	}

	final public function test_import_store_xml() {
		if ( ! class_exists( 'WP_Importer' ) ) {
			$class_wp_importer = ABSPATH . 'wp-admin/includes/class-wp-importer.php';
			if ( file_exists( $class_wp_importer ) ) {
				require $class_wp_importer;
			}
		}

		add_filter( 'tpc_post_content_processed_terms', array( $this, 'content_to_import' ), 10, 2 );


		$export_file_path = dirname( __FILE__ ) . '/fixtures/digital_store/export.xml';

		$importer = new WP_Import( 'gutenberg' );
		$importer->import( $export_file_path );

		$post = get_page_by_title( 'Home', OBJECT, 'page' );
		$re = '/categoryId":(?<categoryID>\d+)/m';
		preg_match_all( $re, $post->post_content, $matches );
		foreach ( $matches['categoryID'] as $match ) {
			$this->assertTrue( in_array( $match, $this->processed_terms ) );
		}
	}
}