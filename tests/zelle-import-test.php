<?php
/**
 * Zelle front page migration tests.
 *
 * @package templates-patterns-collection
 */

use TIOB\Rest_Server;

/**
 * Test the Zelle front page migration REST flow.
 */
class Zelle_Import_Test extends WP_UnitTestCase {
	/**
	 * @var Rest_Server
	 */
	private $rest_api;

	/**
	 * Path of the Zelle template the migration reads.
	 *
	 * @var string
	 */
	private $template_path;

	/**
	 * Whether this class declared the Elementor stubs.
	 *
	 * @var bool
	 */
	private static $stubs_loaded = false;

	public function set_up() {
		parent::set_up();

		$this->rest_api = new Rest_Server();

		// insert_page() queries this post type; it belongs to Elementor, which is absent here.
		register_post_type( 'elementor_library', array( 'public' => false ) );

		set_theme_mod( 'ti_prev_theme', 'zelle' );
		update_option( 'theme_mods_zelle', $this->get_theme_mods() );

		$this->template_path = get_temp_dir() . 'tiob-zelle-511.json';
		file_put_contents( $this->template_path, wp_json_encode( $this->get_template_data() ) );
	}

	/**
	 * Load the Elementor stubs on demand.
	 *
	 * Declared inside the test rather than at file scope: Onboarding_Rest_Test
	 * activates the real Elementor in the same process, and PHP class
	 * declarations cannot be undone.
	 */
	private function stub_elementor( $import_result ) {
		if ( ! self::$stubs_loaded && class_exists( '\\Elementor\\TemplateLibrary\\Source_Local', false ) ) {
			$this->markTestSkipped( 'The real Elementor is loaded in this process, so the import result cannot be controlled.' );
		}

		require_once __DIR__ . '/stubs/elementor-source-local.php';
		self::$stubs_loaded = true;

		Elementor_Stub_State::reset();
		Elementor_Stub_State::$import_result = $import_result;
	}

	public function tear_down() {
		if ( class_exists( 'Elementor_Stub_State', false ) ) {
			Elementor_Stub_State::reset();
		}

		if ( file_exists( $this->template_path ) ) {
			unlink( $this->template_path );
		}

		$uploads    = wp_upload_dir();
		$leftover   = $uploads['basedir'] . '/zelle.json';
		if ( file_exists( $leftover ) ) {
			unlink( $leftover );
		}

		delete_option( 'theme_mods_zelle' );
		remove_theme_mod( 'ti_prev_theme' );
		remove_theme_mod( 'zelle_frontpage_was_imported' );
		remove_theme_mod( 'ti_content_imported' );
		delete_option( 'page_on_front' );
		delete_option( 'show_on_front' );

		unregister_post_type( 'elementor_library' );

		parent::tear_down();
	}

	/**
	 * Build the migration request.
	 *
	 * @param string $template Template path.
	 *
	 * @return WP_REST_Request
	 */
	private function build_request( $template = null ) {
		$request = new WP_REST_Request();
		$request->set_header( 'content-type', 'application/json' );
		$request->set_method( 'POST' );
		$request->set_body(
			wp_json_encode(
				array(
					'template'      => null === $template ? $this->template_path : $template,
					'template_name' => 'Zelle Frontpage',
				)
			)
		);

		return $request;
	}

	/**
	 * Theme mods that send every mappable section down its early-return branch,
	 * so the fixture only has to satisfy the ribbon section.
	 *
	 * @return array
	 */
	private function get_theme_mods() {
		return array(
			'zerif_bigtitle_show'     => 1,
			'zerif_ourfocus_show'     => 1,
			'zerif_aboutus_show'      => 1,
			'zerif_ourteam_show'      => 1,
			'zerif_testimonials_show' => 1,
			'zerif_contactus_show'    => 1,
		);
	}

	/**
	 * A minimal Zelle template: ten sections, with the nesting map_ribbon_section() reads unguarded.
	 *
	 * @return array
	 */
	private function get_template_data() {
		$section = array(
			'settings' => array(),
			'elements' => array(),
		);

		$content = array_fill( 0, 10, $section );

		$content[2]['elements'] = array(
			array(
				'elements' => array(
					array( 'settings' => array() ),
					array( 'settings' => array() ),
				),
			),
		);

		$content[6]['elements'] = array(
			array( 'elements' => array( array( 'settings' => array() ) ) ),
			array( 'elements' => array( array( 'settings' => array() ) ) ),
		);

		return array(
			'title'   => 'Zelle Frontpage',
			'type'    => 'not-supported',
			'content' => $content,
		);
	}

