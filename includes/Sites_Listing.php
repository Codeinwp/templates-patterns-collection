<?php
/**
 * Theme Onboarding Sites_Listing
 *
 * @package    templates-patterns-collection
 */

namespace TIOB;

/**
 * Class Sites_Listing
 */
class Sites_Listing {

	/**
	 * Sites Listing API URL
	 */
	const API = 'https://api.themeisle.com/sites/wp-json/demosites-api/sites';

	/**
	 * Key of transient where we save the sites list.
	 *
	 * @var string
	 */
	private $transient_key = 'tiob_sites';

	/**
	 * The onboarding config.
	 *
	 * @var array
	 */
	private $onboarding_config = array();

	/**
	 * Initialize the Class.
	 */
	public function init() {
		$this->onboarding_config = array(
			'remote'      => $this->get_sites(),
			'upsell'      => array(),
			'can_migrate' => array(
				'zerif-pro'  => array(
					'theme_name'        => 'Zelle Pro',
					'theme_mod_check'   => 'zelle_frontpage_was_imported',
					'template'          => 'zelle',
					'heading'           => __( 'Want to keep using Zelle\'s homepage?', 'templates-patterns-collection' ),
					'description'       => __( 'Hi! We\'ve noticed you were using Zelle before. To make your transition easier, we can help you keep the same beautiful homepage you had before, by converting it into an Elementor template. This option will also import your homepage content.', 'templates-patterns-collection' ),
					'mandatory_plugins' => array(
						'elementor' => 'Elementor Page Builder',
					),
				),
				'zerif-lite' => array(
					'theme_name'        => 'Zelle Lite',
					'theme_mod_check'   => 'zelle_frontpage_was_imported',
					'template'          => 'zelle',
					'heading'           => __( 'Want to keep using Zelle\'s homepage?', 'templates-patterns-collection' ),
					'description'       => __( 'Hi! We\'ve noticed you were using Zelle before. To make your transition easier, we can help you keep the same beautiful homepage you had before, by converting it into an Elementor template. This option will also import your homepage content.', 'templates-patterns-collection' ),
					'mandatory_plugins' => array(
						'elementor' => 'Elementor Page Builder',
					),
				),
			),
			'pro_link'    => 'https://themeisle.com/themes/neve/upgrade/',
		);
		$this->add_sites_library_support();
	}

	/**
	 *
	 */
	public function add_sites_library_support() {
		add_theme_support( 'themeisle-demo-import', $this->get_ti_demo_content_support_data() );
	}

	private function get_sites() {
		$cache = get_transient( $this->transient_key );

		if ( $cache !== false ) {
			$response = $cache;
		} else {
			$response = wp_remote_get( esc_url( self::API ) );

			if ( is_wp_error( $response ) || wp_remote_retrieve_response_code( $response ) !== 200 ) {
				return array();
			}

			$response = wp_remote_retrieve_body( $response );

			$response = json_decode( $response, true );

			if ( ! is_array( $response ) || empty( $response ) ) {
				return array();
			}
		}

		require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
		$upsell_status = $this->get_upsell_status();

		$divi  = array(
			array(
				'name'       => 'Divi Builder',
				'active'     => is_plugin_active( 'divi-builder/divi-builder.php' ),
				'author_url' => esc_url( 'https://www.elegantthemes.com/gallery/divi/' ),
			),
		);
		$thive = array(
			array(
				'name'       => 'Thrive Architect',
				'active'     => is_plugin_active( 'thrive-visual-editor/thrive-visual-editor.php' ),
				'author_url' => esc_url( 'https://thrivethemes.com/architect/' ),
			),
		);

		foreach ( $response as $editor => $sites ) {
			foreach ( $sites as $slug => $site_data ) {
				if ( $editor === 'divi builder' ) {
					$response[ $editor ][ $slug ]['external_plugins'] = $divi;
				}
				if ( $editor === 'thrive architect' ) {
					$response[ $editor ][ $slug ]['external_plugins'] = $thive;
				}
				if ( isset( $site_data['upsell'] ) ) {
					$response[ $editor ][ $slug ]['upsell'] = $upsell_status;
				}
			}
		}

		set_transient( $this->transient_key, $response, 12 * HOUR_IN_SECONDS );

		return $response;
	}

	/**
	 * Get the themeisle demo content support data.
	 *
	 * @return array
	 */
	private function get_ti_demo_content_support_data() {
		$this->reorder_starter_sites();
		return apply_filters( 'neve_filter_onboarding_sites', $this->onboarding_config );
	}

	/**
	 * Reorder starter sites based on previous theme
	 *
	 * @return bool
	 */
	private function reorder_starter_sites() {
		$previous_theme = get_theme_mod( 'ti_prev_theme' );
		if ( empty( $previous_theme ) ) {
			return false;
		}

		$slug_association = array(
			'zerif-pro'      => 'neve-zelle',
			'zerif-lite'     => 'neve-zelle',
			'themotion'      => 'neve-themotion',
			'themotion-lite' => 'neve-themotion',
			'amadeus'        => 'neve-amadeus',
			'rokophoto-lite' => 'neve-rokophoto',
			'rokophoto'      => 'neve-rokophoto',
			'oblique'        => 'neve-oblique',
			'shop-isle'      => 'neve-shop',
			'shop-isle-pro'  => 'neve-shop',
			'lawyeria-lite'  => 'neve-lawyer',
			'lawyeria'       => 'neve-lawyer',
		);
		if ( ! array_key_exists( $previous_theme, $slug_association ) ) {
			return false;
		}
		if ( ! isset( $this->onboarding_config['local']['elementor'][ $slug_association[ $previous_theme ] ] ) ) {
			return false;
		}
		$starter_site = $this->onboarding_config['local']['elementor'][ $slug_association[ $previous_theme ] ];
		unset( $this->onboarding_config['local']['elementor'][ $slug_association[ $previous_theme ] ] );
		$this->onboarding_config['local']['elementor'] = array( $slug_association[ $previous_theme ] => $starter_site ) + $this->onboarding_config['local']['elementor'];

		return true;
	}

	/**
	 * Get upsell status.
	 *
	 * @return bool
	 */
	private function get_upsell_status() {
		$category         = apply_filters( 'product_neve_license_plan', -1 );
		$category_mapping = array(
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
		return ! isset( $category_mapping[ $category ] ) || $category_mapping[ $category ] < 2;
	}
}
