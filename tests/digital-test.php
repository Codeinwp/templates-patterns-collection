<?php
/**
 * Digital Store Test.
 *
 * @package templates-patterns-collection
 */

use TIOB\Importers\Widgets_Importer;
use TIOB\Main;
use TIOB\Rest_Server;

/**
 * Mock Class WooCommerce to pass class check for individual tests
 */
class WooCommerce {}

/**
 * Test Digital Store import.
 */
class Digital_Rest_Test extends WP_UnitTestCase {
	public static $admin_id;

	/**
	 * @var Rest_Server
	 */
	private $rest_api;

	/**
	 * @var string
	 */
	private $json;

	/**
	 * @var Widgets_Importer
	 */
	private $widget_importer;

	/**
	 * @param $factory
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		self::$admin_id = $factory->user->create( array( 'role' => 'administrator' ) );
	}

	/**
	 * setUp
	 */
	public function setUp() {
		parent::setUp();
		wp_set_current_user( self::$admin_id );
		add_theme_support(
			'themeisle-demo-import',
			array(
				'editors' => array(
					'gutenberg',
				),
				'local'   => array(
					'elementor' => array(
						'neve-main' => array(
							'url'   => 'https://demo.themeisle.com/neve',
							'title' => 'Neve 2018',
						),
					),
				),
				'i18n'    => array(
					'templates_title'       => __( 'Ready to use pre-built websites with 1-click installation', 'templates-patterns-collection' ),
					'templates_description' => __( 'With Neve, you can choose from multiple unique demos, specially designed for you, that can be installed with a single click. You just need to choose your favorite, and we will take care of everything else.', 'templates-patterns-collection' ),
				),
			)
		);

		Main::instance();

		$this->json     = json_decode( file_get_contents( dirname( __FILE__ ) . '/fixtures/digital_store/data.json' ), true );
		$this->rest_api = new Rest_Server();
		$this->rest_api->init();

		require_once dirname( __FILE__ ) . '/../includes/Importers/Widgets_Importer.php';
		$this->widget_importer = new Widgets_Importer();
		add_filter( 'async_update_translation', '__return_false' );
	}

	//  /**
	//   * Test all theme_mods import form the json data.
	//   *
	//   * @covers \TIOB\Importers\Theme_Mods_Importer::import_theme_mods
	//   */
	//  public function test_theme_mods_importing() {
	//
	//      $request = new WP_REST_Request();
	//
	//      $request->set_header( 'content-type', 'application/json' );
	//      $request->set_method( 'POST' );
	//      $request->set_body(
	//          json_encode(
	//              array(
	//                  'theme_mods' => $this->json['theme_mods'],
	//                  'source_url' => 'https://demo.themeisle.com/digital-store-gb',
	//              )
	//          )
	//      );
	//
	//      $response = $this->rest_api->run_theme_mods_importer( $request );
	//
	//      $this->assertInstanceOf( 'WP_REST_Response', $response );
	//      $this->assertEquals( 200, $response->get_status() );
	//      $this->assertTrue( $response->get_data()['success'] );
	//      //Test that ALL theme mods have been successfully imported.
	//      foreach ( $this->json['theme_mods'] as $key => $value ) {
	//          $this->assertEquals( $value, get_theme_mod( $key ) );
	//      }
	//  }
	//
	//  /**
	//   * Test all plugin imports from the JSON data.
	//   *
	//   * @covers \TIOB\Importers\Plugin_Importer::install_plugins
	//   */
	//  public function test_plugin_importing() {
	//      $request = new WP_REST_Request();
	//
	//      $request->set_header( 'content-type', 'application/json' );
	//      $request->set_method( 'POST' );
	//      $plugins_to_install = array_merge( $this->json['mandatory_plugins'], $this->json['recommended_plugins'] );
	//      $plugins_to_install = array_map(
	//          function( $val ) {
	//              return true;
	//          },
	//          $plugins_to_install
	//      );
	//      $request->set_body(
	//          json_encode(
	//              $plugins_to_install
	//          )
	//      );
	//
	//      $response = $this->rest_api->run_plugin_importer( $request );
	//
	//      $this->assertInstanceOf( 'WP_REST_Response', $response );
	//      $this->assertEquals( 200, $response->get_status() );
	//      $this->assertTrue( $response->get_data()['success'] );
	//      //Test that ALL plugins have been installed and activated.
	//      $plugin_list = get_plugins();
	//      foreach ( $plugins_to_install as $plugin_slug => $value ) {
	//          foreach ( $plugin_list as $key => $data ) {
	//              if ( isset( $data['Name'] ) && sanitize_title( $data['Name'] ) === $plugin_slug ) {
	//                  $this->assertTrue( is_plugin_active( $key ) );
	//              }
	//          }
	//      }
	//      // Test that the amount of plugins to install is contained inside the installed plugins.
	//      $this->assertTrue( count( $plugins_to_install ) <= count( $plugin_list ) );
	//  }


