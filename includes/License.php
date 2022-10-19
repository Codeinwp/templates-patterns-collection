<?php
/**
 * License Manager
 *
 * Author:      Bogdan Preda <bogdan.preda@themeisle.com>
 * Created on:  10-10-{2022}
 *
 * @package templates-patterns-collection
 */
namespace TIOB;

/**
 * Class License
 */
final class License {
	const API_URL = 'https://api.themeisle.com/templates-cloud/';
	const LICENSE_DATA_TRANSIENT_KEY = 'templates_patterns_collection_license_data';
	const LICENSE_KEY_OPTION_KEY     = 'templates_patterns_collection_license';

	/**
	 * The main instance var.
	 *
	 * @var License|null
	 */
	protected static $instance = null;

	/**
	 * Constructor
	 *
	 * @return void
	 */
	private function __construct() {
		add_action( 'admin_init', array( $this, 'inherit_license_from_neve' ) );
		add_filter(
			'tiob_license_key',
			function () {
				return isset( self::get_license_data()->key ) ? self::get_license_data()->key : 'free';
			}
		);
	}

	/**
	 * Get Instance
	 *
	 * @return $this
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	private function safe_get( $url, $args = array() ) {
		return function_exists( 'vip_safe_wp_remote_get' )
			? vip_safe_wp_remote_get( $url )
			: wp_remote_get( //phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.wp_remote_get_wp_remote_get, Already used.
				$url,
				$args
			);
	}

	/**
	 * Inherit license from Neve
	 */
	public function inherit_license_from_neve() {
		$should_inherit = ! get_option( 'tiob_inherited_autoactivate', false );

		if ( $should_inherit && false === self::has_active_license() && 'valid' === apply_filters( 'product_neve_license_status', false ) ) {
			$neve_license = apply_filters( 'product_neve_license_key', 'free' );
			$this->check_license( $neve_license );
			update_option( 'tiob_inherited_autoactivate', true );
		}

	}

	private function set_license( $license, $license_data ) {
		update_option( self::LICENSE_KEY_OPTION_KEY, $license );
		set_transient( self::LICENSE_DATA_TRANSIENT_KEY, $license_data, 12 * HOUR_IN_SECONDS );
	}

	public function check_license( $license ) {
		$license_url = sprintf( '%stemplates/?license_id=%s&site_url=%s&license_check=1', self::API_URL, $license, rawurlencode( home_url() ) );
		$response    = $this->safe_get( $license_url );

		if ( is_wp_error( $response ) ) {
			return false;
		}

		$license_data = json_decode( wp_remote_retrieve_body( $response ) );
		$code         = wp_remote_retrieve_response_code( $response );

		if ( $code !== 200 ) {
			return false;
		}

		if ( ! empty( $license_data ) && ( isset( $license_data->code ) || isset( $license_data->message ) ) ) {
			return false;
		}

		$this->set_license( $license, $license_data );
		return true;
	}

	/**
	 * Get active license.
	 *
	 * @return bool
	 */
	public static function has_active_license(): bool {
		$status = self::get_license_data();

		if ( ! $status ) {
			return false;
		}

		if ( ! isset( $status->license ) ) {
			return false;
		}

		if ( 'not_active' === $status->license || 'invalid' === $status->license ) {
			return false;
		}

		return true;
	}

	/**
	 * Check if license is expired.
	 *
	 * @return bool
	 */
	public static function has_expired_license(): bool {
		$status = self::get_license_data();

		if ( ! $status ) {
			return false;
		}

		if ( ! isset( $status->license ) ) {
			return false;
		}

		if ( 'active_expired' !== $status->license ) {
			return false;
		}

		return true;
	}

	/**
	 * Get the license expiration date.
	 *
	 * @param string $format format of the date.
	 *
	 * @return false|string
	 */
	public static function get_license_expiration_date( $format = 'F Y' ) {
		$data = self::get_license_data();

		if ( isset( $data->expires ) ) {
			$parsed = date_parse( $data->expires );
			$time   = mktime( $parsed['hour'], $parsed['minute'], $parsed['second'], $parsed['month'], $parsed['day'], $parsed['year'] );

			return gmdate( $format, $time );
		}

		return false;
	}

	/**
	 * Get the license data.
	 *
	 * @return bool|\stdClass
	 */
	public static function get_license_data() {
		return get_transient( self::LICENSE_DATA_TRANSIENT_KEY );
	}

	/**
	 * Throw error on object clone
	 *
	 * @return void
	 */
	public function __clone() {
		// Cloning instances of the class is forbidden.
		_doing_it_wrong( __FUNCTION__, '', '1.0.0' );
	}

	/**
	 * Disable unserializing of the class
	 *
	 * @return void
	 */
	public function __wakeup() {
		// Unserializing instances of the class is forbidden.
		_doing_it_wrong( __FUNCTION__, '', '1.0.0' );
	}
}
