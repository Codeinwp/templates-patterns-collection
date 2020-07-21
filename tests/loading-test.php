<?php
/**
 * `loading` test.
 *
 * @package templates-patterns-collection
 */

/**
 * Test onboarding loading.
 * @runTestsInSeparateProcesses
 */
class Onboarding_Loading_Test extends WP_UnitTestCase {
	/**
	 * Test if the SDK is loading properly and version is exported.
	 */
	public function test_class_init() {
		$this->assertInstanceOf( '\TIOB\Main', \TIOB\Main::instance() );
	}
}
