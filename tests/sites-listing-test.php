<?php
/**
 * Test Sites_Listing caching.
 *
 * @package templates-patterns-collection
 */

use TIOB\Sites_Listing;

/**
 * Test the Starter Sites listing cache behavior.
 */
class Sites_Listing_Test extends \WP_UnitTestCase {

	/**
	 * @var Sites_Listing
	 */
	private $sites_listing;

	/**
	 * How many times the remote API was hit during a test.
	 *
	 * @var int
	 */
	private $remote_calls = 0;

	public function set_up(): void {
		parent::set_up();
		$this->sites_listing = new Sites_Listing();
		$this->remote_calls  = 0;
	}

	public function tear_down(): void {
		remove_all_filters( 'pre_http_request' );
		delete_transient( $this->get_transient_key() );
		parent::tear_down();
	}

	/**
	 * Mock the remote sites API with a payload of the given editors.
	 *
	 * @param array $payload Response payload.
	 */
	private function mock_api( $payload ) {
		add_filter(
			'pre_http_request',
			function () use ( $payload ) {
				$this->remote_calls++;
				return array(
					'response' => array( 'code' => 200 ),
					'body'     => wp_json_encode( $payload ),
				);
			}
		);
	}

	/**
	 * Read the private transient key from the instance.
	 *
	 * @return string
	 */
	private function get_transient_key() {
		$property = new ReflectionProperty( Sites_Listing::class, 'transient_key' );
		$property->setAccessible( true );

		return $property->getValue( $this->sites_listing );
	}

	/**
	 * Invoke the private get_sites method.
	 *
	 * @return array
	 */
	private function get_sites() {
		$method = new ReflectionMethod( $this->sites_listing, 'get_sites' );
		$method->setAccessible( true );

		return $method->invoke( $this->sites_listing );
	}

	/**
	 * The version-stamped transient key should include the plugin version.
	 */
	public function test_transient_key_is_version_stamped() {
		$this->assertSame( 'tiob_sites_' . TIOB_VERSION, $this->get_transient_key() );
	}

	/**
	 * A fresh fetch should store the payload wrapped with a fetched_at stamp.
	 */
	public function test_fetch_stores_wrapped_payload() {
		$this->mock_api( array( 'gutenberg' => array( 'site-a' => array() ) ) );

		$sites = $this->get_sites();

		$this->assertArrayHasKey( 'gutenberg', $sites );
		$this->assertSame( 1, $this->remote_calls );

		$cache = get_transient( $this->get_transient_key() );
		$this->assertIsArray( $cache );
		$this->assertArrayHasKey( 'fetched_at', $cache );
		$this->assertArrayHasKey( 'data', $cache );
		$this->assertArrayHasKey( 'gutenberg', $cache['data'] );
	}

	/**
	 * A fresh cache should be served without hitting the remote API.
	 */
	public function test_fresh_cache_is_served_without_remote_call() {
		set_transient(
			$this->get_transient_key(),
			array(
				'fetched_at' => time(),
				'data'       => array( 'gutenberg' => array( 'cached-site' => array() ) ),
			),
			12 * HOUR_IN_SECONDS
		);

		$this->mock_api( array( 'gutenberg' => array( 'fresh-site' => array() ) ) );

		$sites = $this->get_sites();

		$this->assertArrayHasKey( 'cached-site', $sites['gutenberg'] );
		$this->assertSame( 0, $this->remote_calls );
	}

	/**
	 * An orphaned-timeout transient (value present but our own fetched_at is
	 * past the TTL) must trigger a re-fetch instead of being served forever.
	 */
	public function test_stale_fetched_at_triggers_refetch() {
		set_transient(
			$this->get_transient_key(),
			array(
				'fetched_at' => time() - ( 13 * HOUR_IN_SECONDS ),
				'data'       => array( 'gutenberg' => array( 'old-site' => array() ) ),
			),
			12 * HOUR_IN_SECONDS
		);

		$this->mock_api( array( 'gutenberg' => array( 'new-site' => array() ) ) );

		$sites = $this->get_sites();

		$this->assertArrayHasKey( 'new-site', $sites['gutenberg'] );
		$this->assertArrayNotHasKey( 'old-site', $sites['gutenberg'] );
		$this->assertSame( 1, $this->remote_calls );
	}

	/**
	 * A legacy cache payload (raw sites array, no fetched_at wrapper) must not
	 * be served indefinitely; it should be treated as stale and re-fetched.
	 */
	public function test_legacy_cache_payload_triggers_refetch() {
		set_transient(
			$this->get_transient_key(),
			array( 'gutenberg' => array( 'legacy-site' => array() ) ),
			12 * HOUR_IN_SECONDS
		);

		$this->mock_api( array( 'gutenberg' => array( 'new-site' => array() ) ) );

		$sites = $this->get_sites();

		$this->assertArrayHasKey( 'new-site', $sites['gutenberg'] );
		$this->assertSame( 1, $this->remote_calls );
	}
}
