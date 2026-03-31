<?php
/**
 * Slug mapping and import rewrite tests.
 *
 * @package templates-patterns-collection
 */

use TIOB\Importers\Content_Importer;
use TIOB\Importers\Cleanup\Manager;
use TIOB\Importers\Helpers\Helper;
use TIOB\Importers\Helpers\Importer_Alterator;
use TIOB\Importers\Helpers\Slug_Mapping;
use TIOB\Importers\Theme_Mods_Importer;
use TIOB\Importers\Widgets_Importer;

/**
 * Class Slug_Mapping_Test
 */
class Slug_Mapping_Test extends WP_UnitTestCase {
	/**
	 * @var int
	 */
	public static $admin_id;

	/**
	 * @param \WP_UnitTest_Factory $factory test factory.
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		self::$admin_id = $factory->user->create( array( 'role' => 'administrator' ) );
	}

	public function setUp(): void {
		parent::setUp();
		wp_set_current_user( self::$admin_id );
		Slug_Mapping::clear();
	}

	public function tearDown(): void {
		Slug_Mapping::clear();
		remove_theme_mod( 'test_link' );
		delete_option( 'test_option_link' );
		parent::tearDown();
	}

	/**
	 * @covers \TIOB\Importers\Helpers\Slug_Mapping::rewrite_value
	 */
	public function test_rewrite_value_rewrites_only_internal_source_urls() {
		Slug_Mapping::set_slug_map(
			array(
				'old-page' => 'new-page',
			)
		);
		Slug_Mapping::register_source_url( 'https://demo.example.com/site' );

		$input  = 'First: https://demo.example.com/site/old-page/?foo=bar Second: https://other.example.com/site/old-page/';
		$output = Slug_Mapping::rewrite_value( $input );

		$expected_internal = trailingslashit( get_home_url() ) . 'new-page/?foo=bar';
		$this->assertStringContainsString( $expected_internal, $output );
		$this->assertStringContainsString( 'https://other.example.com/site/old-page/', $output );
	}

	/**
	 * @covers \TIOB\Importers\Helpers\Slug_Mapping::rewrite_value
	 */
	public function test_rewrite_value_handles_serialized_values() {
		Slug_Mapping::set_slug_map(
			array(
				'old-page' => 'new-page',
			)
		);
		Slug_Mapping::register_source_url( 'https://demo.example.com/site' );

		$input = maybe_serialize(
			array(
				'url' => 'https://demo.example.com/site/old-page/?foo=bar',
			)
		);

		$output   = Slug_Mapping::rewrite_value( $input );
		$decoded  = maybe_unserialize( $output );
		$expected = trailingslashit( get_home_url() ) . 'new-page/?foo=bar';

		$this->assertTrue( is_array( $decoded ) );
		$this->assertSame( $expected, $decoded['url'] );
	}

	/**
	 * @covers \TIOB\Importers\Helpers\Slug_Mapping::rewrite_value
	 */
	public function test_rewrite_value_prefers_most_specific_source_path() {
		$original_home    = get_option( 'home' );
		$original_siteurl = get_option( 'siteurl' );

		update_option( 'home', 'https://network.test/tpc' );
		update_option( 'siteurl', 'https://network.test/tpc' );

		try {
			Slug_Mapping::register_source_url( 'https://demosites.io' );
			Slug_Mapping::register_source_url( 'https://demosites.io/design-eng' );

			$anchor_link  = Slug_Mapping::rewrite_value( 'https://demosites.io/design-eng/#work' );
			$project_link = Slug_Mapping::rewrite_value( 'https://demosites.io/design-eng/projects/' );

			$this->assertSame( 'https://network.test/tpc/#work', $anchor_link );
			$this->assertSame( 'https://network.test/tpc/projects/', $project_link );
		} finally {
			update_option( 'home', $original_home );
			update_option( 'siteurl', $original_siteurl );
		}
	}

