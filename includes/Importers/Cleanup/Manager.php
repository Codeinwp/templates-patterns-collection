<?php
/**
 * The cleanup manager.
 *
 * Used to manage all cleanup actions.
 *
 * @package    templates-patterns-collection
 */
namespace TIOB\Importers\Cleanup;

/**
 * Class Manager
 * @package TIOB\Importers\Cleanup
 */
class Manager {

	/**
	 * Main
	 *
	 * @var Manager
	 */
	protected static $instance = null;

	/**
	 * Instantiate the class.
	 *
	 * @static
	 * @return Manager
	 * @since  1.0.0
	 * @access public
	 */
	final public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
			self::$instance->init();
		}

		return self::$instance;
	}

	/**
	 * Do init actions.
	 */
	private function init() {}

	final public function uninstall_plugin( $plugin ) {
		if ( is_plugin_active( $plugin ) ) {
			deactivate_plugins( $plugin, true );
		}
		error_log( 'To uninstall:' );
		error_log( $plugin );

		$response = uninstall_plugin( $plugin );
		error_log( json_encode( $response ) );
	}

	private function get_plugin_key_by_slug( $plugin_slug, $plugin_list ) {
		foreach ( $plugin_list as $key => $data ) {
			if ( isset( $data['Name'] ) && sanitize_title( $data['Name'] ) === $plugin_slug ) {
				return $key;
			}
		}
		return '';
	}

	final public function do_cleanup() {
		$active_state = new Active_State();
		$state        = $active_state->get();
		if ( isset( $state['plugins'] ) ) {
			$plugin_list = get_plugins();
			error_log( json_encode( $plugin_list ) );
			foreach ( $state['plugins'] as $plugin_slug => $info ) {
				error_log( json_encode( $plugin_slug ) );
				error_log( json_encode( $this->get_plugin_key_by_slug( $plugin_slug, $plugin_list ) ) );

				$plugin =  $this->get_plugin_key_by_slug( $plugin_slug, $plugin_list );
				if ( empty( $plugin ) ) {
					continue;
				}
				$this->uninstall_plugin( $plugin );
			}
		}
		return true;
	}
}