	/**
	 * Test the Content Import form the store.xml
	 *
	 * @covers \TIOB\Importers\Content_Importer::import_remote_xml
	 */
	public function test_content_import() {
		$request = new WP_REST_Request();

		$request->set_header( 'content-type', 'application/json' );
		$request->set_method( 'POST' );
		$content_import = array(
			'demoSlug'    => 'neve-digital-store-gutenberg',
			'editor'      => 'gutenberg',
			'source'      => 'local',
			'contentFile' => dirname( __FILE__ ) . '/fixtures/digital_store/export.xml',
			'frontPage'   => $this->json['front_page'],
			'shopPages'   => $this->json['shop_pages'],
		);
		$request->set_body( json_encode( $content_import ) );

		$response = $this->rest_api->run_xml_importer( $request );
		$this->assertInstanceOf( 'WP_REST_Response', $response );
		$this->assertEquals( 200, $response->get_status() );
		$this->assertTrue( $response->get_data()['success'] );

		//Test that there are NO placeholders left unprocessed
		$placeholders_list = array( 'replace_cat' ); // add more if other placeholders are added
		foreach ( array( 'page', 'product', 'wp_block' ) as $post_type ) {
			$posts = get_posts( array( 'post_type' => $post_type ) );
			foreach ( $posts as $post ) {
				foreach ( $placeholders_list as $search ) {
					$this->assertFalse( strpos( $post->post_content, $search ) );
				}
			}
		}


		//Test that front page has been set up.
		$this->assertEquals( 'page', get_option( 'show_on_front' ) );
		//Test that front page WP_Post object exists and is set as front page.
		$front_page_id = get_option( 'page_on_front' );
		$front_page    = get_post( $front_page_id );
		$this->assertInstanceOf( 'WP_Post', $front_page );
		$this->assertNotEmpty( $front_page->ID );

		//Test that blog page WP_Post object exists and is set as page for posts.
		$blog_page_id = get_option( 'page_for_posts' );
		$blog_page    = get_post( $blog_page_id );
		$this->assertInstanceOf( 'WP_Post', $blog_page );
		$this->assertNotEmpty( $blog_page->ID );

		//Test that shop pages have been imported and set correctly
		foreach ( $this->json['shop_pages'] as $option_id => $slug ) {
			if ( ! empty( $slug ) ) {
				$shop_page_id = get_option( $option_id );
				$shop_page    = get_post( $shop_page_id );
				$this->assertInstanceOf( 'WP_Post', $shop_page );
				$this->assertNotEmpty( $shop_page->ID );
			}
		}
	}


	/**
	 * @covers \TIOB\Importers\Widgets_Importer::import_widgets
	 */
	public function test_widgets_import() {
		$this->remove_all_widgets();

		$request = new WP_REST_Request();
		$request->set_header( 'content-type', 'application/json' );
		$request->set_method( 'POST' );
		$request->set_body(
			json_encode(
				$this->json['widgets']
			)
		);

		$response = $this->rest_api->run_widgets_importer( $request );
		$this->assertEquals( 200, $response->get_status() );
		$this->assertTrue( $response->get_data()['success'] );
		$this->assertInstanceOf( 'WP_REST_Response', $response );

		$available_widgets = $this->widget_importer->available_widgets();
		$widget_instances  = array();
		foreach ( $available_widgets as $widget_data ) {
			$instances = get_option( 'widget_' . $widget_data['id_base'] );
			if ( ! empty( $instances ) ) {
				foreach ( $instances as $instance_id => $instance_data ) {
					if ( is_numeric( $instance_id ) ) {
						$unique_instance_id                      = $widget_data['id_base'] . '-' . $instance_id;
						$widget_instances[ $unique_instance_id ] = $instance_data;
					}
				}
			}
		}

		$accepted_titles = array();
		foreach ( $this->json['widgets'] as $widget_location ) {
			foreach ( $widget_location as $widget ) {
				if ( ! empty( $widget['title'] ) ) {
					array_push( $accepted_titles, $widget['title'] );
				}
			}
		}

		foreach ( $widget_instances as $widget_instance ) {
			$this->assertTrue( isset( $widget_instance['title'] ) );
			$this->assertTrue( in_array( $widget_instance['title'], $accepted_titles ) || $widget_instance['title'] === '' );
		}
	}

	/**
	 * Empty site widgets.
	 */
	private function remove_all_widgets() {
		$available_widgets = $this->widget_importer->available_widgets();
		foreach ( $available_widgets as $widget_data ) {
			delete_option( 'widget_' . $widget_data['id_base'] );
		}
	}
}
