<?php
/**
 * Handles admin logic for the onboarding.
 *
 * @package    templates-patterns-collection
 */

namespace TIOB;

/**
 * Class Admin
 *
 * @package templates-patterns-collection
 */
class Admin {

	/**
	 * Initialize the Admin.
	 */
	public function init() {
		add_filter( 'query_vars', array( $this, 'add_onboarding_query_var' ) );
		add_action( 'after_switch_theme', array( $this, 'get_previous_theme' ) );
		add_filter( 'neve_dashboard_page_data', array( $this, 'localize_sites_library' ) );
	}

	/**
	 * Memorize the previous theme to later display the import template for it.
	 */
	public function get_previous_theme() {
		$previous_theme = strtolower( get_option( 'theme_switched' ) );
		set_theme_mod( 'ti_prev_theme', $previous_theme );
	}

	/**
	 * Add our onboarding query var.
	 *
	 * @param array $vars_array the registered query vars.
	 *
	 * @return array
	 */
	public function add_onboarding_query_var( $vars_array ) {
		array_push( $vars_array, 'onboarding' );

		return $vars_array;
	}

	/**
	 * Localize the sites library.
	 *
	 * @param array $array the about page array.
	 *
	 * @return array
	 */
	public function localize_sites_library( $array ) {
		$api = array(
			'sites'      => $this->get_sites_data(),
			'root'       => esc_url_raw( rest_url( Main::API_ROOT ) ),
			'nonce'      => wp_create_nonce( 'wp_rest' ),
			'homeUrl'    => esc_url( home_url() ),
			'i18n'       => $this->get_strings(),
			'onboarding' => false,
			'logUrl'     => WP_Filesystem() ? Logger::get_instance()->get_log_url() : null,
		);

		$is_onboarding = isset( $_GET['onboarding'] ) && $_GET['onboarding'] === 'yes';
		if ( $is_onboarding ) {
			$api['onboarding'] = true;
		}

		$array['onboarding'] = $api;

		return $array;
	}

	/**
	 * Get all the sites data.
	 *
	 * @return array
	 */
	public function get_sites_data() {
		$theme_support = get_theme_support( 'themeisle-demo-import' );
		if ( empty( $theme_support[0] ) || ! is_array( $theme_support[0] ) ) {
			return array();
		}
		$theme_support = $theme_support[0];
		$sites         = isset( $theme_support['remote'] ) ? $theme_support['remote'] : null;

		foreach ( $sites as $builder => $sites_for_builder ) {
			foreach ( $sites_for_builder as $slug => $data ) {
				$sites[ $builder ][ $slug ]['slug'] = $slug;
				if ( ! isset( $data['upsell'] ) || $data['upsell'] !== true ) {
					continue;
				}
				$sites[ $builder ][ $slug ]['utmOutboundLink'] = add_query_arg(
					apply_filters(
						'ti_onboarding_outbound_query_args',
						array(
							'utm_medium'   => 'about-' . get_template(),
							'utm_source'   => $slug,
							'utm_campaign' => 'siteslibrary',
						)
					),
					$theme_support['pro_link']
				);
			}
		}

		return array(
			'sites'     => $sites,
			'migration' => $this->get_migrateable( $theme_support ),
		);
	}

	/**
	 * Get migratable data.
	 *
	 * This is used if we can ensure migration from a previous theme to a template.
	 *
	 * @param array $theme_support the theme support array.
	 *
	 * @return array
	 */
	private function get_migrateable( $theme_support ) {
		if ( ! isset( $theme_support['can_migrate'] ) ) {
			return null;
		}

		$data                = $theme_support['can_migrate'];
		$old_theme           = get_theme_mod( 'ti_prev_theme', 'ti_onboarding_undefined' );
		$folder_name         = $old_theme;
		$previous_theme_slug = $this->get_parent_theme( $old_theme );

		if ( ! empty( $previous_theme_slug ) ) {
			$folder_name = $previous_theme_slug;
			$old_theme   = $previous_theme_slug;
		}

		if ( ! array_key_exists( $old_theme, $data ) ) {
			return null;
		}

		$content_imported = get_theme_mod( $data[ $old_theme ]['theme_mod_check'], 'not-imported' );
		if ( $content_imported === 'yes' ) {
			return null;
		}

		if ( in_array( $old_theme, array( 'zerif-lite', 'zerif-pro' ), true ) ) {
			$folder_name = 'zelle';
		}

		$options = array(
			'theme_name'          => ! empty( $data[ $old_theme ]['theme_name'] ) ? esc_html( $data[ $old_theme ]['theme_name'] ) : '',
			'screenshot'          => TIOB_URL . '/migration/' . $folder_name . '/' . $data[ $old_theme ]['template'] . '.png',
			'template'            => TIOB_PATH . '/migration/' . $folder_name . '/' . $data[ $old_theme ]['template'] . '.json',
			'template_name'       => $data[ $old_theme ]['template'],
			'heading'             => $data[ $old_theme ]['heading'],
			'description'         => $data[ $old_theme ]['description'],
			'theme_mod'           => $data[ $old_theme ]['theme_mod_check'],
			'mandatory_plugins'   => isset( $data[ $old_theme ]['mandatory_plugins'] ) ? $data[ $old_theme ]['mandatory_plugins'] : array(),
			'recommended_plugins' => isset( $data[ $old_theme ]['recommended_plugins'] ) ? $data[ $old_theme ]['recommended_plugins'] : array(),
		);

		if ( ! empty( $previous_theme_slug ) ) {
			$options['description'] = __( 'Hi! We\'ve noticed you were using a child theme of Zelle before. To make your transition easier, we can help you keep the same homepage settings you had before but in original Zelle\'s style, by converting it into an Elementor template.', 'neve' );
		}

		return $options;
	}

