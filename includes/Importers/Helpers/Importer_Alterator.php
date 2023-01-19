<?php
/**
 * Importer alterator.
 *
 * Used to alter import content.
 *
 * @package    templates-patterns-collection
 */


namespace TIOB\Importers\Helpers;
/**
 * Class Importer_Alterator
 */
class Importer_Alterator {
	use Helper;

	/**
	 * Post map. Holds post type / count.
	 *
	 * @var array
	 */
	private $post_map = array();

	/**
	 * Post types that will be ignored if there are more than 2 already on the site.
	 *
	 * @var array
	 */
	private $filtered_post_types = array(
		'post',
		'product',
	);

	/**
	 * Data passed from the async request for individual site item.
	 *
	 * @var array
	 */
	private $site_json_data;

	private $processed_terms;

	/**
	 * Importer_Alterator constructor.
	 *
	 * @param array $site_json_data the sites data passed from content import.
	 */
	public function __construct( $site_json_data ) {
		$this->site_json_data = $site_json_data;
		$this->count_posts_by_post_type();
		add_filter( 'wp_import_posts', array( $this, 'skip_shop_pages' ), 10 );
		add_filter( 'wp_import_posts', array( $this, 'skip_posts' ), 10 );
		add_filter( 'wp_import_posts', array( $this, 'drop_slug_and_prefix_pages' ), 10 );
		add_filter( 'wp_import_terms', array( $this, 'skip_terms' ), 10 );
		add_filter( 'wp_insert_post_data', array( $this, 'encode_post_content' ), 10, 2 );
		add_filter( 'wp_import_nav_menu_item_args', array( $this, 'change_nav_menu_item_link' ), 10, 2 );
		add_filter( 'intermediate_image_sizes_advanced', array( $this, 'filter_sizes' ), 10, 1 );
		add_filter( 'tpc_post_content_before_insert', array( $this, 'replace_links' ), 10, 2 );
		add_filter( 'tpc_post_content_processed_terms', array( $this, 'content_to_import' ), 10, 2 );
	}

	/**
	 * Filter the sizes array on image attachment to only default sizes.
	 *
	 * @param array $new_sizes The sizes array to use when resizing.
	 *
	 * @return array
	 */
	public function filter_sizes( $new_sizes ) {
		return array_filter(
			$new_sizes,
			function ( $key ) {
				return in_array( $key, array( 'thumbnail', 'medium' ) );
			},
			ARRAY_FILTER_USE_KEY
		);
	}

	/**
	 * Remap method for category terms.
	 *
	 * @param mixed $input
	 * @return array|mixed|string|string[]|null
	 */
	private function remap_category_recursively( $input ) {
		$re = '/replace_cat_(?<categoryID>\d+)/m';
		if ( is_array( $input ) ) {
			return ( isset( $this->processed_terms[ $input['categoryID'] ] ) ) ? $this->processed_terms[ $input['categoryID'] ] : $input['categoryID'];
		}
		return preg_replace_callback( $re, array( $this, 'remap_category_recursively' ), $input );
	}

	/**
	 * Process imported content and remap terms.
	 *
	 * @param string $content The content.
	 * @param array $processed_terms The list of processed terms.
	 * @return string
	 */
	public function content_to_import( $content, $processed_terms ) {
		$this->processed_terms = $processed_terms;
		if ( strpos( $content, 'wp:woocommerce' ) !== false ) {
			$new_content = $this->remap_category_recursively( $content );
			return $new_content;
		}

		return $content;
	}

	/**
	 * Prefix Front / Blog page slug.
	 *
	 * @param array $posts the posts to import array.
	 *
	 * @return array
	 */
	public function drop_slug_and_prefix_pages( $posts ) {
		foreach ( $posts as $index => $post ) {
			if ( $post['post_type'] !== 'page' ) {
				continue;
			}
			$posts[ $index ]['post_name'] = $this->cleanup_page_slug( $post['post_name'], $this->site_json_data['demoSlug'] );
		}

		return $posts;
	}

