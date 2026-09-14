<?php
/**
 * Tests for the Google font stylesheet chunking on the onboarding screen.
 *
 * @package templates-patterns-collection
 */

use TIOB\Admin;
use TIOB\License;

// Minimal Neve stubs, so `get_font_parings()` takes the branch that applies
// `neve_font_pairings`. The fixture guards each class: the names are global.
require_once __DIR__ . '/fixtures/neve-typography-stub.php';

/**
 * Class Google_Fonts_Chunking_Test
 */
class Google_Fonts_Chunking_Test extends WP_UnitTestCase {

	/**
	 * Screen id that makes Admin::enqueue() take the onboarding branch.
	 */
	const ONBOARDING_SCREEN = 'appearance_page_neve-onboarding';

	/**
	 * Handles enqueued by a run, so tear_down can undo them.
	 *
	 * @var array
	 */
	private $enqueued_handles = array();

	/**
	 * Build artifact this test had to create, removed in tear_down.
	 *
	 * @var string
	 */
	private $created_asset_file = '';

	/**
	 * Build directory this test had to create, removed in tear_down.
	 *
	 * @var string
	 */
	private $created_asset_dir = '';

	public function set_up(): void {
		parent::set_up();

		// Admin::get_localization() dereferences the license object unconditionally.
		update_option( License::LICENSE_DATA_OPTIONS_KEY, (object) array( 'key' => 'test-key' ) );

		$this->ensure_onboarding_build_asset();
	}

	/**
	 * Admin::enqueue() includes the onboarding asset manifest, which is a build
	 * artifact: gitignored, and not built by the phpunit CI job. Stand one in.
	 */
	private function ensure_onboarding_build_asset() {
		$path = TIOB_PATH . 'onboarding/build/index.asset.php';

		if ( file_exists( $path ) ) {
			return;
		}

		$dir = dirname( $path );
		if ( ! is_dir( $dir ) ) {
			wp_mkdir_p( $dir );
			$this->created_asset_dir = $dir;
		}

		file_put_contents( $path, "<?php\n\nreturn array( 'dependencies' => array(), 'version' => 'test' );\n" );
		$this->created_asset_file = $path;
	}

	public function tear_down(): void {
		delete_option( License::LICENSE_DATA_OPTIONS_KEY );

		foreach ( $this->enqueued_handles as $handle ) {
			wp_dequeue_style( $handle );
			wp_deregister_style( $handle );
		}
		$this->enqueued_handles = array();

		unset( $GLOBALS['current_screen'] );

		if ( '' !== $this->created_asset_file ) {
			unlink( $this->created_asset_file );
			$this->created_asset_file = '';
		}

		if ( '' !== $this->created_asset_dir ) {
			rmdir( $this->created_asset_dir );
			$this->created_asset_dir = '';
		}

		parent::tear_down();
	}

	/**
	 * Build a Google font pair in the shape Neve supplies.
	 *
	 * @param string $heading Heading font family.
	 * @param string $body    Body font family.
	 * @param string $source  Font source, non-Google sources are not collected.
	 *
	 * @return array
	 */
	private function font_pair( $heading, $body, $source = 'Google' ) {
		return array(
			'headingFont' => array(
				'font'        => $heading,
				'fontSource'  => $source,
				'previewSize' => '25px',
			),
			'bodyFont'    => array(
				'font'        => $body,
				'fontSource'  => $source,
				'previewSize' => '17px',
			),
		);
	}

	/**
	 * Drive the real path: filter the Neve pairs, initialize, then enqueue.
	 *
	 * @param array $font_pairs Pairs the `neve_font_pairings` filter returns.
	 *
	 * @return array The enqueued `tiob-google-fonts-*` handles, in order.
	 */
	private function enqueue_with_font_pairs( $font_pairs ) {
		add_filter(
			'neve_font_pairings',
			function () use ( $font_pairs ) {
				return $font_pairs;
			}
		);

		$admin = new Admin();
		$admin->init();

		set_current_screen( self::ONBOARDING_SCREEN );
		$admin->enqueue();

		$handles = array();
		foreach ( wp_styles()->queue as $handle ) {
			if ( strpos( $handle, 'tiob-google-fonts-' ) === 0 ) {
				$handles[]                = $handle;
				$this->enqueued_handles[] = $handle;
			}
		}

		return $handles;
	}

