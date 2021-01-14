<?php
/**
 * Handles code for Elementor.
 *
 * @package    templates-patterns-collection
 */

namespace TIOB;

use FLBuilderAJAX;
use FLBuilderModel;
use FLBuilderSettingsCompat;
use FLBuilderAJAXLayout;
use FLBuilderUISettingsForms;

/**
 * Class Editor
 *
 * @package templates-patterns-collection
 */
class Beaver {

	/**
	 * Initialize the Admin.
	 */
	public function init() {
		FLBuilderAJAX::add_action( 'ti_apply_template', 'TIOB\Beaver::apply_template', array( 'template_id', 'append' ) );
	}

	public function my_action_javascript() { ?>
		<script type="text/javascript" >
			FLBuilder.ajax({
				action: 'ti_apply_template',
				template_id: 1,
				append: 0
			}, FLBuilder._applyUserTemplateComplete );
		</script> <?php
	}

	/**
	 * Register editor styles.
	 */
	static public function apply_template( $index = 0, $append = false, $type = 'layout' ) {
		$template     = FLBuilderModel::get_template( $index, $type );
		$row_position = FLBuilderModel::next_node_position( 'row' );

		// Delete existing nodes and settings?
		if ( ! $append ) {
			FLBuilderModel::delete_layout_data( 'draft' );
			FLBuilderModel::delete_layout_settings( 'draft' );
		}

		// Only move forward if we have template nodes.
		if ( isset( $template->nodes ) ) {

			// Get new ids for the template nodes.
			$template->nodes = FLBuilderModel::generate_new_node_ids( $template->nodes );

			// Filter the nodes for backwards compatibility with old settings.
			$template->nodes = FLBuilderSettingsCompat::filter_layout_data( $template->nodes );

			// Get the existing layout data and settings.
			$layout_data     = FLBuilderModel::get_layout_data();
			$layout_settings = FLBuilderModel::get_layout_settings();

			// Reposition rows?
			if ( $append ) {

				foreach ( $template->nodes as $node_id => $node ) {

					if ( 'row' == $node->type ) {
						$template->nodes[ $node_id ]->position += $row_position;
					}
				}
			}

			// Merge and update the layout data.
			$data = array_merge( $layout_data, $template->nodes );
			FLBuilderModel::update_layout_data( $data );

			// Merge and update the layout settings.
			if ( isset( $template->settings ) ) {
				$settings = FLBuilderModel::merge_layout_settings( $layout_settings, $template->settings );
				FLBuilderModel::update_layout_settings( $settings );
			}
		}

		// Delete old asset cache.
		FLBuilderModel::delete_asset_cache();

		// Return the layout.
		return array(
			'layout' => FLBuilderAJAXLayout::render(),
			'config' => FLBuilderUISettingsForms::get_node_js_config(),
		);
	}
}
