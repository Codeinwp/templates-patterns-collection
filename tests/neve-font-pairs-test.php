<?php
/**
 * Test the admin font-pair data against incompatible Neve settings APIs.
 *
 * Neve releases before 3.5.0 ship Neve\Core\Settings\Mods but not
 * Neve\Core\Settings\Config::MODS_TPOGRAPHY_FONT_PAIRS, so the old guard fataled.
 *
 * @package templates-patterns-collection
 */

use TIOB\Admin;
use TIOB\License;

/**
 * Test the Neve font-pair compatibility guard.
 */
class Neve_Font_Pairs_Test extends WP_UnitTestCase {

	public function set_up(): void {
		parent::set_up();

		// Admin::get_localization() dereferences the license object unconditionally.
		update_option( License::LICENSE_DATA_OPTIONS_KEY, (object) array( 'key' => 'test-key' ) );

		wp_set_current_user( self::factory()->user->create( array( 'role' => 'administrator' ) ) );
	}

	public function tear_down(): void {
		delete_option( License::LICENSE_DATA_OPTIONS_KEY );

		parent::tear_down();
	}

	/**
	 * A Neve whose Config lacks the font-pair members must not fatal the admin.
	 *
	 * The legacy stubs contradict tests/fixtures/neve-typography-stub.php, which
	 * Google_Fonts_Chunking_Test loads at file scope, so they can only be declared
	 * in a process of their own.
	 *
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_admin_bootstrap_survives_incompatible_neve_config() {
		require_once __DIR__ . '/fixtures/neve-legacy-typography-stub.php';

		$this->assertTrue( class_exists( '\Neve\Core\Settings\Mods', false ) );
		$this->assertFalse( defined( '\Neve\Core\Settings\Config::MODS_TPOGRAPHY_FONT_PAIRS' ) );

		$admin = new Admin();
		$admin->init();

		// get_font_parings() is the last thing init() does, so a registered hook proves it returned.
		$this->assertNotFalse( has_filter( 'neve_dashboard_page_data', array( $admin, 'localize_sites_library' ) ) );
		$this->assertNotFalse( has_action( 'admin_enqueue_scripts', array( $admin, 'enqueue' ) ) );
	}
}
