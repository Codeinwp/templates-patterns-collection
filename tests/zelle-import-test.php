<?php
/**
 * Zelle front page migration tests.
 *
 * @package templates-patterns-collection
 */

use TIOB\Importers\Zelle_Importer;
use TIOB\Rest_Server;

require_once dirname( __FILE__ ) . '/../includes/Importers/Zelle_Importer.php';

/**
 * Stands in for Elementor's local template source.
 *
 * Elementor is not loaded when this suite starts, and a test that runs later
 * activates the real one, so the importer's Elementor dependency is replaced
 * wholesale rather than stubbed into the \Elementor namespace.
 */
class Zelle_Fake_Elementor_Source {
	/**
	 * Value import_template() hands back.
	 *
	 * @var mixed
	 */
	public $result = array();

	/**
	 * Import local template.
	 *
	 * @param string $name File name.
	 * @param string $path File path.
	 *
	 * @return \WP_Error|array
	 */
	public function import_template( $name, $path ) {
		return $this->result;
	}
}

/**
 * Zelle importer with a controllable Elementor source.
 */
class Testable_Zelle_Importer extends Zelle_Importer {
	/**
	 * @var Zelle_Fake_Elementor_Source
	 */
	public $source;

	protected function get_elementor_source() {
		return $this->source;
	}
}

/**
 * Test the Zelle front page migration.
 */
class Zelle_Import_Test extends WP_UnitTestCase {
	/**
	 * @var string
	 */
	private $template_path;

	public function set_up() {
		parent::set_up();

		// insert_page() queries this post type; it belongs to Elementor, which is not active here.
		register_post_type( 'elementor_library', array( 'public' => false ) );

		set_theme_mod( 'ti_prev_theme', 'zelle' );
		update_option( 'theme_mods_zelle', $this->get_theme_mods() );

		$this->template_path = get_temp_dir() . 'tiob-zelle-511.json';
		$this->write_template( $this->get_template_data() );
	}

