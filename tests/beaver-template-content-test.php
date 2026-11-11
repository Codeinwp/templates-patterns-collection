<?php
/**
 * Test Beaver template content decoding.
 *
 * @package templates-patterns-collection
 */

use TIOB\Admin;
use TIOB\TI_Beaver;

/**
 * Payload used to verify that template decoding does not instantiate classes.
 */
class Beaver_Template_Content_Test_Payload {
	/**
	 * Number of times the payload was restored.
	 *
	 * @var int
	 */
	public static $restored = 0;

	/**
	 * Track object restoration.
	 *
	 * @return void
	 */
	public function __wakeup() {
		self::$restored++;
	}
}

/**
 * Beaver template content must retain its expected stdClass structure.
 *
 * @runTestsInSeparateProcesses
 * @preserveGlobalState disabled
 */
class Beaver_Template_Content_Test extends WP_UnitTestCase {
	/**
	 * Load the minimum Beaver API needed by TI_Beaver.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();
		require_once __DIR__ . '/fixtures/beaver-builder-stub.php';

		if ( ! defined( 'TPC_TEMPLATES_CLOUD_ENDPOINT' ) ) {
			define( 'TPC_TEMPLATES_CLOUD_ENDPOINT', Admin::get_templates_cloud_endpoint() );
		}
	}

	/**
	 * Remove the request mock after every test.
	 *
	 * @return void
	 */
	public function tear_down(): void {
		remove_all_filters( 'pre_http_request' );
		parent::tear_down();
	}

	/**
	 * Expected Beaver data remains available after decoding.
	 *
	 * @return void
	 */
	public function test_decodes_expected_template_data(): void {
		$template           = new stdClass();
		$template->nodes    = array( 'node-1' => (object) array( 'type' => 'row' ) );
		$template->settings = (object) array( 'css' => '.example{}' );
		$this->mock_template_response( serialize( $template ) );

		$result = TI_Beaver::get_template_content( 'template-1' );

		$this->assertInstanceOf( stdClass::class, $result );
		$this->assertSame( 'row', $result->nodes['node-1']->type );
		$this->assertSame( '.example{}', $result->settings->css );
	}

	/**
	 * Serialized strings with stale lengths are still corrected.
	 *
	 * @return void
	 */
	public function test_corrects_serialized_string_lengths(): void {
		$this->mock_template_response( 'O:8:"stdClass":1:{s:4:"name";s:3:"test";}' );

		$result = TI_Beaver::get_template_content( 'template-1' );

		$this->assertInstanceOf( stdClass::class, $result );
		$this->assertSame( 'test', $result->name );
	}

	/**
	 * Unexpected classes are not restored while decoding template data.
	 *
	 * @return void
	 */
	public function test_does_not_restore_unexpected_classes(): void {
		$this->mock_template_response( serialize( new Beaver_Template_Content_Test_Payload() ) );

		$result = TI_Beaver::get_template_content( 'template-1' );

		$this->assertSame( 0, Beaver_Template_Content_Test_Payload::$restored );
		$this->assertFalse( $result );
	}

	/**
	 * Mock the Templates Cloud import response.
	 *
	 * @param string $body Serialized template body.
	 *
	 * @return void
	 */
	private function mock_template_response( string $body ): void {
		add_filter(
			'pre_http_request',
			function () use ( $body ) {
				return array(
					'headers'  => array(),
					'body'     => wp_json_encode( $body ),
					'response' => array(
						'code'    => 200,
						'message' => 'OK',
					),
					'cookies'  => array(),
					'filename' => null,
				);
			},
			10,
			3
		);
	}
}
