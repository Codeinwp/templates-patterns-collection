<?php
/**
 * Plugin Name:       Templates Patterns Collection
 * Description:       This plugin is an add-on to Neve WordPress theme which offers access to Templates and Block Patterns library service to be used with the theme.
 * Version:           1.0.10
 * Author:            ThemeIsle
 * Author URI:        https://themeisle.com
 * License:           GPLv3
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.en.html
 * Text Domain:       templates-patterns-collection
 * Domain Path:       /languages
 * WordPress Available:  yes
 * Requires License:    no
 *
 * @package templates-patterns-collection
 */

add_action( 'admin_notices', 'ti_tpc_plugins_page_notice' );
add_action( 'init', 'ti_tpc_load_textdomain' );

/**
 * Plugins page notice if we don't have neve activated.
 */
function ti_tpc_plugins_page_notice() {
	if ( defined( 'NEVE_VERSION' ) ) {
		return;
	}

	$screen = get_current_screen();
	if ( ! isset( $screen->id ) ) {
		return;
	}

	if ( $screen->id !== 'plugins' ) {
		return;
	}

	$notice  = '<div class="notice notice-warning">';
	$notice .= '<p>';
	$notice .= sprintf(
		__( 'You need to have %1$s installed and activated to use %2$s.' ),
		'<strong>' . __( 'Neve Theme' ) . '</strong>',
		'<strong>' . __( 'Templates Patterns Collection' ) . '</strong>'
	);
	$notice .= '</p>';
	$notice .= '<p class="actions">';
	$notice .= '<a class="button button-primary" href="' . esc_url( admin_url( 'theme-install.php?theme=neve' ) ) . '">';
	$notice .= __( 'Install and Activate Neve' );
	$notice .= '</a>';
	$notice .= '</p>';
	$notice .= '</div>';

	echo wp_kses_post( $notice );
}

/**
 * Load the localisation file.
 */
function ti_tpc_load_textdomain() {
	load_plugin_textdomain( 'templates-patterns-collection', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
}

add_action( 'init', 'ti_tpc_run' );

function ti_tpc_run() {
	if ( ! defined( 'NEVE_VERSION' ) ) {
		return;
	}

	if ( ! defined( 'TI_ONBOARDING_DISABLED' ) ) {
		define( 'TI_ONBOARDING_DISABLED', false );
	}

	define( 'TIOB_URL', plugin_dir_url( __FILE__ ) );
	define( 'TIOB_PATH', dirname( __FILE__ ) . '/' );

	$autoload_path = __DIR__ . '/vendor/autoload.php';
	if ( is_file( $autoload_path ) ) {
		require_once $autoload_path;
	}

	if ( class_exists( 'WP_CLI' ) ) {
		require_once 'includes/WP_Cli.php';
	}
}