	/**
	 * Every font family across the given handles, in enqueue order.
	 *
	 * @param array $handles Enqueued style handles.
	 *
	 * @return array
	 */
	private function fonts_from_handles( $handles ) {
		$fonts = array();

		foreach ( $handles as $handle ) {
			$args = array();
			wp_parse_str( wp_parse_url( wp_styles()->registered[ $handle ]->src, PHP_URL_QUERY ), $args );
			$fonts = array_merge( $fonts, explode( '|', $args['family'] ) );
		}

		return $fonts;
	}

	/**
	 * Pair sets yielding 1-4 unique Google fonts, too few for a chunk length of 1.
	 *
	 * @return array
	 */
	public function small_collection_provider() {
		return array(
			// One pair reusing the same family on both slots collapses to a single font.
			'one font'    => array(
				array( array( 'Albert Sans', 'Albert Sans' ) ),
				array( 'Albert Sans' ),
			),
			'two fonts'   => array(
				array( array( 'Prata', 'Hanken Grotesk' ) ),
				array( 'Hanken Grotesk', 'Prata' ),
			),
			// The shared body font is collected once.
			'three fonts' => array(
				array( array( 'Prata', 'Hanken Grotesk' ), array( 'Lora', 'Hanken Grotesk' ) ),
				array( 'Hanken Grotesk', 'Lora', 'Prata' ),
			),
			'four fonts'  => array(
				array( array( 'Prata', 'Hanken Grotesk' ), array( 'Lora', 'Ubuntu' ) ),
				array( 'Hanken Grotesk', 'Lora', 'Prata', 'Ubuntu' ),
			),
		);
	}

	/**
	 * A collection of 1-4 fonts must not crash and must enqueue every font.
	 *
	 * @dataProvider small_collection_provider
	 *
	 * @param array $pairs          Heading/body family tuples for the filter.
	 * @param array $expected_fonts Unique families expected on the screen.
	 */
	public function test_small_font_collection_does_not_crash( $pairs, $expected_fonts ) {
		$font_pairs = array();
		foreach ( $pairs as $pair ) {
			$font_pairs[] = $this->font_pair( $pair[0], $pair[1] );
		}

		$handles = $this->enqueue_with_font_pairs( $font_pairs );

		$this->assertCount( count( $expected_fonts ), $handles );

		$fonts = $this->fonts_from_handles( $handles );
		sort( $fonts );

		$this->assertSame( $expected_fonts, $fonts );
	}

	/**
	 * Collections of 5 or more keep the original chunking, unchanged by the fix.
	 */
	public function test_large_font_collection_chunking_is_unchanged() {
		// Prata/Hanken Grotesk is kept past the 5-pair cap, so all six pairs count.
		$font_pairs = array(
			$this->font_pair( 'Roboto', 'Lora' ),
			$this->font_pair( 'Playfair Display', 'Source Sans Pro' ),
			$this->font_pair( 'Montserrat', 'Open Sans' ),
			$this->font_pair( 'Oswald', 'Merriweather' ),
			$this->font_pair( 'Raleway', 'PT Serif' ),
			$this->font_pair( 'Prata', 'Hanken Grotesk' ),
		);

		$handles = $this->enqueue_with_font_pairs( $font_pairs );

		// 12 fonts / 5 rounds down to a chunk length of 2, so 6 stylesheets.
		$this->assertCount( 6, $handles );
		$this->assertCount( 12, $this->fonts_from_handles( $handles ) );

		// Body font is collected before the heading font of the same pair.
		$this->assertSame( array( 'Lora', 'Roboto' ), $this->fonts_from_handles( array( $handles[0] ) ) );
	}

	/**
	 * Pairs from a non-Google source collect no fonts and enqueue nothing.
	 */
	public function test_non_google_font_pairs_enqueue_nothing() {
		$font_pairs = array( $this->font_pair( 'Arial', 'Georgia', 'Local' ) );

		$this->assertSame( array(), $this->enqueue_with_font_pairs( $font_pairs ) );
	}
}
