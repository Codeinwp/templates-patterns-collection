<?php

// Define dummy classes to satisfy PHPStan
class FLBuilderModule {

	/**
	 * The module's directory url.
	 *
	 * @since 1.0
	 * @var string $url
	 */
	public $url;

	/**
	 * Module constructor.
	 *
	 * @since 1.0
	 */
	public function __construct( $params = null ) {}

    public function init() {}

	/**
	 * Used to enqueue additional frontend styles. Do not enqueue
	 *  frontend.css or frontend.responsive.css as those will be
	 *  enqueued automatically. Params are the same as those used in
	 *  WordPress' wp_enqueue_style function
	 *
	 * @param string $handle Name of the stylesheet.
	 * @param string $src Path to the stylesheet from the root directory of WordPress.
	 * @param array $deps An array of registered stylesheet handles this stylesheet depends on.
	 * @param string $ver String specifying the stylesheet version number.
	 * @param string $media The media for which this stylesheet has been defined.
	 */
	public function add_css( $handle, $src = '', $deps = array(), $ver = '', $media = 'all' ) {}

	/**
	 * Used to enqueue additional frontend scripts. Do not enqueue
	 *  frontend.js as that will be enqueued automatically. Params
	 *  are the same as those used in WordPress' wp_enqueue_script function.
	 *
	 * @param string $handle Name of the script.
	 * @param string $src Path to the script from the root directory of WordPress.
	 * @param array $deps An array of registered script handles this script depends on.
	 * @param string $ver String specifying the script version number.
	 * @param bool $in_footer Whether to enqueue the script before </body> instead of in the <head>.
	 */
	public function add_js( $handle, $src = '', $deps = array(), $ver = '', $in_footer = false ) {}

	public static function get_template_content( $param1 ) {}
}

class FLBuilderModel {
	/**
	 * Update the layout data for a post. We use update_metadata
	 * here instead of update_post_meta to ensure revisions are updated accordingly.
	 *
	 * @since 1.0
	 * @param array $data The layout data to update.
	 * @param string $status Either published or draft.
	 * @param int $post_id The ID of the post to update.
	 * @return void
	 */
	public static function update_layout_data( $data, $status = null, $post_id = null ) {}

	/**
	 * Updates the layout settings for a post.
	 *
	 * @since 1.7
	 * @param array $settings The new layout settings.
	 * @param string $status Either published or draft.
	 * @param int $post_id The ID of the post to update.
	 * @return object
	 */
	public static function update_layout_settings( $param1, $param2 = null, $param3 = null ) {}

	/**
	 * Returns the index of the next available
	 * position in a parent node.
	 *
	 * @since 1.0
	 * @param string $type The type of nodes to count.
	 * @param string $parent_id The parent node id.
	 * @return int
	 */
	static public function next_node_position( $type = 'row', $parent_id = null ) {}

	/**
	 * Returns a node's parent node of the specified type.
	 *
	 * @since 1.8.3
	 * @param string|object $node The node ID. Can also be a node object.
	 * @param string $type The type of parent to return. Either "column", "column-group" or "row".
	 * @return object The parent node.
	 */
	public static function get_node_parent_by_type( $param1, $param2 ) {}

	/**
	 * Generates new node ids for an array of nodes.
	 *
	 * @since 1.0
	 * @param array $data An array of node data.
	 * @return array
	 */
	static public function generate_new_node_ids( $data ) {}

	/**
	 * Get all of the layout data for a post. We use get_metadata
	 * here instead of get_post_meta to ensure revisions are queried accordingly.
	 *
	 * @since 1.0
	 * @param string $status Either published or draft.
	 * @param int $post_id The ID of the post to get data for.
	 * @return array
	 */
	static public function get_layout_data( $status = null, $post_id = null ) {}

	/**
	 * Get the builder settings for a layout.
	 *
	 * @since 1.7
	 * @param string $status Either published or draft.
	 * @param int $post_id The ID of the post to get settings for.
	 * @return object
	 */
	public static function get_layout_settings() {}

	/**
	 * Merge two sets of layout settings together.
	 *
	 * @since 1.7
	 * @param object $settings The layout settings to merge into.
	 * @param object $merge_settings The layout settings to merge.
	 * @return object
	 */
	public static function merge_layout_settings( $param1, $param2 ) {}
	/**
	 * Deletes either the preview, draft or live CSS and/or JS asset cache
	 * for the current post based on the data returned from get_asset_info.
	 * Both the CSS and JS asset cache will be delete if a type is not specified.
	 *
	 * @since 1.0
	 * @param string $type The type of cache to delete. Either css or js.
	 * @return void
	 */
	static public function delete_asset_cache( $type = false ) {}
	/**
	 * Returns the post id for the current post that
	 * is being worked on.
	 *
	 * @since 1.0
	 * @since 1.5.9 Trying to use the global $wp_the_query instead of $post to get the post id.
	 * @return int|bool The post id or false.
	 */
	static public function get_post_id() {}
	/**
	 * Returns a single node.
	 *
	 * @since 1.0
	 * @param string|object $node_id Either a node id or node object.
	 * @param string $status The node status. Either draft or published.
	 * @return object
	 */
	static public function get_node( $node_id = null, $status = null ) {    }
	/**
	 * Returns all child nodes and children of those children
	 * for a single node.
	 *
	 * @since 1.6.3
	 * @param string $parent_id The parent node id.
	 * @return array
	 */
	static public function get_nested_nodes( $parent_id ) {}
	/**
	 * Return an array of post types that the builder
	 * is enabled to work with.
	 *
	 * @since 1.0
	 * @return array
	 */
	static public function get_post_types() {}
}

class FLBuilderSettingsCompat {

	/**
	 * Loops through layout data and ensures node settings
	 * are backwards compatible.
	 *
	 * @since 2.2
	 * @param object|array data
	 * @return object|array
	 */
	public static function filter_layout_data( $data ) {}
}

class FLBuilderAJAX {

	/**
	 * Adds a callable AJAX action.
	 *
	 * @since 1.7
	 * @param string $action The action name.
	 * @param string $method The method to call.
	 * @param array $args An array of method arg names that are present in the post data.
	 * @return void
	 */
	public static function add_action( $param1, $param2, $param3 ) {}
}

class FLBuilder {

	/**
	 * Alias method for registering a module with the builder.
	 *
	 * @since 1.0
	 * @param string $class The module's PHP class name.
	 * @param array $form The module's settings form data.
	 * @return void
	 */
	public static function register_module( $param1, $param2 ) {}
}

class FLBuilderAJAXLayout {

	/**
	 * Renders the layout data to be passed back to the builder.
	 *
	 * @since 1.7
	 * @param string $node_id The ID of a node to try and render instead of the entire layout.
	 * @param string $old_node_id The ID of a node that has been replaced in the layout.
	 * @return array
	 */
	public static function render() {}
}

class FLBuilderUISettingsForms {

	/**
	 * Returns only the node JS config for settings forms.
	 *
	 * @since 2.0
	 * @return array
	 */
	public static function get_node_js_config() {}
}

// Alias the TIOB\TI_Beaver class to a known class, like stdClass or a dummy class
class_alias( 'FLBuilderModule', 'TIOB\TI_Beaver' );
