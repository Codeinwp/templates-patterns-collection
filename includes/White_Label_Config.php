<?php
/**
 * Contains common methods for the white label Neve settings.
 *
 * @package    templates-patterns-collection
 */

namespace TIOB;

/**
 * Trait White_Label_Config
 *
 * @package templates-patterns-collection
 */
trait White_Label_Config {
	/**
	 * White label config
	 *
	 * @var array
	 */
	private $wl_config = null;

	/**
	 * Setup white label config.
	 */
	public function setup_white_label() {
		$white_label_module = get_option( 'nv_pro_white_label_status' );
		if ( ! empty( $white_label_module ) && (bool) $white_label_module === true ) {
			$branding = get_option( 'ti_white_label_inputs' );
			if ( ! empty( $branding ) ) {
				$this->wl_config = json_decode( $branding, true );
			}
		}
	}

	/**
	 * Check if library is disabled.
	 *
	 * @return bool
	 */
	public function is_library_disabled() {
		if ( isset( $this->wl_config['my_library'] ) && (bool) $this->wl_config['my_library'] === true ) {
			return true;
		}
		return false;
	}

	/**
	 * Check if starter sites are disabled.
	 *
	 * @return bool
	 */
	public function is_starter_sites_disabled() {
		if ( isset( $this->wl_config['starter_sites'] ) && (bool) $this->wl_config['starter_sites'] === true ) {
			return true;
		}
		return false;
	}

	/**
	 * Check if theme name is set.
	 *
	 * @return bool
	 */
	public function get_whitelabel_name() {
		return isset( $this->wl_config['theme_name'] ) ? $this->wl_config['theme_name'] : false;
	}
}
