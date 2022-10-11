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
	const LICENSE_DATA_OPTION_KEY = 'templates_patterns_collection_license_data';

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

	/**
	 * Inherit license from Neve
	 */
	public function inherit_license_from_neve() {
		delete_option( 'tiob_inherited_autoactivate' );
		$should_inherit = ! get_option( 'tiob_inherited_autoactivate', false );

		if ( $should_inherit && false === self::has_active_license() && 'valid' === apply_filters( 'product_neve_license_status', false ) ) {
			$neve_license = apply_filters( 'product_neve_license_key', 'free' );
			apply_filters( 'themeisle_sdk_license_process_tiob', $neve_license, 'activate' );
			update_option( 'tiob_inherited_autoactivate', true );
		}
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
		return get_option( self::LICENSE_DATA_OPTION_KEY );
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
