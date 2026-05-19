<?php
/**
 * Test TC Disabling.
 *
 * @package templates-patterns-collection
 */

use TIOB\Admin;
use TIOB\License;


/**
 * Test Template Cloud disabling.
 */
class TC_Disabled_Test extends \WP_UnitTestCase {
	private $admin;
	private $license;
	private $neve_pro_license_option;

	public static function set_up_before_class(): void {
		parent::set_up_before_class();
		if ( ! defined( 'NEVE_PRO_BASEFILE' ) ) {
			define( 'NEVE_PRO_BASEFILE', trailingslashit( sys_get_temp_dir() ) . 'neve-pro-addon/neve-pro-addon.php' );
		}
	}

	public function set_up(): void {
		parent::set_up();
		$this->admin = new Admin();
		$this->license = License::get_instance();
		$this->neve_pro_license_option = 'neve_pro_addon_license_data';
	}

	public function tear_down(): void {
		parent::tear_down();
		delete_option(Admin::TC_REMOVED_KEY);
		delete_option(License::LICENSE_DATA_OPTIONS_KEY);
		delete_option(License::LICENSE_KEY_OPTION_KEY);
		delete_option( $this->neve_pro_license_option );
		remove_all_filters( 'product_neve_license_plan' );
	}

	/**
	 * Test that we don't re-set the TC status if it's already set.
	 *
	 * @return void
	 */
	public function test_tc_status_already_set() {
		update_option(Admin::TC_REMOVED_KEY, 'test-value');
		$this->admin->maybe_remove_tc();
		$this->assertEquals('test-value', get_option(Admin::TC_REMOVED_KEY));
	}

	/**
	 * Test that we remove TC if there's no license.
	 *
	 * @return void
	 */
	public function test_removes_tc_without_license() {
		// Set invalid license data
		update_option(License::LICENSE_DATA_OPTIONS_KEY, (object)[
			'license' => 'invalid',
			'key' => 'free'
		]);

		$this->admin->maybe_remove_tc();
		$this->assertEquals('yes', get_option(Admin::TC_REMOVED_KEY));
	}

	/**
	 * Test that we remove TC if there's a valid license key, but no templates.
	 *
	 * @return void
	 */
	public function test_removes_tc_with_no_templates() {
		// Mock valid license but no templates
		update_option(License::LICENSE_DATA_OPTIONS_KEY, (object)[
			'license' => 'valid',
			'key' => 'test-key'
		]);

		// Mock API response for no templates
		add_filter('pre_http_request', function() {
			return [
				'response' => ['code' => 200],
				'body' => json_encode([])
			];
		});

		$this->admin->maybe_remove_tc();
		$this->assertEquals('yes', get_option(Admin::TC_REMOVED_KEY));
	}

	/**
	 * Test that we keep TC if there's a valid license key and templates.
	 *
	 * @return void
	 */
	public function test_keeps_tc_with_license_and_templates() {
		// Mock valid license
		update_option(License::LICENSE_DATA_OPTIONS_KEY, (object)[
			'license' => 'valid',
			'key' => 'test-key'
		]);

		// Mock API response with templates
		add_filter('pre_http_request', function() {
			return [
				'response' => ['code' => 200],
				'body' => json_encode(['template1'])
			];
		});

		$this->admin->maybe_remove_tc();
		$this->assertEquals('no', get_option(Admin::TC_REMOVED_KEY));
	}

	/**
	 * Test that free licenses never show the business/agency onboarding promo text.
	 *
	 * @return void
	 */
	public function test_free_license_excludes_business_agency_onboarding_promo_text() {
		$this->set_active_license_data(
			array(
				'key'  => 'free',
				'tier' => 0,
			)
		);
		$this->set_active_neve_pro_addon();

		$this->assertFalse( $this->invoke_admin_private_method( 'should_show_business_agency_promo_text' ) );
	}

	/**
	 * Test that personal tiers use the default onboarding promo text.
	 *
	 * @return void
	 */
	public function test_personal_license_does_not_show_business_agency_onboarding_promo_text() {
		$this->set_active_license_data(
			array(
				'key'  => 'personal-license',
				'tier' => 2,
			)
		);
		$this->set_active_neve_pro_addon();

		$this->assertFalse( $this->invoke_admin_private_method( 'should_show_business_agency_promo_text' ) );
	}

