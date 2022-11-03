<?php
/**
 * Plugin Importer.
 *
 * @package    templates-patterns-collection
 */

namespace TIOB\Importers;

use Plugin_Upgrader;
use TIOB\Importers\Cleanup\Active_State;
use TIOB\Importers\Helpers\Quiet_Skin;
use TIOB\Importers\Helpers\Quiet_Skin_Legacy;
use TIOB\Logger;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Class Plugin_Importer
 */
class Plugin_Importer {

	const OPTIMOLE_FRESH_INSTALL_FLAG = 'optml_fresh_install';
	const OPTIMOLE_SLUG               = 'optimole-wp';

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
		'recipe-card-blocks-by-wpzoom'     => 'wpzoom-recipe-card.php',
		'restrict-content'                 => 'restrictcontent.php',
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
		require_once( ABSPATH . 'wp-admin/includes/plugin-install.php' );
		require_once( ABSPATH . 'wp-admin/includes/file.php' );
		require_once( ABSPATH . 'wp-admin/includes/misc.php' );
		require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
		require_once( ABSPATH . 'wp-admin/includes/class-wp-upgrader.php' );

		$plugins = $request->get_json_params();

		foreach ( $plugins as $slug => $state ) {
			if ( ! $state || empty( $state ) ) {
				unset( $plugins[ $slug ] );
			}

			if ( $this->plugin_dir_exists( $slug ) && $this->plugin_is_active( $slug ) ) {
				unset( $plugins[ $slug ] );
			}
		}

		if ( empty( $plugins ) || ! is_array( $plugins ) ) {
			return new WP_REST_Response(
				array(
					'success' => true,
					'log'     => $this->log,
				)
			);
		}

		do_action( 'themeisle_ob_before_plugins_install' );

		$install = $this->run_plugins_install( $plugins );

		if ( $install instanceof WP_REST_Response ) {
			return $install;
		}

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
	 *
	 *
	 * @return WP_REST_Response
	 */
	public function run_plugins_install( $plugins_array ) {
		$plugin_cleanup = array();
		foreach ( $plugins_array as $plugin_slug => $true ) {
			$this->logger->log( "Installing {$plugin_slug}.", 'progress' );
			$install = $this->install_single_plugin( $plugin_slug );
			if ( ! $install ) {
				$this->logger->log( 'Current user cannot install plugins.' );

				return new WP_REST_Response(
					array(
						'success' => false,
						'log'     => $this->log,
						'data'    => 'no_plugin_install_permission',
					)
				);
			}
			$plugin_cleanup[ $plugin_slug ]['installed'] = true;
			$this->logger->log( "Activating {$plugin_slug}.", 'progress' );
			$activate = $this->activate_single_plugin( $plugin_slug );
			if ( ! $activate ) {
				$this->logger->log( 'Current user cannot activate plugins.' );

				return new WP_REST_Response(
					array(
						'success' => false,
						'log'     => $this->log,
						'data'    => 'no_plugin_activation_permission',
					)
				);
			}
			$plugin_cleanup[ $plugin_slug ]['active'] = true;
		}
		do_action( 'themeisle_cl_add_property_state', Active_State::PLUGINS_NSP, $plugin_cleanup );

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
	 *
	 * @return bool
	 */
	private function install_single_plugin( $plugin_slug ) {
		// Plugin is already there.
		if ( $this->plugin_dir_exists( $plugin_slug ) ) {
			return true;
		}

		// User doesn't have permissions.
		if ( ! current_user_can( 'install_plugins' ) && ! class_exists( 'WP_CLI' ) ) {
			return false;
		}

		do_action( 'themeisle_ob_before_single_plugin_install', $plugin_slug );

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

		if ( version_compare( PHP_VERSION, '5.6' ) === - 1 ) {
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

			return false;
		}
		$this->log .= 'Installed "' . ucwords( $plugin_slug ) . '"' . "\n ";

		do_action( 'themeisle_ob_after_single_plugin_install', $plugin_slug );

		return true;
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
	 *
	 * @return bool
	 */
	private function activate_single_plugin( $plugin_slug ) {
		$plugin_dir = WP_PLUGIN_DIR . '/' . $plugin_slug;

		$plugin_path = $this->get_plugin_path( $plugin_slug );

		// Plugin isn't there.
		if ( ! file_exists( $plugin_path ) ) {
			$this->log .= 'No plugin with the slug "' . $plugin_slug . '" under that directory.' . "\n";

			return false;
		}

		do_action( 'themeisle_ob_before_single_plugin_activation', $plugin_slug );

		// Plugin is already active.
		if ( $this->plugin_is_active( $plugin_slug ) ) {
			$this->log .= '"' . ucwords( $plugin_slug ) . '" already active.' . "\n";

			return true;
		}

		// User doesn't have permissions.
		if ( ! current_user_can( 'activate_plugins' ) && ! class_exists( 'WP_CLI' ) ) {
			return false;
		}

		$this->maybe_provide_activation_help( $plugin_slug, $plugin_dir );

		activate_plugin( $plugin_path );
		$this->log .= 'Activated ' . ucwords( $plugin_slug ) . '.' . "\n";

		if ( $plugin_slug === self::OPTIMOLE_SLUG ) {
			delete_transient( self::OPTIMOLE_FRESH_INSTALL_FLAG );
		}

		do_action( 'themeisle_ob_after_single_plugin_activation', $plugin_slug );

		return true;
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

			// hook into this filter to remove pages on activation of woocommerce
			add_filter( 'woocommerce_create_pages', array( $this, 'woocommerce_activation_pages' ) );
		}
	}

	/**
	 * Filter pages from woocommerce activation.
	 *
	 * @param array $pages List of pages to be created on activation.
	 *
	 * @return array
	 */
	public function woocommerce_activation_pages( $pages ) {
		$filtered_pages = array( 'shop', 'cart', 'checkout', 'myaccount' );
		foreach ( $filtered_pages as $filter ) {
			if ( isset( $pages[ $filter ] ) ) {
				unset( $pages[ $filter ] );
			}
		}

		return $pages;
	}

	/**
	 * Check if plugin directory exists.
	 *
	 * @param string $slug plugin slug.
	 *
	 * @retun bool
	 */
	private function plugin_dir_exists( $slug ) {
		return is_dir( WP_PLUGIN_DIR . '/' . $slug );
	}

	/**
	 * Check if plugin is already active.
	 *
	 * @param string $slug plugin slug.
	 *
	 * @retun bool
	 */
	private function plugin_is_active( $slug ) {
		$plugin_entry = $this->get_plugin_entry( $slug );
		include_once( ABSPATH . 'wp-admin/includes/plugin.php' );

		return is_plugin_active( $plugin_entry );
	}
}
