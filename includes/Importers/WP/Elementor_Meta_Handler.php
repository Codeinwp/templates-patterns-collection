<?php
/**
 * Elementor Meta import handler.
 *
 * Rewrites demo URLs inside `_elementor_data` and returns a payload that is safe to store
 * through update_post_meta() (which unslashes its input before saving).
 *
 * @package    templates-patterns-collection
 */

namespace TIOB\Importers\WP;

use TIOB\Importers\Helpers\Helper;
use TIOB\Importers\Helpers\Slug_Mapping;

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
		Slug_Mapping::register_source_url( $site_url );
	}

	/**
	 * Get the processed meta value: valid, unslashed JSON with demo image and link URLs rewritten.
	 *
	 * Callers must wp_slash() the result before handing it to update_post_meta(), which
	 * unslashes its input. Storing through the meta sanitize filter instead is not reliable:
	 * Elementor >= 4.2.1 registers `_elementor_data` per post type with its own sanitize
	 * callback, and core then routes sanitization through the subtype filter only, skipping
	 * the generic `sanitize_post_meta__elementor_data` hook.
	 *
	 * @return mixed
	 */
	public function get_processed_value() {
		if ( empty( $this->value ) || ! is_string( $this->value ) ) {
			return $this->value;
		}

		// Elementor's importer compatibility layer slashes `_elementor_data` on `wp_import_post_meta`
		// in admin context. Undo that so the rewrites below operate on plain JSON.
		if ( ! $this->is_valid_json( $this->value ) && $this->is_valid_json( wp_unslash( $this->value ) ) ) {
			$this->value = wp_unslash( $this->value );
		}

		$this->value = $this->replace_image_urls( $this->value );
		$this->replace_link_urls();

		return $this->value;
	}

	/**
	 * Filter the meta to allow escaped JSON values.
	 *
	 * Kept for backwards compatibility. The importer now stores the value returned by
	 * get_processed_value() directly, because this generic sanitize filter is bypassed
	 * whenever a subtype-specific filter is registered for the key.
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

		return $this->get_processed_value();
	}

	/**
	 * Check whether a string is valid JSON.
	 *
	 * @param mixed $value value to check.
	 *
	 * @return bool
	 */
	private function is_valid_json( $value ) {
		if ( ! is_string( $value ) ) {
			return false;
		}

		json_decode( $value );

		return json_last_error() === JSON_ERROR_NONE;
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

		array_walk_recursive(
			$decoded_meta,
			function ( &$value ) {
				if ( filter_var( $value, FILTER_VALIDATE_URL ) === false ) {
					return;
				}

				$value = Slug_Mapping::rewrite_value( $value );
			}
		);

		$this->value = json_encode( $decoded_meta );
	}
}