	/**
	 * @covers \TIOB\Importers\Helpers\Helper::cleanup_page_slug
	 */
	public function test_cleanup_page_slug_only_hashes_when_slug_is_taken() {
		$helper = new class {
			use Helper;
		};

		$clean_slug = $helper->cleanup_page_slug( 'test-demo-home', 'test-demo', true );
		$this->assertSame( 'home', $clean_slug );

		self::factory()->post->create(
			array(
				'post_type'   => 'page',
				'post_status' => 'publish',
				'post_title'  => 'Existing Home',
				'post_name'   => 'home',
			)
		);

		$hash       = substr( md5( 'test-demo' ), 0, 5 );
		$hashed     = $hash . '-home';
		$hashed_slug = $helper->cleanup_page_slug( 'test-demo-home', 'test-demo', true );
		$this->assertSame( $hashed, $hashed_slug );

		self::factory()->post->create(
			array(
				'post_type'   => 'page',
				'post_status' => 'publish',
				'post_title'  => 'Existing Hashed Home',
				'post_name'   => $hashed,
			)
		);

		$unique_hashed_slug = $helper->cleanup_page_slug( 'test-demo-home', 'test-demo', true );
		$this->assertSame( $hashed . '-2', $unique_hashed_slug );
	}

	/**
	 * @covers \TIOB\Importers\Helpers\Importer_Alterator::drop_slug_and_prefix_pages
	 */
	public function test_drop_slug_and_prefix_pages_persists_slug_map() {
		$alterator = new Importer_Alterator(
			array(
				'demoSlug' => 'test-demo',
			)
		);

		$posts = array(
			array(
				'post_type' => 'page',
				'post_name' => 'test-demo-home',
			),
			array(
				'post_type' => 'page',
				'post_name' => 'home',
			),
			array(
				'post_type' => 'post',
				'post_name' => 'regular-post',
			),
		);

		$processed_posts = $alterator->drop_slug_and_prefix_pages( $posts );
		$hash            = substr( md5( 'test-demo' ), 0, 5 );

		$this->assertSame( 'home', $processed_posts[0]['post_name'] );
		$this->assertSame( $hash . '-home', $processed_posts[1]['post_name'] );
		$this->assertSame( 'regular-post', $processed_posts[2]['post_name'] );

		$slug_map = Slug_Mapping::get_slug_map();
		$this->assertSame( 'home', $slug_map['test-demo-home'] );
		$this->assertSame( $hash . '-home', $slug_map['home'] );
	}

	/**
	 * @covers \TIOB\Importers\Helpers\Importer_Alterator::replace_links
	 */
	public function test_replace_links_rewrites_internal_links_to_mapped_slug() {
		Slug_Mapping::set_slug_map(
			array(
				'old-page' => 'new-page',
			)
		);

		$reflection = new ReflectionClass( Importer_Alterator::class );
		$alterator  = $reflection->newInstanceWithoutConstructor();

		$output   = $alterator->replace_links( 'Visit https://demo.example.com/site/old-page/', 'https://demo.example.com/site' );
		$expected = trailingslashit( get_home_url() ) . 'new-page/';

		$this->assertSame( 'Visit ' . $expected, $output );
	}

	/**
	 * @covers \TIOB\Importers\Content_Importer::setup_front_page
	 */
	public function test_setup_front_page_uses_slug_map_resolution() {
		Slug_Mapping::set_slug_map(
			array(
				'old-front' => 'new-front',
				'old-blog'  => 'new-blog',
			)
		);

		$front_page_id = self::factory()->post->create(
			array(
				'post_type'   => 'page',
				'post_status' => 'publish',
				'post_title'  => 'Front',
				'post_name'   => 'new-front',
			)
		);
		$blog_page_id  = self::factory()->post->create(
			array(
				'post_type'   => 'page',
				'post_status' => 'publish',
				'post_title'  => 'Blog',
				'post_name'   => 'new-blog',
			)
		);

		$importer = new Content_Importer();
		$importer->setup_front_page(
			array(
				'front_page' => 'old-front',
				'blog_page'  => 'old-blog',
			),
			'test-demo'
		);

		$this->assertSame( $front_page_id, (int) get_option( 'page_on_front' ) );
		$this->assertSame( $blog_page_id, (int) get_option( 'page_for_posts' ) );
	}

