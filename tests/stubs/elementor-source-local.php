<?php
/**
 * Minimal Elementor stubs for the Zelle migration tests.
 *
 * Elementor is not loaded at bootstrap, so the Zelle importer's dependencies are
 * declared here. Loaded lazily from the test's set_up(), never at file scope:
 * class declarations are process global, and Onboarding_Rest_Test activates the
 * real Elementor mid-run, which would collide with these.
 *
 * @package templates-patterns-collection
 */

namespace {

	/**
	 * Controls what the stubbed Elementor returns.
	 */
	class Elementor_Stub_State {
		/**
		 * Value Source_Local::import_template() hands back.
		 *
		 * @var mixed
		 */
		public static $import_result = array();

		/**
		 * Document types registered during the run.
		 *
		 * @var array
		 */
		public static $registered_document_types = array();

		public static function reset() {
			self::$import_result             = array();
			self::$registered_document_types = array();
		}
	}
}

namespace Elementor {

	class Documents_Manager {
		public function register_document_type( $type, $class ) {
			\Elementor_Stub_State::$registered_document_types[ $type ] = $class;
		}
	}

	class Plugin {
		/**
		 * @var Plugin
		 */
		public static $instance;

		/**
		 * @var Documents_Manager
		 */
		public $documents;

		public function __construct() {
			$this->documents = new Documents_Manager();
		}
	}

	Plugin::$instance = new Plugin();
}

namespace Elementor\Modules\Library\Documents {

	class Page {
		public static function get_class_full_name() {
			return __CLASS__;
		}
	}
}

namespace Elementor\TemplateLibrary {

	class Source_Local {
		/**
		 * Import local template.
		 *
		 * @param string $name File name.
		 * @param string $path File path.
		 *
		 * @return \WP_Error|array
		 */
		public function import_template( $name, $path ) {
			return \Elementor_Stub_State::$import_result;
		}
	}
}
