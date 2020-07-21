<?php
/**
 * Plugin Importer.
 *
 * @package    templates-patterns-collection
 */

namespace TIOB\Importers;

use Plugin_Upgrader;
use TIOB\Importers\Helpers\Quiet_Skin;
use TIOB\Importers\Helpers\Quiet_Skin_Legacy;
use TIOB\Logger;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Class Plugin_Importer
 */
class Plugin_Importer {

	/**
	 * Log
	 *
	 * @var string
	 */
	public $log = '';

	/**
	 * Logger Instance.
	 *
	 * @var Logger
	 */
	private $logger;

	/**
	 * Exceptions entry files mapping.
	 *
	 * slug => entry-file
	 *
	 * @var array
	 */
	private $exception_mapping = array(
		'advanced-css-editor'              => 'css-editor.php',
		'contact-form-7'                   => 'wp-contact-form-7.php',
		'wpforms-lite'                     => 'wpforms.php',
		'beaver-builder-lite-version'      => 'fl-builder.php',
		'wpzoom-addons-for-beaver-builder' => 'wpzoom-bb-addon-pack.php',
	);

	public function __construct() {
		$this->logger = Logger::get_instance();
	}

	/**
	 * Install Plugins.
	 *
	 * @param WP_REST_Request $request contains the plugins that should be installed.
	 *
	 * @return WP_REST_Response
	 */
	public function install_plugins( WP_REST_Request $request ) {
		if ( ! current_user_can( 'install_plugins' ) ) {
			$this->logger->log( 'Current user cannot install plugins' );

			return new WP_REST_Response(
				array(
					'success' => false,
					'log'     => $this->log,
					'data'    => 'ti__ob_perm_err_1',
				)
			);
		}

		do_action( 'themeisle_ob_before_plugins_install' );

		$plugins = $request->get_json_params();
		if ( empty( $plugins ) || ! is_array( $plugins ) ) {
			return new WP_REST_Response(
				array(
					'success' => true,
					'log'     => $this->log,
				)
			);
		}

		foreach ( $plugins as $slug => $state ) {
			if ( ! $state || empty( $state ) ) {
				unset( $plugins[ $slug ] );
			}
		}

		$this->run_plugins_install( $plugins );

		return new WP_REST_Response(
			array(
				'success' => true,
				'log'     => $this->log,
			)
		);
	}

	/**
	 * Install and activate plugins.
	 *
	 * @param array $plugins_array plugins formated slug => true.
	 */
	public function run_plugins_install( $plugins_array ) {
		$active_plugins = get_option( 'active_plugins' );

		foreach ( $plugins_array as $plugin_slug => $true ) {
			if ( in_array( $plugin_slug, $active_plugins ) ) {
				continue;
			}
			$this->logger->log( "Installing {$plugin_slug}.", 'progress' );
			$this->install_single_plugin( $plugin_slug );
			$this->logger->log( "Activating {$plugin_slug}.", 'progress' );
			$this->activate_single_plugin( $plugin_slug );
		}

		$this->remove_possible_redirects();
		$this->logger->log( 'Installed and activated plugins.', 'success' );

		do_action( 'themeisle_ob_after_plugins_install' );

		update_option( 'themeisle_ob_plugins_installed', 'yes' );
	}

	/**
	 * Remove admin redirects.
	 */
	private function remove_possible_redirects() {
		delete_transient( '_wc_activation_redirect' );
		delete_transient( 'wpforms_activation_redirect' );
		update_option( 'themeisle_blocks_settings_redirect', false );
	}

