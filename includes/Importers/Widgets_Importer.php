<?php
/**
 * Widgets Importer.
 *
 * Author:  Andrei Baicus <andrei@themeisle.com>
 * On:      21/06/2018
 *
 * @package    templates-patterns-collection
 * @soundtrack Milk Carton Kid - The Milk Carton Kids
 */

namespace TIOB\Importers;

use TIOB\Importers\Cleanup\Active_State;
use TIOB\Importers\Helpers\Slug_Mapping;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Class Widgets_Importer
 */
class Widgets_Importer {

	/**
	 * Import Widgets.
	 *
	 * @param WP_REST_Request $request contains the widgets that should be imported.
	 *
	 * @return WP_REST_Response
	 */
	public function import_widgets( WP_REST_Request $request ) {
		$params  = $request->get_json_params();
		$widgets = $params;

		if ( isset( $params['source_url'], $params['widgets'] ) && is_array( $params['widgets'] ) ) {
			$widgets = $params['widgets'];
		}

		if ( isset( $params['source_url'] ) && is_string( $params['source_url'] ) ) {
			Slug_Mapping::register_source_url( $params['source_url'] );
			if ( is_array( $widgets ) && isset( $widgets['source_url'] ) ) {
				unset( $widgets['source_url'] );
			}
		}

		if ( empty( $widgets ) || ! is_array( $widgets ) ) {
			return new WP_REST_Response(
				array(
					'success' => true,
				)
			);
		}

		do_action( 'themeisle_ob_before_widgets_import' );

		$import = $this->actually_import( $widgets );

		if ( is_wp_error( $import ) ) {
			return new WP_REST_Response(
				array(
					'data'    => 'ti__ob_widgets_err_1',
					'success' => false,
				)
			);
		}

		do_action( 'themeisle_ob_after_widgets_import' );

		return new WP_REST_Response(
			array(
				'success' => true,
			)
		);
	}

	/**
	 * Widget import process.
	 *
	 * @param array $data Widgets data.
	 * @return \WP_Error|void
	 */
	public function actually_import( $data ) {
		global $wp_registered_sidebars;
		if ( empty( $data ) || ! is_array( $data ) ) {
			return new WP_Error( 'ti__ob_widget_err_1' );
		}

		$available_widgets = $this->available_widgets();

		// Get previous value to reset on cleanup
		do_action(
			'themeisle_cl_add_item_to_property_state',
			Active_State::WIDGETS_NSP,
			array(
				'id'    => 'sidebars_widgets',
				'value' => get_option( 'sidebars_widgets' ),
			)
		);

		$this->move_widgets_to_inactive();

		$widget_instances = array();
		foreach ( $available_widgets as $widget_data ) {
			$widget_instances[ $widget_data['id_base'] ] = get_option( 'widget_' . $widget_data['id_base'] );
		}

		foreach ( $data as $sidebar_id => $widgets ) {
			if ( 'wp_inactive_widgets' === $sidebar_id ) {
				continue;
			}

			if ( isset( $wp_registered_sidebars[ $sidebar_id ] ) ) {
				$sidebar_available = true;
				$use_sidebar_id    = $sidebar_id;
			} else {
				$sidebar_available = false;
				$use_sidebar_id    = 'wp_inactive_widgets'; // Add to inactive if sidebar does not exist in theme.
			}

			// Loop widgets.
			foreach ( $widgets as $widget_instance_id => $widget ) {

				$fail = false;

				// Get id_base (remove -# from end) and instance ID number.
				$id_base            = preg_replace( '/-[0-9]+$/', '', $widget_instance_id );
				$instance_id_number = str_replace( $id_base . '-', '', $widget_instance_id );

				// Does site support this widget?
				if ( ! isset( $available_widgets[ $id_base ] ) ) {
					$fail = true;
				}

				// Convert multidimensional objects to multidimensional arrays
				$widget = json_decode( wp_json_encode( $widget ), true );
				$widget = Slug_Mapping::rewrite_value( $widget );

				// [dde-patch v1] pre-import widget filter + nav_menu slug resolver.
				// Resolve ID-by-reference fields (menus, etc.) using slug hints carried
				// in the widget instance, then let third parties hook in before persist.
				$widget = $this->resolve_known_references( $widget, $id_base );
				// Filters a widget instance right before it is persisted. Receives
				// ($widget, $id_base, $widget_instance_id, $sidebar_id).
				$widget = apply_filters( 'ti_tpc_widget_pre_import', $widget, $id_base, $widget_instance_id, $sidebar_id );

				// Does widget with identical settings already exist in same sidebar?
				if ( ! $fail && isset( $widget_instances[ $id_base ] ) ) {

					// Get existing widgets in this sidebar.
					$sidebars_widgets = get_option( 'sidebars_widgets' );
					$sidebar_widgets  = isset( $sidebars_widgets[ $use_sidebar_id ] ) ? $sidebars_widgets[ $use_sidebar_id ] : array(); // Check Inactive if that's where will go.

					// Loop widgets with ID base.
					$single_widget_instances = ! empty( $widget_instances[ $id_base ] ) ? $widget_instances[ $id_base ] : array();
					foreach ( $single_widget_instances as $check_id => $check_widget ) {

						// Is widget in same sidebar and has identical settings?
						if ( in_array( "$id_base-$check_id", $sidebar_widgets, true ) && (array) $widget === $check_widget ) {
							$fail = true;
							break;

						}
					}
				}

				// No failure.
				if ( ! $fail ) {

					// Add widget instance
					$single_widget_instances   = get_option( 'widget_' . $id_base ); // All instances for that widget ID base, get fresh every time.
					$single_widget_instances   = ! empty( $single_widget_instances ) ? $single_widget_instances : array(
						'_multiwidget' => 1, // Start fresh if have to.
					);
					$single_widget_instances[] = $widget; // Add it.

					// Get the key it was given.
					end( $single_widget_instances );
					$new_instance_id_number = key( $single_widget_instances );

					// If key is 0, make it 1
					// When 0, an issue can occur where adding a widget causes data from other widget to load,
					// and the widget doesn't stick (reload wipes it).
					if ( '0' === strval( $new_instance_id_number ) ) {
						$new_instance_id_number                             = 1;
						$single_widget_instances[ $new_instance_id_number ] = $single_widget_instances[0];
						unset( $single_widget_instances[0] );
					}

					// Move _multiwidget to end of array for uniformity.
					if ( isset( $single_widget_instances['_multiwidget'] ) ) {
						$multiwidget = $single_widget_instances['_multiwidget'];
						unset( $single_widget_instances['_multiwidget'] );
						$single_widget_instances['_multiwidget'] = $multiwidget;
					}

					// Get previous value to reset on cleanup
					do_action(
						'themeisle_cl_add_item_to_property_state',
						Active_State::WIDGETS_NSP,
						array(
							'id'    => 'widget_' . $id_base,
							'value' => get_option( 'widget_' . $id_base ),
						)
					);

					// Update option with new widget.
					update_option( 'widget_' . $id_base, $single_widget_instances );

					// Assign widget instance to sidebar.
					// Which sidebars have which widgets, get fresh every time.
					$sidebars_widgets = get_option( 'sidebars_widgets' );

					// Avoid rarely fatal error when the option is an empty string
					if ( ! $sidebars_widgets ) {
						$sidebars_widgets = array();
					}

					// Use ID number from new widget instance.
					$new_instance_id = $id_base . '-' . $new_instance_id_number;

					// Add new instance to sidebar.
					$sidebars_widgets[ $use_sidebar_id ][] = $new_instance_id;

					// Save the amended data.
					update_option( 'sidebars_widgets', $sidebars_widgets );

					// After widget import action.
					$after_widget_import = array(
						'sidebar'           => $use_sidebar_id,
						'sidebar_old'       => $sidebar_id,
						'widget'            => $widget,
						'widget_type'       => $id_base,
						'widget_id'         => $new_instance_id,
						'widget_id_old'     => $widget_instance_id,
						'widget_id_num'     => $new_instance_id_number,
						'widget_id_num_old' => $instance_id_number,
					);
					do_action( 'themeisle_ob_after_single_widget_import', $after_widget_import );

				}
			}
		}
	}

