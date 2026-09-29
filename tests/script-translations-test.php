<?php
/**
 * Test builder script translations.
 *
 * @package templates-patterns-collection
 */

use TIOB\Admin;
use TIOB\Editor;
use TIOB\Elementor;

/**
 * Builder bundles must be linked to the plugin text domain.
 */
class Script_Translations_Test extends \WP_UnitTestCase {
	/**
	 * Asset stubs created by this test, removed in teardown.
	 *
	 * @var list<string>
	 */
	private array $created_files = array();

	/**
	 * Build dirs created by this test, removed in teardown.
	 *
	 * @var list<string>
	 */
	private array $created_dirs = array();

	public function set_up(): void {
		parent::set_up();
		// CI does not build the JS bundles.
		$this->maybe_stub_asset( 'editor' );
		$this->maybe_stub_asset( 'elementor' );
	}

	public function tear_down(): void {
		wp_deregister_script( 'ti-tpc-block' );
		wp_deregister_script( 'ti-tpc-elementor' );
		wp_deregister_style( 'ti-tpc-block' );
		unregister_block_type( 'ti-tpc/templates-cloud' );
		set_current_screen( 'front' );

		foreach ( $this->created_files as $file ) {
			unlink( $file );
		}
		foreach ( array_reverse( $this->created_dirs ) as $dir ) {
			rmdir( $dir );
		}
		parent::tear_down();
	}

	/**
	 * Gutenberg bundle loads its translations.
	 *
	 * @return void
	 */
	public function test_editor_script_has_text_domain(): void {
		if ( ! defined( 'TPC_TEMPLATES_CLOUD_ENDPOINT' ) ) {
			define( 'TPC_TEMPLATES_CLOUD_ENDPOINT', Admin::get_templates_cloud_endpoint() );
		}
		if ( WP_Block_Type_Registry::get_instance()->is_registered( 'ti-tpc/templates-cloud' ) ) {
			unregister_block_type( 'ti-tpc/templates-cloud' );
		}
		wp_deregister_script( 'ti-tpc-block' );
		set_current_screen( 'post' );

		( new Editor() )->register_block();

		$this->assertSame( 'templates-patterns-collection', wp_scripts()->registered['ti-tpc-block']->textdomain );
	}

	/**
	 * Elementor bundle loads its translations.
	 *
	 * @return void
	 */
	public function test_elementor_script_has_text_domain(): void {
		wp_deregister_script( 'ti-tpc-elementor' );

		( new Elementor() )->register_script();

		$this->assertSame( 'templates-patterns-collection', wp_scripts()->registered['ti-tpc-elementor']->textdomain );
	}

	/**
	 * Create a minimal build asset file when the bundle is not built.
	 *
	 * @param string $bundle Bundle directory.
	 *
	 * @return void
	 */
	private function maybe_stub_asset( string $bundle ): void {
		$dir  = TIOB_PATH . $bundle . '/build';
		$file = $dir . '/index.asset.php';
		if ( file_exists( $file ) ) {
			return;
		}
		if ( ! is_dir( $dir ) ) {
			mkdir( $dir );
			$this->created_dirs[] = $dir;
		}
		file_put_contents( $file, "<?php return array( 'dependencies' => array(), 'version' => 'test' );" );
		$this->created_files[] = $file;
	}
}