	/**
	 * Change nav menu items link if needed.
	 *
	 * @param array  $args              menu item args.
	 * @param string $import_source_url the source url.
	 *
	 * @return array
	 */
	public function change_nav_menu_item_link( $args, $import_source_url ) {
		$args['menu-item-url'] = str_replace( $import_source_url, get_home_url(), $args['menu-item-url'] );

		return $args;
	}

	/**
	 * Replace content links.
	 *
	 * @hooked tpc_post_content_before_insert - 10
	 *
	 * @param string $content post content.
	 * @param string $old_base_url old site URL.
	 *
	 * @return string
	 */
	public function replace_links( $content, $old_base_url ) {
		$content = str_replace( $old_base_url, get_home_url(), $content );
		$content = $this->replace_image_urls( $content );
		return $content;
	}

	/**
	 * Encode post content to UTF8 for possible issues with locales.
	 *
	 * @param array $data    post data
	 * @param array $postarr post array
	 *
	 * @return array
	 */
	public function encode_post_content( $data, $postarr ) {
		if ( isset( $this->site_json_data['editor'] ) && $this->site_json_data['editor'] === 'gutenberg' ) {
			return $data;
		}
		$data['post_content'] = utf8_encode( $data['post_content'] );

		return $data;
	}

	/**
	 * Skip posts if there are more than 2 already.
	 *
	 * @param array $posts post data.
	 *
	 * @return array
	 */
	public function skip_posts( $posts ) {
		return array_filter(
			$posts,
			function ( $post_data ) {
				if ( ! array_key_exists( $post_data['post_type'], $this->post_map ) ) {
					return true;
				}
				if ( $this->post_map[ $post_data['post_type'] ] <= 2 ) {
					return true;
				}

				return false;
			}
		);
	}

	/**
	 * Skip shop pages if no WooCommerce.
	 *
	 * @param array $posts posts data.
	 *
	 * @return array
	 */
	public function skip_shop_pages( $posts ) {
		if ( ! isset( $this->site_json_data['shopPages'] ) || $this->site_json_data['shopPages'] === null || ! is_array( $this->site_json_data['shopPages'] ) ) {
			return $posts;
		}

		if ( class_exists( 'WooCommerce' ) ) {
			return $posts;
		}

		return array_filter(
			$posts,
			function ( $post_data ) {
				if ( $post_data['post_type'] === 'product' ) {
					return false;
				}
				if (
					$post_data['post_type'] === 'page' &&
					in_array( $post_data['post_name'], $this->site_json_data['shopPages'] )
				) {
					return false;
				}

				return true;
			}
		);
	}

	/**
	 * Skips terms for post types that were skipped.
	 *
	 * @param array $terms terms data.
	 *
	 * @return array
	 */
	public function skip_terms( $terms ) {
		foreach ( $this->filtered_post_types as $post_type ) {
			if ( ! $this->post_map[ $post_type ] <= 2 ) {
				continue;
			}

			$terms = array_filter(
				$terms,
				function ( $term ) use ( $post_type ) {
					return $this->is_taxonomy_assigned_to_post_type( $post_type, $term['term_taxonomy'] );
				}
			);
		}

		return $terms;
	}

	/**
	 * Checks if taxonomy is assigned to post type.
	 *
	 * @param string $post_type post type slug.
	 * @param string $taxonomy  taxonomy slug.
	 *
	 * @return bool
	 */
	private function is_taxonomy_assigned_to_post_type( $post_type, $taxonomy ) {
		$taxonomies = get_object_taxonomies( $post_type );

		return in_array( $taxonomy, $taxonomies );
	}

	/**
	 * Count excluded post types.
	 */
	private function count_posts_by_post_type() {
		foreach ( $this->filtered_post_types as $post_type ) {
			$args      = array(
				'post_type' => $post_type,
			);
			$the_query = new \WP_Query( $args );

			$this->post_map[ $post_type ] = absint( $the_query->found_posts );
		}
	}
}
