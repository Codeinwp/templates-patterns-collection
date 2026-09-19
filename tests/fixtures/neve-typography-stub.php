<?php
/**
 * Minimal Neve typography stubs for the onboarding font tests.
 *
 * @package templates-patterns-collection
 */

namespace Neve\Core\Settings;

if ( ! class_exists( '\Neve\Core\Settings\Mods', false ) ) {
	/**
	 * Class Mods
	 */
	class Mods {
		/**
		 * Return the stored value for a theme mod, or the default.
		 *
		 * @param string $name    Theme mod name.
		 * @param mixed  $default Value to fall back to.
		 *
		 * @return mixed
		 */
		public static function get( $name, $default = null ) {
			return get_theme_mod( $name, $default );
		}
	}
}

if ( ! class_exists( '\Neve\Core\Settings\Config', false ) ) {
	/**
	 * Class Config
	 */
	class Config {
		const MODS_TPOGRAPHY_FONT_PAIRS = 'neve_typography_font_pairs';

		/**
		 * Default font pairs.
		 *
		 * @var array
		 */
		public static $typography_default_pairs = array();
	}
}
