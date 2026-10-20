<?php
/**
 * Remote content file download test cases.
 *
 * @package templates-patterns-collection
 */

use TIOB\Main;
use TIOB\Rest_Server;

/**
 * Class Content_Download_Test
 */
class Content_Download_Test extends WP_UnitTestCase {
	/**
	 * Administrator user ID.
	 *
	 * @var int
	 */
	public static $admin_id;

	/**
	 * @var Rest_Server
	 */
	private $rest_api;

	/**
	 * Arguments of every request to the content file URL.
	 *
	 * @var array<int, array<string, mixed>>
	 */
	private $requests = array();

	/**
	 * Responses for the content file requests, in order.
	 *
	 * @var array<int, array<string, mixed>|WP_Error>
	 */
	private $responses = array();

	/**
	 * @param WP_UnitTest_Factory $factory The factory.
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		self::$admin_id = $factory->user->create( array( 'role' => 'administrator' ) );
	}

	/**
	 * setUp
	 */
	public function setUp(): void {
		parent::setUp();
		wp_set_current_user( self::$admin_id );
		Main::instance();
		$this->rest_api = new Rest_Server();
		$this->rest_api->init();

		$this->requests  = array();
		$this->responses = array();
		add_filter( 'pre_http_request', array( $this, 'fake_content_file_request' ), 10, 3 );
	}

	/**
	 * tearDown
	 */
	public function tearDown(): void {
		remove_filter( 'pre_http_request', array( $this, 'fake_content_file_request' ), 10 );
		parent::tearDown();
	}

	/**
	 * Answer requests to the demo content file with the queued responses.
	 *
	 * @param false|array<string, mixed>|WP_Error $preempt The preempted response.
	 * @param array<string, mixed>                $args    The request arguments.
	 * @param string                              $url     The request URL.
	 *
	 * @return false|array<string, mixed>|WP_Error
	 */
	public function fake_content_file_request( $preempt, $args, $url ) {
		if ( strpos( $url, 'https://content.example.com/' ) !== 0 ) {
			return $preempt;
		}
		$this->requests[] = $args;

		return array_shift( $this->responses );
	}

	/**
	 * An HTTP response with the given status code.
	 *
	 * @param string $body The response body.
	 * @param int    $code The HTTP status code, 200 by default.
	 *
	 * @return array<string, mixed>
	 */
	private function http_response( $body, $code = 200 ) {
		return array(
			'headers'  => array(),
			'body'     => $body,
			'response' => array(
				'code'    => $code,
				'message' => '',
			),
			'cookies'  => array(),
		);
	}

	/**
	 * Run the remote content import.
	 *
	 * @return WP_REST_Response
	 */
	private function import_remote_content() {
		$request = new WP_REST_Request();
		$request->set_header( 'content-type', 'application/json' );
		$request->set_method( 'POST' );
		$data = json_decode( file_get_contents( dirname( __FILE__ ) . '/fixtures/data.json' ), true );
		$request->set_body(
			wp_json_encode(
				array(
					'contentFile' => 'https://content.example.com/demo.xml',
					'frontPage'   => $data['front_page'],
					'source'      => 'remote',
					'demoSlug'    => 'test-demo',
				)
			)
		);

		return $this->rest_api->run_xml_importer( $request );
	}

	/**
	 * The download is retried once, and the import stops with an error when both attempts fail.
	 */
	public function test_failed_download_stops_the_import() {
		$timeout         = new WP_Error( 'http_request_failed', 'cURL error 28: Operation timed out' );
		$this->responses = array( $timeout, $timeout );

		$response = $this->import_remote_content();

		$this->assertCount( 2, $this->requests );
		$this->assertSame( 60, $this->requests[0]['timeout'] );
		$this->assertSame(
			array(
				'data'    => 'ti__ob_remote_err_3',
				'success' => false,
			),
			$response->get_data()
		);
		$this->assertEmpty(
			get_posts(
				array(
					'post_type'   => 'page',
					'post_status' => 'any',
				)
			)
		);
	}

	/**
	 * An empty file stops the import instead of being imported.
	 */
	public function test_empty_download_stops_the_import() {
		$this->responses = array( $this->http_response( '' ) );

		$response = $this->import_remote_content();

		$this->assertCount( 1, $this->requests );
		$this->assertFalse( $response->get_data()['success'] );
		$this->assertSame( 'ti__ob_remote_err_3', $response->get_data()['data'] );
	}

	/**
	 * A download that fails once and then succeeds is imported.
	 */
	public function test_download_is_retried_once() {
		$this->responses = array(
			new WP_Error( 'http_request_failed', 'cURL error 28: Operation timed out' ),
			$this->http_response( file_get_contents( dirname( __FILE__ ) . '/fixtures/export.xml' ) ),
		);

		$response = $this->import_remote_content();

		$this->assertCount( 2, $this->requests );
		$this->assertSame( 60, $this->requests[1]['timeout'] );
		$this->assertTrue( $response->get_data()['success'] );
		$this->assertNotEmpty(
			get_posts(
				array(
					'post_type'   => 'page',
					'post_status' => 'any',
				)
			)
		);
	}

	/**
	 * An HTTP error page is retried and then stops the import instead of being imported.
	 */
	public function test_http_error_response_stops_the_import() {
		// A valid file body, so a missing status check would import it instead of dying on a parse error.
		$error_page      = $this->http_response( file_get_contents( dirname( __FILE__ ) . '/fixtures/export.xml' ), 504 );
		$this->responses = array( $error_page, $error_page );

		$response = $this->import_remote_content();

		$this->assertCount( 2, $this->requests );
		$this->assertSame(
			array(
				'data'    => 'ti__ob_remote_err_3',
				'success' => false,
			),
			$response->get_data()
		);
		$this->assertEmpty(
			get_posts(
				array(
					'post_type'   => 'page',
					'post_status' => 'any',
				)
			)
		);
	}
}