	/**
	 * A WP_Error from Elementor must come back as a handled failure, not a fatal.
	 *
	 * @covers \TIOB\Importers\Zelle_Importer::import_zelle_frontpage
	 */
	public function test_elementor_import_error_returns_handled_failure() {
		$this->stub_elementor( new WP_Error( 'invalid_template_type', 'Invalid template type.' ) );

		$response = $this->rest_api->run_front_page_migration( $this->build_request() );

		$this->assertInstanceOf( 'WP_REST_Response', $response );
		$this->assertEquals( 200, $response->get_status() );
		$this->assertFalse( $response->get_data()['success'] );
		$this->assertEquals( 'ti__ob_zelle_err_4', $response->get_data()['data'] );
		$this->assertFalse( get_theme_mod( 'zelle_frontpage_was_imported', false ) );
	}

	/**
	 * An empty import result keeps its existing error code.
	 *
	 * @covers \TIOB\Importers\Zelle_Importer::import_zelle_frontpage
	 */
	public function test_empty_import_result_returns_error_code() {
		$this->stub_elementor( array() );

		$response = $this->rest_api->run_front_page_migration( $this->build_request() );

		$this->assertFalse( $response->get_data()['success'] );
		$this->assertEquals( 'ti__ob_zelle_err_4', $response->get_data()['data'] );
	}

	/**
	 * An array of the wrong shape is a handled failure too, not a fatal.
	 *
	 * @covers \TIOB\Importers\Zelle_Importer::import_zelle_frontpage
	 */
	public function test_import_result_without_template_id_returns_error_code() {
		$this->stub_elementor( array( array( 'source' => 'local' ) ) );

		$response = $this->rest_api->run_front_page_migration( $this->build_request() );

		$this->assertFalse( $response->get_data()['success'] );
		$this->assertEquals( 'ti__ob_zelle_err_4', $response->get_data()['data'] );
	}

	/**
	 * An unreadable template file is reported before its content is dereferenced.
	 *
	 * @covers \TIOB\Importers\Zelle_Importer::import_zelle_frontpage
	 */
	public function test_unreadable_template_returns_error_code() {
		$response = $this->rest_api->run_front_page_migration( $this->build_request( get_temp_dir() . 'tiob-zelle-511-missing.json' ) );

		$this->assertFalse( $response->get_data()['success'] );
		$this->assertEquals( 'ti__ob_zelle_err_3', $response->get_data()['data'] );
	}

	/**
	 * A template file without a content key is reported rather than warning.
	 *
	 * @covers \TIOB\Importers\Zelle_Importer::import_zelle_frontpage
	 */
	public function test_template_without_content_returns_error_code() {
		file_put_contents( $this->template_path, wp_json_encode( array( 'title' => 'Zelle Frontpage' ) ) );

		$response = $this->rest_api->run_front_page_migration( $this->build_request() );

		$this->assertFalse( $response->get_data()['success'] );
		$this->assertEquals( 'ti__ob_zelle_err_3', $response->get_data()['data'] );
	}

	/**
	 * A well formed import still creates the front page.
	 *
	 * @covers \TIOB\Importers\Zelle_Importer::import_zelle_frontpage
	 */
	public function test_successful_import_sets_front_page() {
		$template_id = self::factory()->post->create(
			array(
				'post_type'    => 'elementor_library',
				'post_status'  => 'publish',
				'post_title'   => 'Zelle Frontpage',
				'post_content' => '',
			)
		);

		$this->stub_elementor( array( array( 'template_id' => $template_id ) ) );

		$response = $this->rest_api->run_front_page_migration( $this->build_request() );

		$this->assertTrue( $response->get_data()['success'] );

		$page_id = $response->get_data()['data'];
		$this->assertGreaterThan( 0, $page_id );
		$this->assertEquals( 'page', get_post_type( $page_id ) );
		$this->assertEquals( $page_id, get_option( 'page_on_front' ) );
		$this->assertEquals( 'page', get_option( 'show_on_front' ) );
		$this->assertEquals( 'yes', get_theme_mod( 'zelle_frontpage_was_imported' ) );
		$this->assertEquals( 'yes', get_theme_mod( 'ti_content_imported' ) );
	}

	/**
	 * The temporary zelle.json is removed on the failure path, not just on success.
	 *
	 * @covers \TIOB\Importers\Zelle_Importer::import_zelle_frontpage
	 */
	public function test_temporary_file_is_cleaned_up_on_failure() {
		$this->stub_elementor( new WP_Error( 'file_error', 'Invalid File' ) );

		$this->rest_api->run_front_page_migration( $this->build_request() );

		$uploads = wp_upload_dir();
		$this->assertFileDoesNotExist( $uploads['basedir'] . '/zelle.json' );
	}
}
