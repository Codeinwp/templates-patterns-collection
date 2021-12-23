<?php
/**
 * Handles admin logic for the onboarding.
 *
 * @package    templates-patterns-collection
 */

namespace TIOB;

use TIOB\Importers\Cleanup\Active_State;

/**
 * Class Admin
 *
 * @package templates-patterns-collection
 */
class Admin {

	/**
	 * Admin page slug
	 *
	 * @var string
	 */
	private $page_slug = 'tiob-starter-sites';

	/**
	 * White label config
	 *
	 * @var array
	 */
	private $wl_config = null;

	/**
	 * Initialize the Admin.
	 */
	public function init() {
		add_filter( 'query_vars', array( $this, 'add_onboarding_query_var' ) );
		add_action( 'after_switch_theme', array( $this, 'get_previous_theme' ) );
		add_filter( 'neve_dashboard_page_data', array( $this, 'localize_sites_library' ) );
		add_action( 'admin_menu', array( $this, 'register' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );

		$white_label_module = get_option( 'nv_pro_white_label_status' );
		if ( ! empty( $white_label_module ) && (bool) $white_label_module === true ) {
			$branding = get_option( 'ti_white_label_inputs' );
			if ( ! empty( $branding ) ) {
				$this->wl_config = json_decode( $branding, true );
			}
		}
	}

	/**
	 * Register theme options page.
	 *
	 * @return bool|void
	 */
	public function register() {
		if ( isset( $this->wl_config['starter_sites'] ) && (bool) $this->wl_config['starter_sites'] === true ) {
			return false;
		}

		$style = 'display:inline-block;';

		if ( ! is_rtl() ) {
			$style .= 'transform:scaleX(-1);margin-right:5px;';
		} else {
			$style .= 'margin-left:5px;';
		}

		$prefix = defined( 'NEVE_VERSION' ) ? '<span style="' . esc_attr( $style ) . '">&crarr;</span>' : '';
		add_theme_page(
			__( 'Starter Sites', 'templates-patterns-collection' ),
			$prefix . __( 'Starter Sites', 'templates-patterns-collection' ),
			'activate_plugins',
			$this->page_slug,
			array(
				$this,
				'render_starter_sites',
			)
		);
		if ( $this->is_agency_plan() ) {
			add_theme_page( __( 'My Library', 'templates-patterns-collection' ), $prefix . __( 'My Library', 'templates-patterns-collection' ), 'activate_plugins', 'themes.php?page=' . $this->page_slug . '#library' );
		}
	}

	/**
	 * Check if current subscription is agency.
	 *
	 * @return bool
	 */
	private function is_agency_plan() {
		$category         = apply_filters( 'product_neve_license_plan', - 1 );
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

		return isset( $category_mapping[ $category ] ) && $category_mapping[ $category ] === 3;
	}

	/**
	 * Render method for the starter sites page.
	 */
	public function render_starter_sites() {
		echo '<div id="tpc-app"/>';
	}

	public function enqueue() {
		$screen = get_current_screen();
		if ( ! isset( $screen->id ) ) {
			return;
		}

		if ( $screen->id !== 'appearance_page_' . $this->page_slug ) {
			return;
		}

		$dismiss_notice = isset( $_GET['dismiss_notice'] ) && $_GET['dismiss_notice'] === 'yes';
		if ( $dismiss_notice ) {
			set_transient( 'tiob_library_visited', true );
		}

		$dependencies = ( include TIOB_PATH . 'assets/build/app.asset.php' );

		wp_register_style( 'tiob', TIOB_URL . '/assets/build/style-app.css', array( 'wp-components' ), $dependencies['version'] );
		wp_style_add_data( 'tiob', 'rtl', 'replace' );
		wp_enqueue_style( 'tiob' );

		wp_register_script( 'tiob', TIOB_URL . '/assets/build/app.js', array_merge( $dependencies['dependencies'], array( 'updates' ) ), $dependencies['version'], true );
		wp_localize_script( 'tiob', 'tiobDash', apply_filters( 'neve_dashboard_page_data', $this->get_localization() ) );
		wp_enqueue_script( 'tiob' );
	}

	/**
	 * Get localization data for the dashboard script.
	 *
	 * @return array
	 */
	private function get_localization() {
		$theme_name = apply_filters( 'ti_wl_theme_name', 'Neve' );

		return array(
			'nonce'               => wp_create_nonce( 'wp_rest' ),
			'assets'              => TIOB_URL . '/assets/',
			'upgradeURL'          => esc_url( apply_filters( 'neve_upgrade_link_from_child_theme_filter', 'https://themeisle.com/themes/neve/upgrade/?utm_medium=aboutneve&utm_source=freevspro&utm_campaign=neve' ) ),
			'strings'             => array(
				/* translators: %s - Theme name */
				'starterSitesTabDescription' => __( 'Choose from multiple unique demos, specially designed for you, that can be installed with a single click. You just need to choose your favorite, and we will take care of everything else.', 'templates-patterns-collection' ),
			),
			'cleanupAllowed'      => ( ! empty( get_transient( Active_State::STATE_NAME ) ) ) ? 'yes' : 'no',
			'onboarding'          => array(),
			'hasFileSystem'       => WP_Filesystem(),
			'themesURL'           => admin_url( 'themes.php' ),
			'themeAction'         => $this->get_theme_action(),
			'brandedTheme'        => isset( $this->wl_config['theme_name'] ) ? $this->wl_config['theme_name'] : false,
			'endpoint'            => TPC_TEMPLATES_CLOUD_ENDPOINT,
			'params'              => array(
				'site_url'   => get_site_url(),
				'license_id' => apply_filters( 'product_neve_license_key', 'free' ),
			),
			'upsellNotifications' => $this->get_upsell_notifications(),
			'isValidLicense'      => $this->has_valid_addons(),
		);
	}

	/**
	 * Neve Pro upsells.
	 * @return array
	 */
	private function get_upsell_notifications() {

		$notifications['upsell_1'] = array(
			// We use these strings in Neve already so lets reuse the translations here.
			'text' => esc_html__( 'Upgrade to the PRO version and get instant access to all Premium Starter Sites — including Expert Sites — and much more.', 'neve' ), //phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
			'cta'  => __( 'Get Neve PRO Now', 'neve' ), //phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
			'url'  => 'https://themeisle.com/themes/neve/upgrade/?utm_medium=nevedashboard&utm_source=templatecloud&utm_campaign=neve&utm_content=<builder_name>notice',
		);

		return $notifications;

	}

	/**
	 * Gets theme action.
	 */
	private function get_theme_action() {
		if ( defined( 'NEVE_VERSION' ) ) {
			return false;
		}

		$themes = wp_get_themes();
		foreach ( $themes as $theme_slug => $args ) {
			$theme = wp_get_theme( $theme_slug );
			if ( $theme->get( 'TextDomain' ) === 'neve' ) {
				return array(
					'action' => 'activate',
					'slug'   => $theme_slug,
					'nonce'  => wp_create_nonce( 'switch-theme_' . $theme_slug ),
				);
			}
		}

		return array(
			'action' => 'install',
			'slug'   => 'neve',
			'nonce'  => wp_create_nonce( 'switch-theme_neve' ),
		);
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

		$page_was_visited = (bool) get_transient( 'tiob_library_visited' );
		if ( $this->is_agency_plan() && ! $page_was_visited ) {
			$array['notifications']['template-cloud'] = array(
				'text' => __( 'Great news!  Now you can export your own custom designs to the cloud and then reuse them on other sites.', 'templates-patterns-collection' ),
				'cta'  => sprintf( __( 'Open %s', 'templates-patterns-collection' ), 'Templates Cloud' ),
				'url'  => 'themes.php?page=' . $this->page_slug . '&dismiss_notice=yes#library',
			);
		}

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
			$options['description'] = __( 'Hi! We\'ve noticed you were using a child theme of Zelle before. To make your transition easier, we can help you keep the same homepage settings you had before but in original Zelle\'s style, by converting it into an Elementor template.', 'templates-patterns-collection' );
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
			'preview_btn'                 => __( 'Preview', 'templates-patterns-collection' ),
			'import_btn'                  => __( 'Import', 'templates-patterns-collection' ),
			'pro_btn'                     => __( 'Get the PRO version!', 'templates-patterns-collection' ),
			'importing'                   => __( 'Importing', 'templates-patterns-collection' ),
			'cancel_btn'                  => __( 'Cancel', 'templates-patterns-collection' ),
			'loading'                     => __( 'Loading', 'templates-patterns-collection' ),
			'go_to_site'                  => __( 'View Website', 'templates-patterns-collection' ),
			'edit_template'               => __( 'Add your own content', 'templates-patterns-collection' ),
			'back'                        => __( 'Back to Sites Library', 'templates-patterns-collection' ),
			'note'                        => __( 'Note', 'templates-patterns-collection' ),
			'advanced_options'            => __( 'Advanced Options', 'templates-patterns-collection' ),
			'plugins'                     => __( 'Plugins', 'templates-patterns-collection' ),
			'general'                     => __( 'General', 'templates-patterns-collection' ),
			'later'                       => __( 'Keep current layout', 'templates-patterns-collection' ),
			'search'                      => __( 'Search', 'templates-patterns-collection' ),
			'content'                     => __( 'Content', 'templates-patterns-collection' ),
			'customizer'                  => __( 'Customizer', 'templates-patterns-collection' ),
			'widgets'                     => __( 'Widgets', 'templates-patterns-collection' ),
			'backup_disclaimer'           => __( 'We recommend you backup your website content before attempting a full site import.', 'templates-patterns-collection' ),
			'placeholders_disclaimer'     => __( 'Due to copyright issues, some of the demo images will not be imported and will be replaced by placeholder images.', 'templates-patterns-collection' ),
			'placeholders_disclaimer_new' => __( 'Some of the demo images will not be imported and will be replaced by placeholder images.', 'templates-patterns-collection' ),
			'unsplash_gallery_link'       => __( 'Here is our own collection of related images you can use for your site.', 'templates-patterns-collection' ),
			'import_done'                 => __( 'Content was successfully imported. Enjoy your new site!', 'templates-patterns-collection' ),
			'pro_demo'                    => __( 'Available in the PRO version', 'templates-patterns-collection' ),
			'copy_error_code'             => __( 'Copy error code', 'templates-patterns-collection' ),
			'download_error_log'          => __( 'Download error log', 'templates-patterns-collection' ),
			'external_plugins_notice'     => __( 'To import this demo you have to install the following plugins:', 'templates-patterns-collection' ),
			'rest_not_working'            => sprintf(
			/* translators: 1 - 'here'. */
				__( 'It seems that Rest API is not working properly on your website. Read about how you can fix it %1$s.', 'templates-patterns-collection' ),
				sprintf( '<a href="https://docs.themeisle.com/article/1157-starter-sites-library-import-is-not-working#rest-api">%1$s<i class="dashicons dashicons-external"></i></a>', __( 'here', 'templates-patterns-collection' ) )
			),
			'error_report'                => sprintf(
			/* translators: 1 - 'get in touch'. */
				__( 'Hi! It seems there is a configuration issue with your server that\'s causing the import to fail. Please %1$s with us with the error code below, so we can help you fix this.', 'templates-patterns-collection' ),
				sprintf( '<a href="https://themeisle.com/contact">%1$s <i class="dashicons dashicons-external"></i></a>', __( 'get in touch', 'templates-patterns-collection' ) )
			),
			'troubleshooting'             => sprintf(
			/* translators: 1 - 'troubleshooting guide'. */
				__( 'Hi! It seems there is a configuration issue with your server that\'s causing the import to fail. Take a look at our %1$s to see if any of the proposed solutions work.', 'templates-patterns-collection' ),
				sprintf( '<a href="https://docs.themeisle.com/article/1157-starter-sites-library-import-is-not-working">%1$s <i class="dashicons dashicons-external"></i></a>', __( 'troubleshooting guide', 'templates-patterns-collection' ) )
			),
			'support'                     => sprintf(
			/* translators: 1 - 'get in touch'. */
				__( 'If none of the solutions in the guide work, please %1$s with us with the error code below, so we can help you fix this.', 'templates-patterns-collection' ),
				sprintf( '<a href="https://themeisle.com/contact">%1$s <i class="dashicons dashicons-external"></i></a>', __( 'get in touch', 'templates-patterns-collection' ) )
			),
			'fsDown'                      => sprintf(
			/* translators: %s - 'WP_Filesystem'. */
				__( 'It seems that %s is not available. You can contact your site administrator or hosting provider to help you enable it.', 'templates-patterns-collection' ),
				sprintf( '<code>WP_Filesystem</code>' )
			),
		);
	}

	/**
	 * Check validity of addons plugin.
	 *
	 * @return bool
	 */
	private function has_valid_addons() {
		if ( ! defined( 'NEVE_PRO_BASEFILE' ) ) {
			return false;
		}

		$option_name = basename( dirname( NEVE_PRO_BASEFILE ) );
		$option_name = str_replace( '-', '_', strtolower( trim( $option_name ) ) );
		$status      = get_option( $option_name . '_license_data' );

		if ( ! $status ) {
			return false;
		}

		if ( ! isset( $status->license ) ) {
			return false;
		}

		if ( $status->license === 'not_active' || $status->license === 'invalid' ) {
			return false;
		}

		return true;
	}

}
