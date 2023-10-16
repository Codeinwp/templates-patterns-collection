<?php

namespace Neve\Core\Settings {
	class Mods {
		public static function get( $name, $default = null ) {}
	}

	class Config {
		const MODS_TPOGRAPHY_FONT_PAIRS         = 'mods_typography_font_pairs';
		public static $typography_default_pairs = array();
	}
}
