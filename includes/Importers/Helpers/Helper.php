<?php
/**
 * Themeisle Onboarding Trait
 *
 * @package    templates-patterns-collection
 */

namespace TIOB\Importers\Helpers;

trait Helper {
	/**
	 * A list of allowed mimes.
	 *
	 * @var array
	 */
	protected $extensions = array(
		'jpg|jpeg|jpe' => 'image/jpeg',
		'png'          => 'image/png',
		'webp'         => 'image/webp',
		'svg'          => 'image/svg+xml',
	);

	/**
	 * Replace demo urls in meta with site urls.
	 */
	public function replace_image_urls( $markup ) {
		// Get all slashed and un-slashed urls.
		$old_urls = $this->get_urls_to_replace( $markup );
		if ( ! is_array( $old_urls ) || empty( $old_urls ) ) {
			return $markup;
		}

		// Create an associative array.
		$urls = array_combine( $old_urls, $old_urls );
		// Unslash values of associative array.
		$urls = array_map( 'wp_unslash', $urls );
		// Remap host and directory path.
		$urls = array_map( array( $this, 'remap_host' ), $urls );
		// Replace image urls in meta.
		$markup = str_replace( array_keys( $urls ), array_values( $urls ), $markup );

		return $markup;
	}

	/**
	 * Get url replace array.
	 *
	 * @return array
	 */
	private function get_urls_to_replace( $markup ) {
		$regex = '/(?:http(?:s?):)(?:[\/\\\\\\\\|.|\w|\s|-])*\.(?:' . implode( '|', array_keys( $this->extensions ) ) . ')/m';

		if ( ! is_string( $markup ) ) {
			return array();
		}

		preg_match_all( $regex, $markup, $urls );

		$urls = array_map(
			function ( $value ) {
				return rtrim( html_entity_decode( $value ), '\\' );
			},
			$urls[0]
		);

		$urls = array_unique( $urls );

		return array_values( $urls );
	}

	/**
	 * Remap URLs host.
	 *
	 * @param $url
	 *
	 * @return string
	 */
	private function remap_host( $url ) {
		if ( ! strpos( $url, '/uploads/' ) ) {
			return $url;
		}
		$old_url   = $url;
		$url_parts = parse_url( $url );

		if ( ! isset( $url_parts['host'] ) ) {
			return $url;
		}
		$url_parts['path'] = preg_split( '/\//', $url_parts['path'] );
		$url_parts['path'] = array_slice( $url_parts['path'], - 3 );

		$uploads_dir = wp_get_upload_dir();
		$uploads_url = $uploads_dir['baseurl'];

		$new_url = esc_url( $uploads_url . '/' . join( '/', $url_parts['path'] ) );

		return str_replace( $old_url, $new_url, $url );
	}

	/**
	 * Hash the demo slug and prefix the page name with it. Drop words like demo, neve, or the demo slug from page slug.
	 *
	 * @param string $slug      page slug.
	 * @param string $demo_slug demo slug.
	 * @param bool   $check_collisions should check if slug collisions exist before hashing.
	 * @param array  $reserved_slugs additional reserved slugs from current import run.
	 *
	 * @return string
	 */
	public function cleanup_page_slug( $slug, $demo_slug, $check_collisions = false, $reserved_slugs = array() ) {
		$unhashed = array( 'shop', 'my-account', 'checkout', 'cart', 'blog', 'news', 'lifter-courses', 'courses', 'dashboard', 'my-courses', 'memberships' );
		$slug     = $this->normalize_page_slug( $slug, $demo_slug );

		if ( $slug === '' ) {
			$slug = sanitize_title( $demo_slug );
		}

		if ( in_array( $slug, $unhashed, true ) ) {
			return $slug;
		}

		$hash = substr( md5( $demo_slug ), 0, 5 );
		if ( ! $check_collisions ) {
			return $hash . '-' . $slug;
		}

		if ( ! $this->is_page_slug_taken( $slug, $reserved_slugs ) ) {
			return $slug;
		}

		$hashed_slug = $hash . '-' . $slug;

		if ( ! $this->is_page_slug_taken( $hashed_slug, $reserved_slugs ) ) {
			return $hashed_slug;
		}

		return $this->generate_unique_page_slug( $hashed_slug, $reserved_slugs );
	}

	/**
	 * Normalize page slug before collision checks.
	 *
	 * @param string $slug      page slug.
	 * @param string $demo_slug demo slug.
	 *
	 * @return string
	 */
	public function normalize_page_slug( $slug, $demo_slug ) {
		$slug = str_replace( $demo_slug, '', $slug );
		$slug = str_replace( 'demo', '', $slug );
		$slug = ltrim( $slug, '-' );

		return $slug;
	}

	/**
	 * Check if page slug is already taken.
	 *
	 * @param string $slug           slug to check.
	 * @param array  $reserved_slugs additional reserved slugs from current import.
	 *
	 * @return bool
	 */
	private function is_page_slug_taken( $slug, $reserved_slugs = array() ) {
		if ( ! empty( $reserved_slugs ) && in_array( $slug, $reserved_slugs, true ) ) {
			return true;
		}

		if ( $slug === '' ) {
			return false;
		}

		return get_page_by_path( $slug, OBJECT, 'page' ) !== null;
	}

	/**
	 * Generate unique page slug.
	 *
	 * @param string $base_slug      base slug.
	 * @param array  $reserved_slugs additional reserved slugs from current import.
	 *
	 * @return string
	 */
	private function generate_unique_page_slug( $base_slug, $reserved_slugs = array() ) {
		if ( function_exists( 'wp_unique_post_slug' ) ) {
			$unique_slug = wp_unique_post_slug( $base_slug, 0, 'publish', 'page', 0 );
			if ( ! in_array( $unique_slug, $reserved_slugs, true ) ) {
				return $unique_slug;
			}

			$suffix = 2;
			while ( in_array( $unique_slug, $reserved_slugs, true ) ) {
				$unique_slug = wp_unique_post_slug( $base_slug . '-' . $suffix, 0, 'publish', 'page', 0 );
				$suffix++;
			}

			return $unique_slug;
		}

		$suffix = 2;
		$slug   = $base_slug;

		while ( $this->is_page_slug_taken( $slug, $reserved_slugs ) ) {
			$slug = $base_slug . '-' . $suffix;
			$suffix++;
		}

		return $slug;
	}
}