	public function tear_down() {
		if ( file_exists( $this->template_path ) ) {
			unlink( $this->template_path );
		}

		$uploads = wp_upload_dir();
		if ( file_exists( $uploads['basedir'] . '/zelle.json' ) ) {
			unlink( $uploads['basedir'] . '/zelle.json' );
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
	 * Run the migration with a controlled Elementor result.
	 *
	 * @param mixed $import_result What Elementor hands back.
	 *
	 * @return bool|int|WP_Error
	 */
	private function migrate( $import_result = array() ) {
		$importer                 = new Testable_Zelle_Importer();
		$importer->source         = new Zelle_Fake_Elementor_Source();
		$importer->source->result = $import_result;

		return $importer->import_zelle_frontpage( $this->template_path, 'zelle' );
	}

	/**
	 * @param mixed $data Template payload.
	 */
	private function write_template( $data ) {
		file_put_contents( $this->template_path, wp_json_encode( $data ) );
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
		$content = array_fill( 0, Zelle_Importer::SECTION_COUNT, self::section() );

		$content[6]['elements'][] = self::section()['elements'][0];

		return array(
			'title'   => 'Zelle Frontpage',
			'type'    => 'not-supported',
			'content' => $content,
		);
	}

	/**
	 * One section shaped the way migration/zelle/zelle.json shapes every section.
	 *
	 * @return array
	 */
	private static function section() {
		return array(
			'settings' => array(),
			'elements' => array(
				array(
					'elements' => array(
						array( 'settings' => array() ),
						array( 'settings' => array() ),
					),
				),
			),
		);
	}

	/**
	 * A WP_Error from Elementor must come back as a handled failure, not a fatal.
	 *
	 * @covers \TIOB\Importers\Zelle_Importer::import_zelle_frontpage
	 */
	public function test_elementor_import_error_returns_handled_failure() {
		$result = $this->migrate( new WP_Error( 'invalid_template_type', 'Invalid template type.' ) );

		$this->assertInstanceOf( 'WP_Error', $result );
		$this->assertEquals( 'ti__ob_zelle_err_4', $result->get_error_code() );
		$this->assertEquals( 'Invalid template type.', $result->get_error_message() );
		$this->assertFalse( get_theme_mod( 'zelle_frontpage_was_imported', false ) );
	}

	/**
	 * An empty import result keeps its existing error code.
	 *
	 * @covers \TIOB\Importers\Zelle_Importer::import_zelle_frontpage
	 */
	public function test_empty_import_result_returns_error_code() {
		$result = $this->migrate( array() );

		$this->assertInstanceOf( 'WP_Error', $result );
		$this->assertEquals( 'ti__ob_zelle_err_4', $result->get_error_code() );
	}

	/**
	 * An array of the wrong shape is a handled failure too, not a fatal.
	 *
	 * @covers \TIOB\Importers\Zelle_Importer::import_zelle_frontpage
	 */
	public function test_import_result_without_template_id_returns_error_code() {
		$result = $this->migrate( array( array( 'source' => 'local' ) ) );

		$this->assertInstanceOf( 'WP_Error', $result );
		$this->assertEquals( 'ti__ob_zelle_err_4', $result->get_error_code() );
	}

	/**
	 * The temporary zelle.json is removed on the failure path, not just on success.
	 *
	 * @covers \TIOB\Importers\Zelle_Importer::import_zelle_frontpage
	 */
	public function test_temporary_file_is_cleaned_up_on_failure() {
		$this->migrate( new WP_Error( 'file_error', 'Invalid File' ) );

		$uploads = wp_upload_dir();
		$this->assertFileDoesNotExist( $uploads['basedir'] . '/zelle.json' );
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

		$page_id = $this->migrate( array( array( 'template_id' => $template_id ) ) );

		$this->assertIsInt( $page_id );
		$this->assertGreaterThan( 0, $page_id );
		$this->assertEquals( 'page', get_post_type( $page_id ) );
		$this->assertEquals( $page_id, get_option( 'page_on_front' ) );
		$this->assertEquals( 'page', get_option( 'show_on_front' ) );
		$this->assertEquals( 'yes', get_theme_mod( 'zelle_frontpage_was_imported' ) );
		$this->assertEquals( 'yes', get_theme_mod( 'ti_content_imported' ) );
	}

	/**
	 * Template payloads the mapping methods cannot index are reported, not dereferenced.
	 *
	 * @dataProvider unmappable_template_provider
	 * @covers \TIOB\Importers\Zelle_Importer::import_zelle_frontpage
	 *
	 * @param mixed $data Template payload.
	 */
	public function test_unmappable_template_returns_error_code( $data ) {
		$this->write_template( $data );

		$result = $this->migrate( array( array( 'template_id' => 1 ) ) );

		$this->assertInstanceOf( 'WP_Error', $result );
		$this->assertEquals( 'ti__ob_zelle_err_3', $result->get_error_code() );
	}

	/**
	 * @return array
	 */
	public function unmappable_template_provider() {
		$flat    = array_fill( 0, Zelle_Importer::SECTION_COUNT, array() );
		$shallow = array_fill(
			0,
			Zelle_Importer::SECTION_COUNT,
			array(
				'settings' => array(),
				'elements' => array(),
			)
		);

		$ribbon_only            = $shallow;
		$ribbon_only[2]         = self::section();
		$ribbon_only[6]         = self::section();
		$missing_one            = array_fill( 0, Zelle_Importer::SECTION_COUNT, self::section() );
		$missing_one[4]         = array( 'settings' => array() );
		$short                  = array_fill( 0, Zelle_Importer::SECTION_COUNT - 1, self::section() );

		return array(
			'no content key'           => array( array( 'title' => 'Zelle Frontpage' ) ),
			'content is not an array'  => array( array( 'content' => 'nope' ) ),
			'content is empty'         => array( array( 'content' => array() ) ),
			'sections are empty'       => array( array( 'content' => $flat ) ),
			'sections lack nesting'    => array( array( 'content' => $shallow ) ),
			'only ribbon sections set' => array( array( 'content' => $ribbon_only ) ),
			'one section lacks nesting' => array( array( 'content' => $missing_one ) ),
			'too few sections'         => array( array( 'content' => $short ) ),
			'section is not an array'  => array( array( 'content' => array_fill( 0, Zelle_Importer::SECTION_COUNT, 'nope' ) ) ),
		);
	}

	/**
	 * An unreadable template file is reported before its content is dereferenced.
	 *
	 * @covers \TIOB\Importers\Zelle_Importer::import_zelle_frontpage
	 */
	public function test_unreadable_template_returns_error_code() {
		$importer         = new Testable_Zelle_Importer();
		$importer->source = new Zelle_Fake_Elementor_Source();

		$result = $importer->import_zelle_frontpage( get_temp_dir() . 'tiob-zelle-511-missing.json', 'zelle' );

		$this->assertInstanceOf( 'WP_Error', $result );
		$this->assertEquals( 'ti__ob_zelle_err_3', $result->get_error_code() );
	}

	/**
	 * The REST layer turns the importer's failure into a handled response.
	 *
	 * @covers \TIOB\Rest_Server::run_front_page_migration
	 */
	public function test_rest_endpoint_reports_failure_without_fatal() {
		$this->write_template( array( 'title' => 'Zelle Frontpage' ) );

		$request = new WP_REST_Request();
		$request->set_header( 'content-type', 'application/json' );
		$request->set_method( 'POST' );
		$request->set_body(
			wp_json_encode(
				array(
					'template'      => $this->template_path,
					'template_name' => 'Zelle Frontpage',
				)
			)
		);

		$rest_api = new Rest_Server();
		$response = $rest_api->run_front_page_migration( $request );

		$this->assertInstanceOf( 'WP_REST_Response', $response );
		$this->assertEquals( 200, $response->get_status() );
		$this->assertFalse( $response->get_data()['success'] );
		$this->assertEquals( 'ti__ob_zelle_err_3', $response->get_data()['data'] );
	}
}
