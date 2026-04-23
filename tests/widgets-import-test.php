<?php
/**
 * Widgets importer test cases.
 *
 * Covers the dde-patch v1 slug resolver that rewrites the
 * `nav_menu` widget setting from a source-site term_id to the
 * fresh term_id on the target site based on a `_ti_nav_menu_slug`
 * hint carried in the exported payload.
 *
 * @package templates-patterns-collection
 */

use TIOB\Importers\Widgets_Importer;

/**
 * Class Widgets_Import_Test
 */
class Widgets_Import_Test extends WP_UnitTestCase {

	/**
	 * Register the Neve-style footer sidebar used by the Beauty demo so
	 * the importer treats it as a known sidebar and does not park
	 * widgets in `wp_inactive_widgets`.
	 */
	public function setUp(): void {
		parent::setUp();

		register_sidebar(
			array(
				'name' => 'Footer Two',
				'id'   => 'footer-two-widgets',
			)
		);

		// Make sure the classic nav_menu widget is registered so the
		// importer's available_widgets() check passes.
		if ( ! isset( $GLOBALS['wp_registered_widget_controls']['nav_menu-1'] ) ) {
			wp_widgets_init();
		}

		// Start from a known-clean widget state.
		update_option( 'widget_nav_menu', array( '_multiwidget' => 1 ) );
		update_option(
			'sidebars_widgets',
			array(
				'wp_inactive_widgets' => array(),
				'footer-two-widgets'  => array(),
			)
		);
	}

	public function tearDown(): void {
		delete_option( 'widget_nav_menu' );
		delete_option( 'sidebars_widgets' );
		parent::tearDown();
	}

	/**
	 * When a nav_menu widget carries `_ti_nav_menu_slug`, the importer
	 * must rewrite `nav_menu` to the term_id of the menu that matches
	 * that slug on the current site and strip the hint before persist.
	 */
	public function test_nav_menu_widget_slug_is_resolved_to_target_term_id() {
		$menu_id = wp_create_nav_menu( 'Services' );
		$this->assertNotInstanceOf( WP_Error::class, $menu_id );

		$menu   = wp_get_nav_menu_object( $menu_id );
		$target = (int) $menu->term_id;
		$this->assertNotSame( 999, $target, 'Freshly created menu should not collide with the stale stub id.' );

		$payload = array(
			'footer-two-widgets' => array(
				'nav_menu-2' => array(
					'title'             => 'Services',
					'nav_menu'          => 999,
					'_ti_nav_menu_slug' => $menu->slug,
				),
			),
		);

		$importer = new Widgets_Importer();
		$result   = $importer->actually_import( $payload );

		$this->assertNotInstanceOf( WP_Error::class, $result );

		$stored = get_option( 'widget_nav_menu' );
		$this->assertIsArray( $stored );

		$instance = null;
		foreach ( $stored as $key => $value ) {
			if ( '_multiwidget' === $key ) {
				continue;
			}
			if ( isset( $value['title'] ) && 'Services' === $value['title'] ) {
				$instance = $value;
				break;
			}
		}

		$this->assertNotNull( $instance, 'Imported nav_menu widget instance should be present.' );
		$this->assertSame( $target, (int) $instance['nav_menu'], 'Resolver should rewrite nav_menu to the target term_id.' );
		$this->assertArrayNotHasKey( '_ti_nav_menu_slug', $instance, 'Slug hint should be stripped before persist.' );
	}

	/**
	 * When the hinted slug does not match any existing menu on the
	 * target site, the importer must leave the original `nav_menu`
	 * value intact (non-fatal fallback) and still strip the hint.
	 */
	public function test_nav_menu_widget_unresolvable_slug_keeps_stale_id() {
		$payload = array(
			'footer-two-widgets' => array(
				'nav_menu-2' => array(
					'title'             => 'Services',
					'nav_menu'          => 999,
					'_ti_nav_menu_slug' => 'does-not-exist-on-target',
				),
			),
		);

		$importer = new Widgets_Importer();
		$result   = $importer->actually_import( $payload );

		$this->assertNotInstanceOf( WP_Error::class, $result );

		$stored   = get_option( 'widget_nav_menu' );
		$instance = null;
		foreach ( $stored as $key => $value ) {
			if ( '_multiwidget' === $key ) {
				continue;
			}
			if ( isset( $value['title'] ) && 'Services' === $value['title'] ) {
				$instance = $value;
				break;
			}
		}

		$this->assertNotNull( $instance );
		$this->assertSame( 999, (int) $instance['nav_menu'], 'Unresolved slug should leave the stale id alone.' );
		$this->assertArrayNotHasKey( '_ti_nav_menu_slug', $instance, 'Hint is always stripped, even on failure.' );
	}

	/**
	 * The `ti_tpc_widget_pre_import` filter must be invoked after the
	 * built-in resolver and be able to mutate the widget instance.
	 */
	public function test_ti_tpc_widget_pre_import_filter_runs() {
		$captured = array();
		$filter   = function ( $widget, $id_base, $instance_id, $sidebar_id ) use ( &$captured ) {
			$captured[] = compact( 'widget', 'id_base', 'instance_id', 'sidebar_id' );
			$widget['title'] = 'Filtered';
			return $widget;
		};
		add_filter( 'ti_tpc_widget_pre_import', $filter, 10, 4 );

		$payload = array(
			'footer-two-widgets' => array(
				'nav_menu-2' => array(
					'title'    => 'Services',
					'nav_menu' => 0,
				),
			),
		);

		$importer = new Widgets_Importer();
		$importer->actually_import( $payload );

		remove_filter( 'ti_tpc_widget_pre_import', $filter, 10 );

		$this->assertCount( 1, $captured );
		$this->assertSame( 'nav_menu', $captured[0]['id_base'] );
		$this->assertSame( 'nav_menu-2', $captured[0]['instance_id'] );
		$this->assertSame( 'footer-two-widgets', $captured[0]['sidebar_id'] );

		$stored   = get_option( 'widget_nav_menu' );
		$titles   = array_column( array_filter( $stored, 'is_array' ), 'title' );
		$this->assertContains( 'Filtered', $titles, 'Filter mutation should be persisted.' );
	}
}