	/**
	 * Test that business tiers show the business/agency onboarding promo text.
	 *
	 * @return void
	 */
	public function test_business_license_shows_business_agency_onboarding_promo_text() {
		$this->set_active_license_data(
			array(
				'key'  => 'business-license',
				'tier' => 4,
			)
		);
		$this->set_active_neve_pro_addon();

		$this->assertTrue( $this->invoke_admin_private_method( 'should_show_business_agency_promo_text' ) );
	}

	/**
	 * Test that agency tiers show the business/agency onboarding promo text.
	 *
	 * @return void
	 */
	public function test_agency_license_shows_business_agency_onboarding_promo_text() {
		$this->set_active_license_data(
			array(
				'key'  => 'agency-license',
				'tier' => 5,
			)
		);
		$this->set_active_neve_pro_addon();

		$this->assertTrue( $this->invoke_admin_private_method( 'should_show_business_agency_promo_text' ) );
	}

	/**
	 * Test that Neve category mappings override the TPC tier when deciding the promo text.
	 *
	 * @return void
	 */
	public function test_neve_personal_category_does_not_show_business_agency_onboarding_promo_text() {
		$this->set_active_license_data(
			array(
				'key'  => 'business-license',
				'tier' => 4,
			)
		);
		$this->set_active_neve_pro_addon();
		add_filter(
			'product_neve_license_plan',
			function () {
				return 2;
			}
		);

		$this->assertFalse( $this->invoke_admin_private_method( 'should_show_business_agency_promo_text' ) );
	}

	/**
	 * Test that mapped Neve business plans show the business/agency onboarding promo text.
	 *
	 * @return void
	 */
	public function test_neve_business_category_shows_business_agency_onboarding_promo_text() {
		$this->set_active_license_data(
			array(
				'key'  => 'personal-license',
				'tier' => 1,
			)
		);
		$this->set_active_neve_pro_addon();
		add_filter(
			'product_neve_license_plan',
			function () {
				return 3;
			}
		);

		$this->assertTrue( $this->invoke_admin_private_method( 'should_show_business_agency_promo_text' ) );
	}

	/**
	 * Test that the default Neve plan falls back to the TPC tier.
	 *
	 * @return void
	 */
	public function test_default_neve_plan_falls_back_to_tpc_tier() {
		$this->set_active_license_data(
			array(
				'key'  => 'business-license',
				'tier' => 4,
			)
		);
		$this->set_active_neve_pro_addon();
		add_filter(
			'product_neve_license_plan',
			function () {
				return -1;
			}
		);

		$this->assertTrue( $this->invoke_admin_private_method( 'should_show_business_agency_promo_text' ) );
	}

	/**
	 * Set active TPC license data for onboarding promo tests.
	 *
	 * @param array $overrides License data overrides.
	 *
	 * @return void
	 */
	private function set_active_license_data( $overrides = array() ) {
		update_option(
			License::LICENSE_DATA_OPTIONS_KEY,
			(object) array_merge(
				array(
					'license' => 'valid',
					'key'     => 'test-key',
					'tier'    => 0,
				),
				$overrides
			)
		);
	}

	/**
	 * Set an active Neve Pro addon license.
	 *
	 * @return void
	 */
	private function set_active_neve_pro_addon() {
		update_option(
			$this->neve_pro_license_option,
			(object) array(
				'license' => 'valid',
			)
		);
	}

	/**
	 * Invoke a private Admin method.
	 *
	 * @param string $method_name Method name.
	 *
	 * @return mixed
	 */
	private function invoke_admin_private_method( $method_name ) {
		try {
			$method = new ReflectionMethod( $this->admin, $method_name );
		} catch ( ReflectionException $exception ) {
			$this->fail( sprintf( 'Expected private Admin method "%s" to exist.', $method_name ) );
		}

		$method->setAccessible( true );

		return $method->invoke( $this->admin );
	}
}