	/**
	 * Available widgets
	 *
	 * Gather site's widgets into array with ID base, name, etc.
	 * Used by export and import functions.
	 *
	 * @return array Widget information
	 * @global array $wp_registered_widget_updates
	 * @since 0.4
	 */
	public function available_widgets() {

		global $wp_registered_widget_controls;

		$widget_controls = $wp_registered_widget_controls;

		$available_widgets = array();

		foreach ( $widget_controls as $widget ) {

			// No duplicates.
			if ( ! empty( $widget['id_base'] ) && ! isset( $available_widgets[ $widget['id_base'] ] ) ) {
				$available_widgets[ $widget['id_base'] ]['id_base'] = $widget['id_base'];
				$available_widgets[ $widget['id_base'] ]['name']    = $widget['name'];
			}
		}

		return $available_widgets;

	}

	/**
	 * Resolve known ID-by-reference fields on a widget instance using
	 * slug hints carried in the exported payload.
	 *
	 * Currently handles:
	 * - `nav_menu` widget: reads `_ti_nav_menu_slug`, looks up the menu on
	 *   the target site, rewrites `nav_menu` to the fresh term_id, and
	 *   strips the hint so it never persists into `widget_nav_menu`.
	 *
	 * Behaviour on failure is intentionally non-fatal - if the slug does
	 * not resolve (menu import failed) we leave the stale id in place so
	 * the frontend renders an empty menu widget just like before this
	 * patch, rather than throwing and aborting the whole import.
	 *
	 * @param array  $widget  Widget instance.
	 * @param string $id_base Widget id_base (e.g. `nav_menu`).
	 *
	 * @return array
	 */
	private function resolve_known_references( $widget, $id_base ) {
		if ( ! is_array( $widget ) ) {
			return $widget;
		}

		if ( 'nav_menu' === $id_base && ! empty( $widget['_ti_nav_menu_slug'] ) ) {
			$menu = wp_get_nav_menu_object( $widget['_ti_nav_menu_slug'] );
			if ( $menu && ! is_wp_error( $menu ) ) {
				$widget['nav_menu'] = (int) $menu->term_id;
			}
			unset( $widget['_ti_nav_menu_slug'] );
		}

		return $widget;
	}

	/**
	 * Moves widgets to inactive widgets.
	 */
	private function move_widgets_to_inactive() {
		$current_widgets  = get_option( 'sidebars_widgets' );
		$move_to_inactive = array();
		$clean_widgets    = array();

		foreach ( $current_widgets as $widgets ) {
			if ( ! is_array( $widgets ) ) {
				continue;
			}
			$move_to_inactive = array_merge( $move_to_inactive, $widgets );
		}

		foreach ( $current_widgets as $sidebar_slug => $widgets ) {
			if ( ! is_array( $widgets ) ) {
				$clean_widgets[ $sidebar_slug ] = $widgets;
				continue;
			}

			if ( $sidebar_slug === 'wp_inactive_widgets' ) {
				$clean_widgets[ $sidebar_slug ] = $move_to_inactive;
				continue;
			}

			$clean_widgets[ $sidebar_slug ] = array();
		}

		update_option( 'sidebars_widgets', $clean_widgets );
	}
}
