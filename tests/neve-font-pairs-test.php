<?php
/**
 * Test the admin font-pair data against incompatible Neve settings APIs.
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

		public function set_up(): void {
			parent::set_up();
			wp_set_current_user( self::factory()->user->create( array( 'role' => 'administrator' ) ) );
		}

		/**
		 * A Neve whose Config lacks the font-pair members must not fatal the admin.
		 */
		public function test_admin_bootstrap_survives_incompatible_neve_config() {
			$this->assertTrue( class_exists( '\Neve\Core\Settings\Mods', false ) );
			$this->assertFalse( defined( '\Neve\Core\Settings\Config::MODS_TPOGRAPHY_FONT_PAIRS' ) );

			$admin = new Admin();
			$admin->init();

			// get_font_parings() is the last thing init() does, so a registered hook proves it returned.
			$this->assertNotFalse( has_filter( 'neve_dashboard_page_data', array( $admin, 'localize_sites_library' ) ) );
			$this->assertNotFalse( has_action( 'admin_enqueue_scripts', array( $admin, 'enqueue' ) ) );
		}
	}
}
