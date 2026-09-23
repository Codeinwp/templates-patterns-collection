<?php
/**
 * Starter-site import regression tests for Elementor `_elementor_data` meta.
 *
 * @package templates-patterns-collection
 */

use TIOB\Importers\WP\WP_Import;

/**
 * Class Elementor_Meta_Import_Test
 */
class Elementor_Meta_Import_Test extends WP_UnitTestCase {

	const FIXTURE = __DIR__ . '/fixtures/elementor_menu/export.xml';

	public function setUp(): void {
		parent::setUp();
		if ( ! class_exists( 'WP_Importer' ) ) {
			require_once ABSPATH . 'wp-admin/includes/class-wp-importer.php';
		}
	}

	public function tearDown(): void {
		unregister_meta_key( 'post', '_elementor_data', 'page' );
		parent::tearDown();
	}

	/**
	 * Elementor >= 4.2.1 registers `_elementor_data` per post type with a sanitize callback.
	 * Core then routes sanitization through the subtype filter only.
	 */
	private function register_elementor_subtype_sanitizer() {
		register_meta(
			'post',
			'_elementor_data',
			array(
				'object_subtype'    => 'page',
				'type'              => 'string',
				'single'            => true,
				'sanitize_callback' => function ( $value ) {
					return $value;
				},
			)
		);
	}

	private function run_import() {
		$importer = new WP_Import( 'elementor' );
		$importer->import( self::FIXTURE );
	}

	private function get_home_elementor_data() {
		$pages = get_posts(
			array(
				'post_type'   => 'page',
				'title'       => 'Home',
				'numberposts' => 1,
			)
		);
		$this->assertCount( 1, $pages );

		return get_post_meta( $pages[0]->ID, '_elementor_data', true );
	}

	public function test_elementor_data_stays_valid_json_when_elementor_registers_a_subtype_sanitizer() {
		$this->register_elementor_subtype_sanitizer();

		$this->run_import();

		$data = json_decode( $this->get_home_elementor_data(), true );
		$this->assertSame( 'Say "hello" to our team', $data[0]['elements'][0]['settings']['title'] );
	}

	public function test_elementor_link_urls_are_rewritten_to_the_destination_site_when_elementor_registers_a_subtype_sanitizer() {
		$this->register_elementor_subtype_sanitizer();

		$this->run_import();

		$data = json_decode( $this->get_home_elementor_data(), true );
		$this->assertSame( 'http://example.org/about/', $data[0]['elements'][0]['settings']['link']['url'] );
	}

	public function test_elementor_image_urls_are_rewritten_to_the_destination_uploads_dir() {
		$this->run_import();

		$data = json_decode( $this->get_home_elementor_data(), true );
		$this->assertSame( 'http://example.org/wp-content/uploads/2024/05/hero.jpg', $data[0]['settings']['background_image']['url'] );
	}
}
