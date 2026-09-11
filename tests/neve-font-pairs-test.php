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
	use TIOB\License;

	/**
	 * Test the Neve font-pair compatibility guard.
	 */
	class Neve_Font_Pairs_Test extends \WP_UnitTestCase {

		/**
		 * Data localized to the dashboard script during the last enqueue.
		 *
		 * @var array
		 */
		private $dashboard_data = array();

		public function set_up(): void {
			parent::set_up();
			$this->dashboard_data = array();
			wp_set_current_user( self::factory()->user->create( array( 'role' => 'administrator' ) ) );

			// get_localization() reads the license key off this option.
			update_option(
				License::LICENSE_DATA_OPTIONS_KEY,
				(object) array(
					'key'     => 'test-key',
					'license' => 'valid',
				)
			);
		}

		public function tear_down(): void {
			$this->dashboard_data = array();
			delete_option( License::LICENSE_DATA_OPTIONS_KEY );
			unset( $GLOBALS['current_screen'] );
			parent::tear_down();
		}

		/**
		 * Run the admin bootstrap and return the data it localizes to the dashboard.
		 *
		 * @return array
		 */
		private function get_dashboard_data() {
			add_filter(
				'neve_dashboard_page_data',
				function ( $data ) {
					$this->dashboard_data = $data;

					return $data;
				}
			);

			$admin = new Admin();
			$admin->init();

			set_current_screen( 'appearance_page_tiob-starter-sites' );
			$admin->enqueue();

			return $this->dashboard_data;
		}

		/**
		 * A Neve whose Config lacks the font-pair members must not fatal the admin.
		 */
		public function test_admin_bootstrap_survives_incompatible_neve_config() {
			$this->assertTrue( class_exists( '\Neve\Core\Settings\Mods', false ) );
			$this->assertFalse( defined( '\Neve\Core\Settings\Config::MODS_TPOGRAPHY_FONT_PAIRS' ) );

			$admin = new Admin();
			$admin->init();

			$this->assertNotFalse( has_filter( 'neve_dashboard_page_data', array( $admin, 'localize_sites_library' ) ) );
		}

		/**
		 * The dashboard falls back to the bundled font pairs on an incompatible Neve.
		 */
		public function test_dashboard_data_falls_back_to_bundled_font_pairs() {
			$data = $this->get_dashboard_data();

			$this->assertArrayHasKey( 'fontParings', $data );
			$this->assertSame(
				array(
					'inter-inter-0',
					'playfairdisplay-sourcesanspro-1',
					'montserrat-opensans-2',
					'nunito-lora-3',
					'lato-karla-4',
					'prata-hankengrotesk-5',
				),
				array_keys( $data['fontParings'] )
			);
		}

	}
}
