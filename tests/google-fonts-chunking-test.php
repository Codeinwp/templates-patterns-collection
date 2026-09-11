<?php
/**
 * Tests for the Google font stylesheet chunking on the onboarding screen.
 *
 * @package templates-patterns-collection
 */

use TIOB\Admin;
use TIOB\License;

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

	public function set_up(): void {
		parent::set_up();

		// Admin::get_localization() dereferences the license object unconditionally.
		update_option( License::LICENSE_DATA_OPTIONS_KEY, (object) array( 'key' => 'test-key' ) );
	}

	public function tear_down(): void {
		delete_option( License::LICENSE_DATA_OPTIONS_KEY );

		foreach ( $this->enqueued_handles as $handle ) {
			wp_dequeue_style( $handle );
			wp_deregister_style( $handle );
		}
		$this->enqueued_handles = array();

		unset( $GLOBALS['current_screen'] );

		parent::tear_down();
	}

	/**
	 * Run Admin::enqueue() on the onboarding screen with a given font collection.
	 *
	 * @param array $fonts Google font names to chunk.
	 *
	 * @return array The enqueued `tiob-google-fonts-*` handles, in order.
	 */
	private function enqueue_with_fonts( $fonts ) {
		set_current_screen( self::ONBOARDING_SCREEN );

		$admin = new Admin();

		$property = new ReflectionProperty( Admin::class, 'google_fonts' );
		$property->setAccessible( true );
		$property->setValue( $admin, $fonts );

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
	 * Font collections too small for the chunk length to round up to 1.
	 *
	 * @return array
	 */
	public function small_collection_provider() {
		return array(
			'one font'    => array( array( 'Albert Sans' ) ),
			'two fonts'   => array( array( 'Prata', 'Hanken Grotesk' ) ),
			'three fonts' => array( array( 'Prata', 'Hanken Grotesk', 'Lora' ) ),
			'four fonts'  => array( array( 'Prata', 'Hanken Grotesk', 'Lora', 'Ubuntu' ) ),
		);
	}

	/**
	 * A collection of 1-4 fonts must not crash and must enqueue every font.
	 *
	 * @dataProvider small_collection_provider
	 *
	 * @param array $fonts Google font names.
	 */
	public function test_small_font_collection_does_not_crash( $fonts ) {
		$handles = $this->enqueue_with_fonts( $fonts );

		$this->assertCount( count( $fonts ), $handles );

		$enqueued_fonts = array();
		foreach ( $handles as $handle ) {
			$src            = wp_styles()->registered[ $handle ]->src;
			$query          = wp_parse_url( $src, PHP_URL_QUERY );
			$args           = array();
			wp_parse_str( $query, $args );
			$enqueued_fonts = array_merge( $enqueued_fonts, explode( '|', $args['family'] ) );
		}

		$this->assertSame( $fonts, $enqueued_fonts );
	}

	/**
	 * Collections of 5 or more keep the original chunking, unchanged by the fix.
	 */
	public function test_large_font_collection_chunking_is_unchanged() {
		$fonts = array(
			'Roboto',
			'Lora',
			'Playfair Display',
			'Source Sans Pro',
			'Montserrat',
			'Open Sans',
			'Oswald',
			'Merriweather',
			'Raleway',
			'PT Serif',
			'Prata',
			'Hanken Grotesk',
		);

		$handles = $this->enqueue_with_fonts( $fonts );

		// 12 fonts / 5 rounds down to a chunk length of 2, so 6 stylesheets.
		$this->assertCount( 6, $handles );

		$first = wp_styles()->registered[ $handles[0] ]->src;
		$this->assertStringContainsString( 'family=Roboto|Lora', $first );
	}

	/**
	 * An empty collection enqueues nothing.
	 */
	public function test_empty_font_collection_enqueues_nothing() {
		$this->assertSame( array(), $this->enqueue_with_fonts( array() ) );
	}
}