	/**
	 * Install a single plugin
	 *
	 * @param string $plugin_slug plugin slug.
	 */
	private function install_single_plugin( $plugin_slug ) {
		$plugin_dir = WP_PLUGIN_DIR . '/' . $plugin_slug;

		if ( is_dir( $plugin_dir ) ) {
			return;
		}

		do_action( 'themeisle_ob_before_single_plugin_install', $plugin_slug );

		require_once( ABSPATH . 'wp-admin/includes/plugin-install.php' );
		require_once( ABSPATH . 'wp-admin/includes/file.php' );
		require_once( ABSPATH . 'wp-admin/includes/misc.php' );
		require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
		require_once( ABSPATH . 'wp-admin/includes/class-wp-upgrader.php' );

		$api = plugins_api(
			'plugin_information',
			array(
				'slug'   => $plugin_slug,
				'fields' => array(
					'short_description' => false,
					'sections'          => false,
					'requires'          => false,
					'rating'            => false,
					'ratings'           => false,
					'downloaded'        => false,
					'last_updated'      => false,
					'added'             => false,
					'tags'              => false,
					'compatibility'     => false,
					'homepage'          => false,
					'donate_link'       => false,
				),
			)
		);

		if ( version_compare( PHP_VERSION, '5.6' ) === -1 ) {
			$skin = new Quiet_Skin_Legacy(
				array(
					'api' => $api,
				)
			);
		} else {
			$skin = new Quiet_Skin(
				array(
					'api' => $api,
				)
			);
		}
		$upgrader = new Plugin_Upgrader( $skin );
		$install  = $upgrader->install( $api->download_link );
		if ( $install !== true ) {
			$this->log .= 'Error: Install process failed (' . ucwords( $plugin_slug ) . ').' . "\n";

			return;
		}
		$this->log .= 'Installed "' . ucwords( $plugin_slug ) . '"' . "\n ";

		do_action( 'themeisle_ob_after_single_plugin_install', $plugin_slug );
	}

	/**
	 * Get full plugin path.
	 *
	 * @param string $slug The plugin slug.
	 *
	 * @return string
	 */
	private function get_plugin_path( $slug ) {
		$plugin_dir = WP_PLUGIN_DIR . '/' . $slug;

		if ( array_key_exists( $slug, $this->exception_mapping ) ) {
			return trailingslashit( $plugin_dir ) . $this->exception_mapping[ $slug ];
		}

		$plugin_path = $plugin_dir . '/' . $slug . '.php';

		if ( ! file_exists( $plugin_path ) ) {
			$plugin_path = $plugin_dir . '/' . 'index.php';
		}

		return $plugin_path;
	}

	/**
	 * Get plugin entry file.
	 *
	 * @param string $slug The plugin slug.
	 *
	 * @return string
	 */
	private function get_plugin_entry( $slug ) {
		if ( $slug === 'advanced-css-editor' ) {
			return $slug . '/css-editor.php';
		}

		if ( $slug === 'contact-form-7' ) {
			return $slug . '/wp-contact-form-7.php';
		}

		if ( $slug === 'wpforms-lite' ) {
			return $slug . '/wpforms.php';
		}

		$plugins_dir = WP_PLUGIN_DIR . '/';
		$entry       = $slug . '/' . $slug . '.php';
		if ( ! file_exists( $plugins_dir . $entry ) ) {
			$entry = $slug . '/index.php';
		}

		return $entry;
	}

	/**
	 * Activate a single plugin
	 *
	 * @param string $plugin_slug plugin slug.
	 */
	private function activate_single_plugin( $plugin_slug ) {
		$plugin_dir = WP_PLUGIN_DIR . '/' . $plugin_slug;

		$plugin_path  = $this->get_plugin_path( $plugin_slug );
		$plugin_entry = $this->get_plugin_entry( $plugin_slug );

		if ( ! file_exists( $plugin_path ) ) {
			$this->log .= 'No plugin with the slug "' . $plugin_slug . '" under that directory.' . "\n";

			return;
		}

		do_action( 'themeisle_ob_before_single_plugin_activation', $plugin_slug );

		include_once( ABSPATH . 'wp-admin/includes/plugin.php' );

		if ( is_plugin_active( $plugin_entry ) ) {
			$this->log .= '"' . ucwords( $plugin_slug ) . '" already active.' . "\n";

			return;
		}
		$this->maybe_provide_activation_help( $plugin_slug, $plugin_dir );

		activate_plugin( $plugin_path );
		$this->log .= 'Activated ' . ucwords( $plugin_slug ) . '.' . "\n";

		do_action( 'themeisle_ob_after_single_plugin_activation', $plugin_slug );
	}

	/**
	 * Take care of plugins that need special conditions on activation.
	 *
	 * @param string $slug plugin slug.
	 * @param string $path plugin path.
	 */
	private function maybe_provide_activation_help( $slug, $path ) {
		if ( $slug === 'woocommerce' ) {
			require_once( $path . '/includes/admin/wc-admin-functions.php' );
		}
	}
}
