<?php
/**
 * Atomic Wind CSS Meta import handler.
 *
 * This is needed because by default, the importer breaks our CSS meta.
 */
namespace TIOB\Importers\WP;
use TIOB\Importers\Helpers\Helper;
class Atomic_Wind_Meta_Handler {
	use Helper;

	/**
	 * Atomic Wind meta key.
	 *
	 * @var string
	 */
	private $meta_key = '_atomic_wind_css';

	/**
	 * Meta value.
	 *
	 * @var null
	 */
	private $value = null;

	/**
	 * Atomic_Wind_Meta_Handler constructor.
	 *
	 * @param string $unfiltered_value the unfiltered meta value.
	 * @param string $site_url the site url.
	 */
	public function __construct( $unfiltered_value ) {
		$this->value = $unfiltered_value;
	}

	/**
	 * Filter the meta to allow escaped CSS values.
	 */
	public function filter_meta() {
		add_filter( 'sanitize_post_meta_' . $this->meta_key, array( $this, 'allow_escaped_css_meta' ), 10, 3 );
	}



	/**
	 * Allow CSS escaping.
	 *
	 * @param string $val meta value.
	 * @param string $key meta key.
	 * @param string $type meta type.
	 *
	 * @return array|string
	 */
	public function allow_escaped_css_meta( $val, $key, $type ) {
		if ( empty( $this->value ) ) {
			return $val;
		}

		return $this->value;
	}
}
