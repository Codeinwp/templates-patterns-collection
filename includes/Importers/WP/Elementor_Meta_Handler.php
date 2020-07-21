<?php
/**
 * Elementor Meta import handler.
 *
 * This is needed because by default, the importer breaks our JSON meta.
 *
 * @package    templates-patterns-collection
 */

namespace TIOB\Importers\WP;

use TIOB\Importers\Helpers\Helper;

/**
 * Class Elementor_Meta_Handler
 *
 * @package templates-patterns-collection
 */
class Elementor_Meta_Handler {
	use Helper;

	/**
	 * Elementor meta key.
	 *
	 * @var string
	 */
	private $meta_key = '_elementor_data';

	/**
	 * Meta value.
	 *
	 * @var null
	 */
	private $value = null;

	/**
	 * Imported site url.
	 *
	 * @var null
	 */
	private $import_url = null;

	/**
	 * Elementor_Meta_Handler constructor.
	 *
	 * @param string $unfiltered_value the unfiltered meta value.
	 * @param string $site_url the site url.
	 */
	public function __construct( $unfiltered_value, $site_url ) {
		$this->value      = $unfiltered_value;
		$this->import_url = $site_url;
	}

	/**
	 * Filter the meta to allow escaped JSON values.
	 */
	public function filter_meta() {
		add_filter( 'sanitize_post_meta_' . $this->meta_key, array( $this, 'allow_escaped_json_meta' ), 10, 3 );
	}

	/**
	 * Allow JSON escaping.
	 *
	 * @param string $val meta value.
	 * @param string $key meta key.
	 * @param string $type meta type.
	 *
	 * @return array|string
	 */
	public function allow_escaped_json_meta( $val, $key, $type ) {
		if ( empty( $this->value ) ) {
			return $val;
		}

		$this->value = $this->replace_image_urls( $this->value );
		$this->replace_link_urls();

		return $this->value;
	}

	/**
	 * Replace link urls.
	 *
	 * @return void
	 */
	private function replace_link_urls() {
		$decoded_meta = json_decode( $this->value, true );
		if ( ! is_array( $decoded_meta ) ) {
			return;
		}

		$site_url  = get_site_url();
		$url_parts = parse_url( $site_url );

		array_walk_recursive(
			$decoded_meta,
			function ( &$value, $key ) use ( $site_url, $url_parts ) {
				if ( filter_var( $value, FILTER_VALIDATE_URL ) === false ) {
					return;
				}

				$url = parse_url( $value );

				if ( ! isset( $url['host'] ) || ! isset( $url_parts['host'] ) ) {
					return;
				}

				if ( $url['host'] !== $url_parts['host'] ) {
					$value = str_replace( $this->import_url, $site_url, $value );
				}
			}
		);

		$this->value = json_encode( $decoded_meta );
	}
}
