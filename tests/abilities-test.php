<?php
/**
 * Starter sites abilities tests.
 *
 * @package templates-patterns-collection
 */

use TIOB\Abilities\Starter_Sites;
use TIOB\Admin;

/**
 * Test the starter sites abilities.
 */
class Abilities_Test extends WP_UnitTestCase {
	/**
	 * @var Starter_Sites
	 */
	private $abilities;

	public function set_up(): void {
		parent::set_up();
		$this->abilities = new Starter_Sites();
	}

	public function tear_down(): void {
		wp_set_current_user( 0 );
		parent::tear_down();
	}

	/**
	 * The abilities grant what the starter sites screen grants, no more.
	 *
	 * @covers \TIOB\Abilities\Starter_Sites::check_permission
	 */
	public function test_permission_matches_the_starter_sites_screen() {
		$capability = Admin::get_starter_sites_capability();
		$this->assertContains( $capability, array( 'install_plugins', 'activate_plugins' ) );

		$admin_id = self::factory()->user->create( array( 'role' => 'administrator' ) );
		wp_set_current_user( $admin_id );
		$this->assertTrue( current_user_can( $capability ) );
		$this->assertTrue( $this->abilities->check_permission() );

		$subscriber_id = self::factory()->user->create( array( 'role' => 'subscriber' ) );
		wp_set_current_user( $subscriber_id );
		$this->assertFalse( $this->abilities->check_permission() );
	}

	/**
	 * A user who can manage options but cannot open the starter sites
	 * screen (a multisite site administrator, for instance) is denied.
	 *
	 * @covers \TIOB\Abilities\Starter_Sites::check_permission
	 */
	public function test_manage_options_alone_is_denied() {
		$user_id = self::factory()->user->create( array( 'role' => 'administrator' ) );
		$user    = get_user_by( 'id', $user_id );
		$user->add_cap( 'install_plugins', false );
		$user->add_cap( 'activate_plugins', false );
		wp_set_current_user( $user_id );

		$this->assertTrue( current_user_can( 'manage_options' ) );
		$this->assertFalse( current_user_can( 'install_plugins' ) );
		$this->assertFalse( current_user_can( 'activate_plugins' ) );

		$this->assertFalse( $this->abilities->check_permission() );
	}
}
