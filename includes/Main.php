<?php
/**
 * Theme Onboarding
 *
 * @package    templates-patterns-collection
 */

namespace TIOB;

use FLBuilder;
use TIOB\Importers\Cleanup\Active_State;

/**
 * Class Main
 */
class Main {
	/**
	 * The version of this library
	 *
	 * @var string Version string.
	 */
	const VERSION = '1.1.32';
	/**
	 * Sites Library API URL.
	 *
	 * @var string API root string.
	 */
	const API_ROOT = 'ti-sites-lib/v1';
	/**
	 * Storage for the remote fetched info.
	 *
	 * @var string Transient slug.
	 */
	const STORAGE_TRANSIENT = 'themeisle_sites_library_data';
	/**
	 * Main
	 *
	 * @var Main
	 */
	protected static $instance = null;
	/**
	 * Admin
	 *
	 * @var Admin
	 */
	public $admin = null;

	/**
	 * Editor
	 *
	 * @var Editor
	 */
	public $editor = null;

	/**
	 * Beaver
	 *
	 * @var Beaver
	 */
	public $beaver = null;

	/**
	 * Elementor
	 *
	 * @var Elementor
	 */
	public $elementor = null;

	/**
	 * Sites listing
	 *
	 * @var Sites_Listing
	 */
	private $sites_listing = null;

	/**
	 * Instantiate the class.
	 *
	 * @static
	 * @return Main
	 * @since  1.0.0
	 * @access public
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
			self::$instance->init();
		}

		return self::$instance;
	}

	/**
	 * Holds the sites data.
	 *
	 * @var null
	 */
	private function init() {
		$this->setup_editor();
		$this->setup_beaver();
		$this->setup_elementor();
		$this->setup_sites_listing();
		add_filter( 'themeisle_sdk_hide_dashboard_widget', '__return_true' );
		add_filter(
			'templates_patterns_collection_feedback_review_message',
			function ( $message ) {
				$message = "Hey, it's great to see you are using <strong>Neve</strong>'s Starter Sites and Templates for a few days now. Which one is your favourite? If you can spare a few moments to rate our work on WordPress.org it would help us a lot (and boost our motivation). Cheers!<br/><br/>
			~ Mihai, curator of Neve's Starter Sites";
				return $message;
			}
		);
		if ( ! $this->should_load() ) {
			return;
		}
		$this->setup_admin();
		$this->setup_api();
		$this->setup_active_state();
	}

	/**
	 * Setup editor functionality.
	 *
	 * @return void
	 */
	private function setup_editor() {
		$this->editor = new Editor();
		$this->editor->init();
	}

	/**
	 * Setup beaver functionality.
	 *
	 * @return void
	 */
	private function setup_beaver() {
		if ( ! class_exists( 'FLBuilder' ) ) {
			return;
		}

		$this->beaver = new TI_Beaver();
		$this->beaver->init();
	}

	/**
	 * Setup Elementor functionality.
	 *
	 * @return void
	 */
	private function setup_elementor() {
		$this->elementor = new Elementor();
		$this->elementor->init();
	}

	/**
	 * Setup sites listing.
	 *
	 * @return void
	 */
	private function setup_sites_listing() {
		$this->sites_listing = new Sites_Listing();
		$this->sites_listing->init();
	}

	/**
	 * Utility to check if sites library should be loaded.
	 *
	 * @return bool
	 */
	private function should_load() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Setup admin functionality.
	 *
	 * @return void
	 */
	private function setup_admin() {
		$this->admin = new Admin();
		$this->admin->init();
	}

	/**
	 * Setup the restful functionality.
	 *
	 *
	 * @return void
	 */
	private function setup_api() {
		$api = new Rest_Server();
		$api->init();
	}

	/**
	 * Setup Active State
	 *
	 * @return void;
	 */
	private function setup_active_state() {
		$active_state = new Active_State();
		$active_state->init();
	}

	/**
	 * Get meta fields.
	 *
	 * @return void
	 */
	static public function get_meta_fields( $post_id, $type ) {
		$fields = apply_filters( 'ti_tpc_template_meta', array(), $post_id, $type );
		$meta   = array();

		if ( sizeof( $fields ) > 0 ) {
			foreach ( $fields as $field ) {
				$value = get_post_meta( $post_id, $field, true );

				if ( ! empty( $value ) ) {
					$meta[ $field ] = $value;
				}
			}
		}

		return $meta;
	}

	/**
	 * Disallow object clone
	 *
	 * @access public
	 * @return void
	 * @since  1.0.0
	 */
	public function __clone() {
	}

	/**
	 * Disable un-serializing
	 *
	 * @access public
	 * @return void
	 * @since  1.0.0
	 */
	public function __wakeup() {
	}
}
