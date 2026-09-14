<?php
/**
 * Pre-3.5.0 Neve typography stubs: Mods exists, Config has no font-pair members.
 *
 * Contradicts neve-typography-stub.php on purpose, so it must only ever be
 * loaded from an isolated process.
 *
 * @package templates-patterns-collection
 */

namespace Neve\Core\Settings;

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

/**
 * Class Config, as it shipped before the font pairs landed.
 */
class Config {
	const MODS_TYPEFACE_GENERAL = 'neve_headings_font_family';
}