	/**
	 * Get previous theme parent if it's a child theme.
	 *
	 * @param string $previous_theme Previous theme slug.
	 *
	 * @return string
	 */
	private function get_parent_theme( $previous_theme ) {
		$available_themes = wp_get_themes();
		if ( ! array_key_exists( $previous_theme, $available_themes ) ) {
			return false;
		}
		$theme_object = $available_themes[ $previous_theme ];

		return $theme_object->get( 'Template' );
	}


	/**
	 * Get strings.
	 *
	 * @return array
	 */
	private function get_strings() {
		return array(
			'preview_btn'                 => __( 'Preview', 'neve' ),
			'import_btn'                  => __( 'Import', 'neve' ),
			'pro_btn'                     => __( 'Get the PRO version!', 'neve' ),
			'importing'                   => __( 'Importing', 'neve' ),
			'cancel_btn'                  => __( 'Cancel', 'neve' ),
			'loading'                     => __( 'Loading', 'neve' ),
			'go_to_site'                  => __( 'View Website', 'neve' ),
			'edit_template'               => __( 'Add your own content', 'neve' ),
			'back'                        => __( 'Back to Sites Library', 'neve' ),
			'note'                        => __( 'Note', 'neve' ),
			'advanced_options'            => __( 'Advanced Options', 'neve' ),
			'plugins'                     => __( 'Plugins', 'neve' ),
			'general'                     => __( 'General', 'neve' ),
			'later'                       => __( 'Keep current layout', 'neve' ),
			'search'                      => __( 'Search', 'neve' ),
			'content'                     => __( 'Content', 'neve' ),
			'customizer'                  => __( 'Customizer', 'neve' ),
			'widgets'                     => __( 'Widgets', 'neve' ),
			'backup_disclaimer'           => __( 'We recommend you backup your website content before attempting a full site import.', 'neve' ),
			'placeholders_disclaimer'     => __( 'Due to copyright issues, some of the demo images will not be imported and will be replaced by placeholder images.', 'neve' ),
			'placeholders_disclaimer_new' => __( 'Some of the demo images will not be imported and will be replaced by placeholder images.', 'neve' ),
			'unsplash_gallery_link'       => __( 'Here is our own collection of related images you can use for your site.', 'neve' ),
			'import_done'                 => __( 'Content was successfully imported. Enjoy your new site!', 'neve' ),
			'pro_demo'                    => __( 'Available in the PRO version', 'neve' ),
			'copy_error_code'             => __( 'Copy error code', 'neve' ),
			'download_error_log'          => __( 'Download error log', 'neve' ),
			'external_plugins_notice'     => __( 'To import this demo you have to install the following plugins:', 'neve' ),
			/* translators: 1 - 'here'. */
			'rest_not_working'            => sprintf(
				__( 'It seems that Rest API is not working properly on your website. Read about how you can fix it %1$s.', 'neve' ),
				sprintf( '<a href="https://docs.themeisle.com/article/1157-starter-sites-library-import-is-not-working#rest-api">%1$s<i class="dashicons dashicons-external"></i></a>', __( 'here', 'neve' ) )
			),
			/* translators: 1 - 'get in touch'. */
			'error_report'                => sprintf(
				__( 'Hi! It seems there is a configuration issue with your server that\'s causing the import to fail. Please %1$s with us with the error code below, so we can help you fix this.', 'neve' ),
				sprintf( '<a href="https://themeisle.com/contact">%1$s <i class="dashicons dashicons-external"></i></a>', __( 'get in touch', 'neve' ) )
			),
			/* translators: 1 - 'troubleshooting guide'. */
			'troubleshooting'             => sprintf(
				__( 'Hi! It seems there is a configuration issue with your server that\'s causing the import to fail. Take a look at our %1$s to see if any of the proposed solutions work.', 'neve' ),
				sprintf( '<a href="https://docs.themeisle.com/article/1157-starter-sites-library-import-is-not-working">%1$s <i class="dashicons dashicons-external"></i></a>', __( 'troubleshooting guide', 'neve' ) )
			),
			/* translators: 1 - 'get in touch'. */
			'support'                     => sprintf(
				__( 'If none of the solutions in the guide work, please %1$s with us with the error code below, so we can help you fix this.', 'neve' ),
				sprintf( '<a href="https://themeisle.com/contact">%1$s <i class="dashicons dashicons-external"></i></a>', __( 'get in touch', 'neve' ) )
			),
			'fsDown'                      => sprintf(
				__( 'It seems that %s is not available. You can contact your site administrator or hosting provider to help you enable it.', 'neve' ),
				sprintf( '<code>WP_Filesystem</code>' )
			),
		);
	}
}
