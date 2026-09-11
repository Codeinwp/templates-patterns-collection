<?php
/**
 * Test Admin::get_font_parings() against incompatible Neve settings APIs.
 *
 * Neve releases before 3.5.0 ship Neve\Core\Settings\Mods but not
 * Neve\Core\Settings\Config::MODS_TPOGRAPHY_FONT_PAIRS, so the old guard fataled.
 *
 * @package templates-patterns-collection
 */

namespace Neve\Core\Settings {
	/**
	 * Stub of the Neve mods reader.
	 */
	class Mods {
		/**
		 * Read a theme mod.
		 *
		 * @param string $name    Mod name.
		 * @param mixed  $default Fallback value.
		 *
		 * @return mixed
		 */
		public static function get( $name, $default = null ) {
			return $default;
		}
	}

	/**
	 * Stub of a pre-3.5.0 Neve config: no font-pair constant, no default pairs.
	 */
	class Config {
		const MODS_TYPEFACE_GENERAL = 'neve_headings_font_family';
	}
}

namespace {

	use TIOB\Admin;

	/**
	 * Test the Neve font-pair compatibility guard.
	 */
	class Neve_Font_Pairs_Test extends \WP_UnitTestCase {

		/**
		 * Call the private font-pair collector and return the pairs it stored.
		 *
		 * @param Admin $admin Admin instance to read from.
		 *
		 * @return array
		 */
		private function collect_font_pairs( $admin ) {
			$method = new ReflectionMethod( Admin::class, 'get_font_parings' );
			$method->setAccessible( true );
			$method->invoke( $admin );

			$property = new ReflectionProperty( Admin::class, 'font_pairs_neve' );
			$property->setAccessible( true );

			return $property->getValue( $admin );
		}

		/**
		 * A Neve whose Config lacks the font-pair members must not fatal.
		 */
		public function test_incompatible_neve_config_falls_back_to_bundled_pairs() {
			$this->assertTrue( class_exists( '\Neve\Core\Settings\Mods', false ) );
			$this->assertFalse( defined( '\Neve\Core\Settings\Config::MODS_TPOGRAPHY_FONT_PAIRS' ) );

			$pairs = $this->collect_font_pairs( new Admin() );

			$this->assertSame(
				array(
					'inter-inter-0',
					'playfairdisplay-sourcesanspro-1',
					'montserrat-opensans-2',
					'nunito-lora-3',
					'lato-karla-4',
					'prata-hankengrotesk-5',
				),
				array_keys( $pairs )
			);
		}
	}
}
