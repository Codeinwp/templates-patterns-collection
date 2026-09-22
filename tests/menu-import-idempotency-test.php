<?php
/**
 * Starter-site import regression tests for navigation menu items.
 *
 * @package templates-patterns-collection
 */

use TIOB\Importers\WP\WP_Import;

/**
 * Class Menu_Import_Idempotency_Test
 */
class Menu_Import_Idempotency_Test extends WP_UnitTestCase {

	const FIXTURE = __DIR__ . '/fixtures/elementor_menu/export.xml';

	public function setUp(): void {
		parent::setUp();
		if ( ! class_exists( 'WP_Importer' ) ) {
			require_once ABSPATH . 'wp-admin/includes/class-wp-importer.php';
		}
	}

	private function run_import() {
		$importer = new WP_Import( 'elementor' );
		$importer->import( self::FIXTURE );
	}

	private function get_menu_items() {
		$menu = get_term_by( 'slug', 'fixture-main', 'nav_menu' );

		return wp_get_nav_menu_items( $menu->term_id );
	}

	private function find_item_by_title( $items, $title ) {
		foreach ( $items as $item ) {
			if ( $title === $item->title ) {
				return $item;
			}
		}
		$this->fail( "Menu item '{$title}' not found." );
	}

	public function test_importing_twice_does_not_duplicate_menu_items() {
		$this->run_import();
		$this->run_import();

		$this->assertCount( 3, $this->get_menu_items() );
	}

	public function test_importing_twice_keeps_child_menu_items_under_their_parent() {
		$this->run_import();
		$this->run_import();

		$items = $this->get_menu_items();
		$home  = $this->find_item_by_title( $items, 'Home' );
		$about = $this->find_item_by_title( $items, 'About' );
		$this->assertSame( $home->ID, intval( $about->menu_item_parent ) );
	}
}
