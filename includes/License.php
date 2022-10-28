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
	const API_URL                  = 'https://api.themeisle.com/templates-cloud/';
	const LICENSE_DATA_OPTIONS_KEY = 'templates_patterns_collection_license_data';
	const LICENSE_KEY_OPTION_KEY   = 'templates_patterns_collection_license';
	const LICENSE_TRANSIENT_KEY    = 'templates_patterns_collection_license_check';

	const NEVE_CATEGORY_MAPPING = array(
		1 => 1,
		2 => 1,
		3 => 2,
		4 => 2,
		5 => 3,
		6 => 3,
		7 => 1,
		8 => 2,
		9 => 3,
	);

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
				return get_option( self::LICENSE_KEY_OPTION_KEY );
			}
		);
		add_filter(
			'pre_update_option',
			function ( $value, $option, $old_value ) {
				if ( $option === self::LICENSE_KEY_OPTION_KEY ) {
					if ( $value !== $old_value ) {
						delete_transient( self::LICENSE_TRANSIENT_KEY );
					}
				}
				return $value;
			},
			10,
			3
		);

		register_setting(
			'tpc_license_settings',
			self::LICENSE_KEY_OPTION_KEY,
			array(
				'type'         => 'string',
				'show_in_rest' => true,
				'default'      => '',
			)
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
			return;
		}

		if ( ! get_transient( self::LICENSE_TRANSIENT_KEY ) ) {
			$tiob_license = apply_filters( 'tiob_license_key', 'free' );
			$this->check_license( $tiob_license );
		}

	}

	private function set_license( $license, $license_data ) {
		update_option( self::LICENSE_KEY_OPTION_KEY, $license );
		update_option( self::LICENSE_DATA_OPTIONS_KEY, $license_data );
		set_transient( self::LICENSE_TRANSIENT_KEY, true, 12 * HOUR_IN_SECONDS );
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
			$this->set_license(
				$license,
				(object) array(
					'key'        => 'free',
					'valid'      => 'invalid',
					'expiration' => '',
					'tier'       => 0,
				)
			);
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
	 * Get the license data.
	 *
	 * @return bool|\stdClass
	 */
	public static function get_license_data() {
		return get_option( self::LICENSE_DATA_OPTIONS_KEY );
	}

	/**
	 * Get the license tier.
	 *
	 * @param int $default_tier The default tier.
	 * @return int
	 */
	public static function get_license_tier( $default_tier = 0 ) {
		$license = self::get_license_data();
		if ( isset( $license->tier ) && absint( $license->tier ) >= 0 ) {
			$tier = $license->tier;
			if ( $license->tier !== 3 ) {
				$tier = isset( self::NEVE_CATEGORY_MAPPING[ $license->tier ] ) ? self::NEVE_CATEGORY_MAPPING[ $license->tier ] : $license->tier;
			}
			return (int) $tier;
		}
		return $default_tier;
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
	 * Disable un-serializing of the class
	 *
	 * @return void
	 */
	public function __wakeup() {
		// Un-serializing instances of the class is forbidden.
		_doing_it_wrong( __FUNCTION__, '', '1.0.0' );
	}
}
