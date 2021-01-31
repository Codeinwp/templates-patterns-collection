<?php
/**
 * Handles code for Beaver.
 * It is not named Beaver.php on purpose as Beaver takes the module name from the class, hence naming it to Beaver.php would give
 * the module the name of Beaver which can cause conflicts.
 *
 * @package    templates-patterns-collection
 */

namespace TIOB;

use FLBuilder;
use FLBuilderAJAX;
use FLBuilderModel;
use FLBuilderModule;
use FLBuilderSettingsCompat;
use FLBuilderAJAXLayout;
use FLBuilderUISettingsForms;

/**
 * Class Editor
 *
 * @package templates-patterns-collection
 */
class TI_Beaver extends FLBuilderModule {

	/**
	 * The module construct, we need to pass some basic info here.
	 */
	public function __construct() {
		parent::__construct( array(
			'name'        => __( 'Templates Cloud', 'templates-patterns-collection' ),
			'description' => __( 'Templates Cloud by Neve.', 'templates-patterns-collection' ),
			'category'    => __( 'Templates Cloud', 'templates-patterns-collection' ),
			'dir'         => TIOB_PATH . 'beaver/',
			'url'         => TIOB_URL . 'beaver/',
			'icon'        => TIOB_URL . 'beaver/icon.svg',
		) );

		$deps = require( TIOB_PATH . 'beaver/build/index.asset.php' );

		$this->add_js( 'ti-tpc-beaver', $this->url . 'build/index.js', array_merge( $deps['dependencies'], array() ), $deps['version'], true );
		$this->add_css( 'ti-tpc-beaver', $this->url . 'build/index.css', array( 'wp-components' ), $deps['version'] );
	}

	/**
	 * Initialize the Admin.
	 */
	public function init() {
		FLBuilderAJAX::add_action( 'ti_apply_template', __CLASS__ . '::apply_template', array( 'template', 'append' ) );
		add_action( 'wp_head', array( $this, 'inline_script' ), 9 );
	}

	public function inline_script() {
		$tiTpc = apply_filters(
			'ti_tpc_editor_data',
			array(
				'endpoint'         => TPC_TEMPLATES_CLOUD_ENDPOINT,
				'params'           => array(
					'site_url'   => get_site_url(),
					'license_id' => apply_filters( 'product_neve_license_key', 'free' ),
					'type'       => 'beaver',
				),
				'canPredefine'     => apply_filters( 'ti_tpc_can_predefine', false ),
				// 'placeholderIndex' => '-1',
				'exporter'         => array(
				// 	'exportLabel'     => __( 'Save to Templates Cloud' ),
				// 	'modalLabel'      => __( 'Save Templates' ),
					'textLabel'       => __( 'Template Name' ),
				// 	'textPlaceholder' => __( 'Template' ),
				// 	'buttonLabel'     => __( 'Save' ),
				// 	'templateSaved'   => __( 'Template Saved.' ),
				),
				'library'          => array(
					// 'libraryButton'  => __( 'Import from Templates Cloud' ),
					'templatesCloud' => __( 'Templates Cloud' ),
					// 'historyMessage' => __( 'Add Template from Templates Cloud:' ),
					'404'               => __( 'No templates available. Add a new one?' ),
					'deleteItem'        => __( 'Are you sure you want to delete this template?' ),
					'tabs'           => array(
						'templates' => __( 'Page Templates' ),
						'library'   => __( 'My Library' ),
					),
					'actions'        => array(
						'sync'      => __( 'Sync Library' ),
						// 'save'      => __( 'Save to Templates Cloud' ),
						'update'    => __( 'Update' ),
						'close'     => __( 'Close' ),
						// 'cancel'    => __( 'Cancel' ),
						'edit'      => __( 'Edit' ),
						// 'duplicate' => __( 'Duplicate' ),
						'delete'    => __( 'Delete' ),
						'deleting'  => __( 'Deleting' ),
						'preview'   => __( 'Preview' ),
						'import'    => __( 'Import' ),
						// 'back'      => __( 'Back to Library' ),
					),
					'filters'        => array(
						'sortLabel'   => __( 'Sort by' ),
						'sortLabels'  => array(
							'name'     => __( 'Name' ),
							'date'     => __( 'Date' ),
							'modified' => __( 'Last Modified' ),
							'actions'  => __( 'Actions' ),
							'list'     => __( 'List View' ),
							'grid'     => __( 'Grid View' ),
						),
						'search'      => __( 'Search' ),
						'searchLabel' => __( 'Search Templates' ),
					),
					// 'export'         => array(
					// 	'save'         => __( 'Save' ),
					// 	'title'        => __( 'Save your page to Templates Cloud' ),
					// 	'placeholder'  => __( 'Enter Template Name' ),
					// 	'defaultTitle' => __( 'Template' ),
					// ),
				),
			)
		);
		?>
		<script type="text/javascript">
			window.tiTpc = <?php echo json_encode( $tiTpc ); ?>;
		</script> <?php
	}

