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

	public function set_up(): void {
		parent::set_up();
		$this->admin = new Admin();
		$this->license = License::get_instance();
	}

	public function tear_down(): void {
		parent::tear_down();
		delete_option(Admin::TC_REMOVED_KEY);
		delete_option(License::LICENSE_DATA_OPTIONS_KEY);
		delete_option(License::LICENSE_KEY_OPTION_KEY);
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
}

