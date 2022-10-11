<?php
/**
 * Plugin Name:       Templates Patterns Collection
 * Description:       This plugin is an add-on to Neve WordPress theme which offers access to Templates and Block Patterns library service to be used with the theme.
 * Version:           1.1.26
 * Author:            ThemeIsle
 * Author URI:        https://themeisle.com
 * License:           GPLv3
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.en.html
 * Text Domain:       templates-patterns-collection
 * Domain Path:       /languages
 * WordPress Available: yes
 * Requires License:    no
 *
 * @package templates-patterns-collection
 */

define( 'TIOB_BASE_FILE', __FILE__ );
define( 'TIOB_TC_FILE', __DIR__ . '/templates-patterns-collection/templates-cloud.php' );

add_action( 'init', 'ti_tpc_load_textdomain' );
add_action( 'init', 'ti_tpc_flush_premalinks' );

/**
 * Flush the permalinks after import
 *
 * @return bool
 */
function ti_tpc_flush_premalinks() {
	$flash_rules = get_transient( 'ti_tpc_should_flush_permalinks' );
	if ( $flash_rules !== 'yes' ) {
		return false;
	}

	flush_rewrite_rules();
	delete_transient( 'ti_tpc_should_flush_permalinks' );

	return true;
}

add_filter( 'themeisle_sdk_products', 'tpc_load_sdk' );

/**
 * Filter products array.
 *
 * @param array $products products array.
 *
 * @return array
 */
function tpc_load_sdk( $products ) {
	$products[] = __FILE__;
	if ( defined( 'TIOB_TC_FILE' ) ) {
		$products[] = TIOB_TC_FILE;
	}
	return $products;
}

add_filter(
	'themesle_sdk_namespace_' . md5( TIOB_TC_FILE ),
	function () {
		return 'tiob';
	}
);

add_filter( 'templates_patterns_collection_hide_license_field', '__return_true' );

/**
 * Load the localisation file.
 */
function ti_tpc_load_textdomain() {
	load_plugin_textdomain( 'templates-patterns-collection', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
}

define( 'TIOB_URL', plugin_dir_url( __FILE__ ) );
define( 'TIOB_PATH', dirname( __FILE__ ) . '/' );


$autoload_path = __DIR__ . '/vendor/autoload.php';
if ( is_file( $autoload_path ) ) {
	require_once $autoload_path;
}
add_action( 'init', 'ti_tpc_run', 999 );

function ti_tpc_run() {
	if ( ! defined( 'TI_ONBOARDING_DISABLED' ) ) {
		define( 'TI_ONBOARDING_DISABLED', false );
	}

	if ( class_exists( 'WP_CLI' ) ) {
		require_once 'includes/WP_Cli.php';
	}

	\TIOB\Main::instance();
}