	/**
	 * @covers \TIOB\Importers\Theme_Mods_Importer::import_theme_mods
	 */
	public function test_theme_mods_import_rewrites_links_with_slug_map() {
		Slug_Mapping::set_slug_map(
			array(
				'old-page' => 'new-page',
			)
		);

		$request = new WP_REST_Request();
		$request->set_header( 'content-type', 'application/json' );
		$request->set_method( 'POST' );
		$request->set_body(
			json_encode(
				array(
					'source_url' => 'https://demo.example.com/site',
					'theme_mods' => array(
						'test_link' => 'https://demo.example.com/site/old-page/',
					),
					'wp_options' => array(
						'test_option_link' => 'https://demo.example.com/site/old-page/',
					),
				)
			)
		);

		$importer = new Theme_Mods_Importer();
		$response = $importer->import_theme_mods( $request );
		$expected = trailingslashit( get_home_url() ) . 'new-page/';

		$this->assertTrue( $response->get_data()['success'] );
		$this->assertSame( $expected, get_theme_mod( 'test_link' ) );
		$this->assertSame( $expected, get_option( 'test_option_link' ) );
	}

	/**
	 * @covers \TIOB\Importers\Content_Importer::import_file
	 */
	public function test_new_content_import_clears_stale_slug_map() {
		Slug_Mapping::set_slug_map(
			array(
				'stale-old' => 'stale-new',
			)
		);

		$importer = new Content_Importer();
		$result   = $importer->import_file( '/tmp/definitely-missing-import.xml' );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( array(), Slug_Mapping::get_slug_map() );
	}

	/**
	 * @covers \TIOB\Importers\Widgets_Importer::import_widgets
	 */
	public function test_widgets_import_accepts_wrapped_payload() {
		$request = new WP_REST_Request();
		$request->set_header( 'content-type', 'application/json' );
		$request->set_method( 'POST' );
		$request->set_body(
			json_encode(
				array(
					'source_url' => 'https://demo.example.com/site',
					'widgets'    => array(),
				)
			)
		);

		$importer = new Widgets_Importer();
		$response = $importer->import_widgets( $request );

		$this->assertTrue( $response->get_data()['success'] );
		$this->assertTrue( in_array( 'https://demo.example.com/site', Slug_Mapping::get_source_urls(), true ) );
	}

	/**
	 * @covers \TIOB\Importers\Widgets_Importer::import_widgets
	 */
	public function test_widgets_import_accepts_legacy_raw_payload() {
		$request = new WP_REST_Request();
		$request->set_header( 'content-type', 'application/json' );
		$request->set_method( 'POST' );
		$request->set_body(
			json_encode(
				array(
					'blog-sidebar' => array(),
				)
			)
		);

		$importer = new Widgets_Importer();
		$response = $importer->import_widgets( $request );

		$this->assertTrue( $response->get_data()['success'] );
	}

	/**
	 * @covers \TIOB\Importers\Cleanup\Manager::do_cleanup
	 */
	public function test_cleanup_clears_slug_mapping_state() {
		Slug_Mapping::set_slug_map(
			array(
				'old-page' => 'new-page',
			)
		);
		Slug_Mapping::register_source_url( 'https://demo.example.com/site' );

		$cleanup = new Manager();
		$cleanup->do_cleanup();

		$this->assertSame( array(), Slug_Mapping::get_slug_map() );
		$this->assertSame( array(), Slug_Mapping::get_source_urls() );
	}
}
