<?php
/**
 * PHPUnit bootstrap file
 *
 * @package Sample_Theme
 */

$_tests_dir = getenv( 'WP_TESTS_DIR' );

if ( ! $_tests_dir ) {
    $_tests_dir = rtrim( sys_get_temp_dir(), '/\\' ) . '/wordpress-tests-lib';
}

if ( ! file_exists( $_tests_dir . '/includes/functions.php' ) ) {
    echo "Could not find $_tests_dir/includes/functions.php, have you run bin/install-wp-tests.sh ?" . PHP_EOL;
    exit( 1 );
}

define( 'NEVE_VERSION', '1.0.0' );

// Give access to tests_add_filter() function.
require_once $_tests_dir . '/includes/functions.php';

/**
 * Registers theme
 */
function _register_module() {
    require_once dirname( dirname( __FILE__ ) ) . '/templates-patterns-collection.php';
}

tests_add_filter( 'muplugins_loaded', '_register_module' );

// Start up the WP testing environment.
require $_tests_dir . '/includes/bootstrap.php';
