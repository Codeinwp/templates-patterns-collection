<?php

// Define dummy classes and methods to satisfy PHPStan
class Elementor_Plugin {
	public static $instance;
}

class Elementor_Modules_Library_Documents_Page {
	public static function get_class_full_name() {}
}

class Elementor_TemplateLibrary_Source_Local {
	/**
	 * Import local template.
	 *
	 * Import template from a file.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param string $name - The file name
	 * @param string $path - The file path
	 * @return \WP_Error|array An array of items on success, 'WP_Error' on failure.
	 */
	public function import_template( $name, $path ) {}
}

class Elementor_Utils {
	/**
	 * Generate random string.
	 *
	 * Returns a string containing a hexadecimal representation of random number.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @return string Random string.
	 */
	public static function generate_random_string() {}
}


// Aliases to match the original class names
class_alias( 'Elementor_Plugin', 'Elementor\Plugin' );
class_alias( 'Elementor_Modules_Library_Documents_Page', 'Elementor\Modules\Library\Documents\Page' );
class_alias( 'Elementor_TemplateLibrary_Source_Local', 'Elementor\TemplateLibrary\Source_Local' );
class_alias( 'Elementor_Utils', 'Elementor\Utils' );