	/**
	 * Properly serialize JSON output.
	 */
	static public function serialize_corrector( $serialized_string ) {
		// at first, check if "fixing" is really needed at all. After that, security checkup.
		if ( @unserialize( $serialized_string ) !== true && preg_match( '/^[aOs]:/', $serialized_string ) ) {
			$serialized_string = preg_replace_callback(
				'/s\:(\d+)\:\"(.*?)\";/s',
				function ( $matches ) {
					return 's:' . strlen( $matches[2] ) . ':"' . $matches[2] . '";';
				},
				$serialized_string
			);
		}
		return $serialized_string;
	}

	/**
	 * Register editor styles.
	 */
	static public function apply_template( $template, $append = false ) {
		$url = add_query_arg( array(
			'site_url'   => get_site_url(),
			'license_id' => apply_filters( 'product_neve_license_key', 'free' ),
			'cache'      => uniqid(),
		), TPC_TEMPLATES_CLOUD_ENDPOINT . 'templates/' . $template. '/import' );

		$response = wp_remote_get( esc_url_raw( $url ) );
		$response = wp_remote_retrieve_body( $response );
		$response = json_decode( $response, true );
		$response = self::serialize_corrector( $response );
		$response = unserialize( $response );
		$response = $response['layout'][0];

		$row_position = FLBuilderModel::next_node_position( 'row' );

		// Delete existing nodes and settings?
		if ( ! $append ) {
			FLBuilderModel::delete_layout_data( 'draft' );
			FLBuilderModel::delete_layout_settings( 'draft' );
		}

		if ( isset( $response->nodes ) ) {
			// $response->nodes = serialize( $response->nodes );
			// Get new ids for the template nodes.
			$response->nodes = FLBuilderModel::generate_new_node_ids( $response->nodes );

			// Filter the nodes for backwards compatibility with old settings.
			$response->nodes = FLBuilderSettingsCompat::filter_layout_data( $response->nodes );

			// Get the existing layout data and settings.
			$layout_data     = FLBuilderModel::get_layout_data();
			$layout_settings = FLBuilderModel::get_layout_settings();

			// Reposition rows?
			if ( $append ) {
				foreach ( $response->nodes as $node_id => $node ) {

					if ( 'row' == $node->type ) {
						$response->nodes[ $node_id ]->position += $row_position;
					}
				}
			}

			// Merge and update the layout data.
			$data = array_merge( $layout_data, $response->nodes );
			FLBuilderModel::update_layout_data( $data );

			// Merge and update the layout settings.
			if ( isset( $response->settings ) ) {
				$settings = FLBuilderModel::merge_layout_settings( $layout_settings, $response->settings );
				FLBuilderModel::update_layout_settings( $settings );
			}
		}

		// Delete old asset cache.
		FLBuilderModel::delete_asset_cache();

		// Return the layout.
		return array(
			'layout_css' => isset( $settings ) ? $settings->css : null,
			'layout'     => FLBuilderAJAXLayout::render(),
			'config'     => FLBuilderUISettingsForms::get_node_js_config(),
		);
	}
}

FLBuilder::register_module( 'TIOB\TI_Beaver', array() );
