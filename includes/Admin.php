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
	use White_Label_Config;

	// TODO: revert this after implementation
	// const API = 'neve.test/wp-json';
	const API = 'api.themeisle.com';

	const IMPORTED_TEMPLATES_COUNT_OPT = 'tiob_premade_imported';
	const FEEDBACK_DISMISSED_OPT       = 'tiob_feedback_dismiss';

	const TC_REMOVED_KEY          = 'tiob_tc_removed';
	const TC_NEW_NOTICE_DISMISSED = 'tiob_new_tc_notice_dismissed';
	const VISITED_LIBRARY_OPT     = 'tiob_library_visited';

	/**
	 * Admin page slug
	 *
	 * @var string
	 */
	private $page_slug = 'tiob-starter-sites';

	/**
	 * Option and transient namespace for email skip.
	 *
	 * @var string
	 */
	private $skip_email_subscribe_namespace = 'tpc_skip_email_subscribe';

	/**
	 * Neve font pairs
	 *
	 * @var array
	 */
	private $font_pairs_neve = array();

	/**
	 * Google fonts
	 *
	 * @var array
	 */
	private $google_fonts = array();

	public static function get_templates_cloud_endpoint() {
		return 'https://' . self::API . '/templates-cloud/';
	}

	/**
	 * Initialize the Admin.
	 */
	public function init() {
		License::get_instance();

		$this->maybe_remove_tc();

		add_filter( 'query_vars', array( $this, 'add_onboarding_query_var' ) );
		add_action( 'after_switch_theme', array( $this, 'get_previous_theme' ) );
		add_filter( 'neve_dashboard_page_data', array( $this, 'localize_sites_library' ) );
		add_action( 'admin_menu', array( $this, 'register' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );
		add_filter( 'ti_tpc_editor_data', array( $this, 'add_tpc_editor_data' ), 20 );
		add_action( 'admin_init', array( $this, 'activation_redirect' ) );

		$this->setup_white_label();

		add_action( 'wp_ajax_skip_subscribe', array( $this, 'skip_subscribe' ) );
		add_action( 'wp_ajax_nopriv_skip_subscribe', array( $this, 'skip_subscribe' ) );

		add_action( 'wp_ajax_mark_onboarding_done', array( $this, 'mark_onboarding_done' ) );
		add_action( 'wp_ajax_nopriv_mark_onboarding_done', array( $this, 'mark_onboarding_done' ) );

		add_action( 'wp_ajax_tpc_get_logs', array( $this, 'external_get_logs' ) );

		add_action( 'wp_ajax_dismiss_new_tc_notice', array( $this, 'dismiss_new_tc_notice' ) );

		$this->register_feedback_settings();

		$this->register_prevent_clone_hooks();

		$this->get_font_parings();
	}

	/**
	 * Removes template cloud for users that:
	 * - didn't have a license key yet;
	 * - have 0 templates saved;
	 *
	 * @return void
	 */
	public function maybe_remove_tc() {
		$status = get_option( self::TC_REMOVED_KEY );

		if ( $status !== false ) {
			return;
		}

		if ( ! License::has_active_license() ) {
			update_option( self::TC_REMOVED_KEY, 'yes' );

			return;
		}

		$license = License::get_instance();

		if ( ! $license->has_any_templates() ) {
			update_option( self::TC_REMOVED_KEY, 'yes' );

			return;
		}

		update_option( self::TC_REMOVED_KEY, 'no' );
	}


	/**
	 * Check if the legacy template cloud is still available.
	 *
	 * @return bool
	 */
	public static function has_legacy_template_cloud() {
		return get_option( self::TC_REMOVED_KEY, 'no' ) === 'no';
	}

	public function dismiss_new_tc_notice() {
		$response = array(
			'success' => false,
			'code'    => 'ti__ob_not_allowed',
			'message' => 'Not allowed!',
		);

		if ( ! isset( $_REQUEST['nonce'] ) ) {
			$this->ensure_ajax_response( $response );
			return;
		}

		if ( ! wp_verify_nonce( $_REQUEST['nonce'], 'dismiss_new_tc_notice' ) ) {
			$this->ensure_ajax_response( $response );
			return;
		}

		unset( $response['code'] );
		unset( $response['message'] );

		update_option( self::TC_NEW_NOTICE_DISMISSED, 'yes' );
		$this->ensure_ajax_response( $response );
	}


	/**
	 * Register hooks to prevent meta cloning for the templates.
	 * This is needed because the template id is unique, and we don't want to clone it.
	 * @return void
	 */
	public function register_prevent_clone_hooks() {
		$allowed_post_types = Editor::get_allowed_post_types();
		if ( empty( $allowed_post_types ) ) {
			return;
		}
		foreach ( $allowed_post_types as $post_type ) {
			add_filter(
				'update_' . $post_type . '_metadata',
				function ( $value, $post_id, $meta_key, $meta_value, $prev_value ) use ( $post_type ) {
					if ( $this->check_unique_template_id_on_meta_change( $post_id, $meta_key, $post_type, $meta_value ) ) {
						return true;
					}
					return $value;
				},
				10,
				5
			);
			add_filter(
				'add_' . $post_type . '_metadata',
				function ( $value, $post_id, $meta_key, $meta_value, $unique ) use ( $post_type ) {
					if ( $this->check_unique_template_id_on_meta_change( $post_id, $meta_key, $post_type, $meta_value ) ) {
						return true;
					}
					return $value;
				},
				10,
				5
			);
		}
	}

	/**
	 * Check that the meta value is unique for the allowed post types that support Templates Cloud.
	 *
	 * @param int $post_id The post ID.
	 * @param string $meta_key The meta key.
	 * @param string $meta_type The meta type. The post type ( post, page, neve_custom_layouts etc. ).
	 * @param string $meta_value The meta value.
	 *
	 * @return bool
	 */
	public function check_unique_template_id_on_meta_change( $post_id, $meta_key, $meta_type, $meta_value ) {
		// Skip check if the meta key is not one of the allowed ones.
		if ( ! in_array(
			$meta_key,
			array(
				'_ti_tpc_template_sync',
				'_ti_tpc_template_id',
				'_ti_tpc_screenshot_url',
				'_ti_tpc_site_slug',
				'_ti_tpc_published',
			),
			true
		)
		) {
			return false;
		}

		if ( empty( $meta_value ) ) {
			return false;
		}

		$template_id = get_post_meta( $post_id, '_ti_tpc_template_id', true );
		if ( empty( $template_id ) && $meta_key === '_ti_tpc_template_id' ) {
			$template_id = $meta_value;
		}

		// Check if the template ID is used on any other posts or pages
		// exclude the current post from the query
		$args         = array(
			'post_type'      => $meta_type,
			'meta_key'       => '_ti_tpc_template_id',
			'meta_value'     => $template_id,
			'post__not_in'   => array( $post_id ),
			'posts_per_page' => 1,
			'fields'         => 'ids',
		);
		$query        = new \WP_Query( $args );
		$duplicate_id = $query->get_posts();

		if ( ! empty( $duplicate_id ) ) {
			// The template ID is already used on another post
			return true;
		}
		return false;
	}

	/**
	 * Register feedback settings.
	 *
	 * @return void
	 */
	private function register_feedback_settings() {
		register_setting(
			'tiob_feedback',
			self::IMPORTED_TEMPLATES_COUNT_OPT,
			array(
				'type'         => 'integer',
				'show_in_rest' => true,
				'default'      => 0,
			)
		);
		register_setting(
			'tiob_feedback',
			self::FEEDBACK_DISMISSED_OPT,
			array(
				'type'         => 'boolean',
				'show_in_rest' => true,
				'default'      => false,
			)
		);
	}

	/**
	 * Return the skip subscribe status.
	 * Used to determine if email form should be displayed.
	 *
	 * @return bool
	 */
	private function get_skip_subscribe_status() {
		$status = false;
		if ( 'yes' === get_option( $this->skip_email_subscribe_namespace, 'no' ) ) {
			$status = true;
		}

		if ( get_transient( $this->skip_email_subscribe_namespace ) ) {
			$status = true;
		}

		return $status;
	}

	/**
	 * Utility method to ensure proper response for ajax call.
	 *
	 * @param array $response
	 */
	private function ensure_ajax_response( $response ) {
		echo json_encode( $response );
		die();
	}

	/**
	 * Handles the `skip_subscribe` ajax action.
	 */
	public function skip_subscribe() {
		$response = array(
			'success' => false,
			'code'    => 'ti__ob_not_allowed',
			'message' => 'Not allowed!',
		);
		if ( ! isset( $_REQUEST['nonce'] ) ) {
			$this->ensure_ajax_response( $response );
			return;
		}

		if ( ! wp_verify_nonce( $_REQUEST['nonce'], 'skip_subscribe_nonce' ) ) {
			$this->ensure_ajax_response( $response );
			return;
		}

		unset( $response['code'] );
		unset( $response['message'] );
		$response['success'] = true;
		if ( isset( $_REQUEST['isTempSkip'] ) ) {
			set_transient( $this->skip_email_subscribe_namespace, 'yes', 7 * DAY_IN_SECONDS );
			$this->ensure_ajax_response( $response );
			return;
		}

		update_option( $this->skip_email_subscribe_namespace, 'yes' );
		$this->ensure_ajax_response( $response );
	}

	/**
	 * Handles the `mark_onboarding_done` ajax action.
	 */
	public function mark_onboarding_done() {
		$response = array(
			'success' => false,
			'code'    => 'ti__ob_not_allowed',
			'message' => 'Not allowed!',
		);
		if ( ! isset( $_REQUEST['nonce'] ) ) {
			$this->ensure_ajax_response( $response );
			return;
		}

		if ( ! wp_verify_nonce( $_REQUEST['nonce'], 'onboarding_done_nonce' ) ) {
			$this->ensure_ajax_response( $response );
			return;
		}

		unset( $response['code'] );
		unset( $response['message'] );

		update_option( 'tpc_onboarding_done', 'yes' );
		$this->ensure_ajax_response( $response );
	}

	/**
	 * Hook into editor data to add Neve plan if available
	 * or return the proper tier if stand-alone license is valid.
	 *
	 * @param array $data tiTpc exported data.
	 *
	 * @return array
	 */
	public function add_tpc_editor_data( $data ) {
		$plan         = $this->neve_license_plan();
		$data['tier'] = License::get_license_tier( $plan );

		return $data;
	}


	/**
	 * Redirect to onboarding if user is new.
	 *
	 * @return void
	 */
	public function activation_redirect() {
		$should_run_obd = get_option( 'tpc_maybe_run_onboarding', false );
		if ( ! $should_run_obd ) {
			return;
		}
		if ( ! $this->should_load_onboarding() ) {
			return;
		}

		delete_option( 'tpc_maybe_run_onboarding' );
		wp_safe_redirect(
			add_query_arg(
				array(
					'page' => 'neve-onboarding',
					'show' => 'welcome',
				),
				admin_url( 'admin.php' )
			)
		);
		exit();
	}

	/**
	 * Use the Neve builtin compatibility to check for specific support.
	 *
	 * @return bool
	 */
	private function neve_theme_has_support( $feature ) {
		if ( defined( 'NEVE_COMPATIBILITY_FEATURES' ) ) {
			$features = NEVE_COMPATIBILITY_FEATURES;
			return isset( $features[ $feature ] );
		}
		return false;
	}

	/**
	 * Use the features defined in the TIOB plugin to check for specific support.
	 *
	 * @param string $feature The feature to check for.
	 *
	 * @return bool
	 */
	private function tiob_has_support( $feature ) {
		if ( defined( 'TIOB_FEATURES' ) ) {
			$features = TIOB_FEATURES;
			return isset( $features[ $feature ] );
		}
		return false;
	}

	/**
	 * Utility method to add a theme page from an array.
	 *
	 * @param array $page_data Page data.
	 * @param int $offset Offset for the menu position.
	 *
	 * @return void
	 */
	private function add_theme_page_for_tiob( $page_data, $offset = 2 ) {

		if ( $this->neve_theme_has_support( 'theme_dedicated_menu' ) ) {
			global $submenu;

			$theme_page = 'neve-welcome';
			$capability = 'activate_plugins';
			add_submenu_page(
				$theme_page,
				$page_data['page_title'],
				$page_data['page_title'],
				$capability,
				$page_data['menu_slug'],
				$page_data['callback']
			);

			$item = array_pop( $submenu[ $theme_page ] );
			array_splice( $submenu[ $theme_page ], $offset, 0, array( $item ) );
			return;
		}

		// When using the new menu location we will not register items on the theme page anymore.
		if ( $this->tiob_has_support( 'new_menu' ) ) {
			return;
		}

		add_theme_page(
			$page_data['page_title'],
			$page_data['menu_title'],
			$page_data['capability'],
			$page_data['menu_slug'],
			$page_data['callback']
		);
	}

	/**
	 * Utility method to add a plugin sub-page from an array.
	 *
	 * @param array $page_data Page data.
	 *
	 * @return void
	 */
	private function add_subpage_for_tiob( $page_data ) {
		$capability = 'manage_options';
		add_submenu_page(
			$page_data['parent_slug'],
			$page_data['page_title'],
			$page_data['menu_title'],
			$capability,
			$page_data['menu_slug'],
			$page_data['callback']
		);
	}

	/**
	 * Register theme options page.
	 *
	 * @return bool|void
	 */
	public function register() {
		$has_neve = defined( 'NEVE_VERSION' );

		// Legacy users that had the plugin and had templates.
		if ( self::has_legacy_template_cloud() ) {
			$this->register_legacy_template_cloud_pages();

			return;
		}

		if ( ! $has_neve ) {
			$this->register_starter_sites_page( true );

			return;
		}

		$this->register_starter_sites_page();
	}

	private function register_starter_sites_page( $in_appearance = false ) {
		// WL disables starter sites.
		if ( $this->is_starter_sites_disabled() ) {
			return;
		}

		$starter_site_data = array(
			'page_title' => __( 'Starter Sites', 'templates-patterns-collection' ),
			'menu_title' => $this->get_prefix_for_menu_item() . __( 'Onboarding', 'templates-patterns-collection' ),
			'capability' => 'install_plugins',
			'menu_slug'  => 'neve-onboarding',
			'callback'   => array(
				$this,
				'render_onboarding',
			),
		);

		if ( $in_appearance ) {
			$starter_site_data['page_title'] = __( 'Starter Templates', 'templates-patterns-collection' );
			$starter_site_data['menu_title'] = __( 'Starter Templates', 'templates-patterns-collection' );

			add_theme_page(
				$starter_site_data['page_title'],
				$starter_site_data['menu_title'],
				$starter_site_data['capability'],
				$starter_site_data['menu_slug'],
				$starter_site_data['callback']
			);
		}

		$this->add_theme_page_for_tiob( $starter_site_data, 2 );
	}

	/**
	 * Legacy template cloud pages.
	 *
	 * @return false|void
	 */
	public function register_legacy_template_cloud_pages() {
		$icon        = 'data:image/svg+xml;base64,PHN2ZwogICAgICAgIHdpZHRoPSIxMDAiCiAgICAgICAgaGVpZ2h0PSIxMDAiCiAgICAgICAgdmlld0JveD0iMCAwIDEwMCAxMDAiCiAgICAgICAgZmlsbD0iI2YwZjBmMSIKICAgICAgICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCj4KICAgIDxwYXRoCiAgICAgICAgICAgIGQ9Ik05NS4wMjY0IDEwMEg0Ljk3MzU2QzIuMjI3OTcgMTAwIDAgOTcuNzcyIDAgOTUuMDI2NFY0Ljk3MzU2QzAgMi4yMjc5NyAyLjIyNzk3IDAgNC45NzM1NiAwSDk1LjAyNjRDOTcuNzcyIDAgMTAwIDIuMjI3OTcgMTAwIDQuOTczNTZWOTUuMDI2NEMxMDAgOTcuNzcyIDk3Ljc3MiAxMDAgOTUuMDI2NCAxMDBaIE04Mi42OTQxIDg2Ljc0NDhWMzAuODIwNVYxOC40NjUzSDcwLjM1MDJIMTQuNDE0NkwyNi43NTg0IDMwLjgyMDVINzAuMzUwMlY3NC40MDFMODIuNjk0MSA4Ni43NDQ4WiBNNDIuMjQxNiA1OC45MjkxTDQyLjI1MjggNzEuMTgzTDUzLjIzNTIgODIuMTY1M0w1My4xOTAyIDQ3Ljk4MDZMMTguOTk0MSA0Ny45MzU1TDI5Ljk3NjUgNTguOTA2Nkw0Mi4yNDE2IDU4LjkyOTFaIgogICAgICAgICAgICBmaWxsPSIjZjBmMGYxIgogICAgLz4KPC9zdmc+Cg==';
		$priority    = 61;  // The position of the menu item, 60 is the position of the Appearance menu.
		$plugin_page = 'tiob-plugin';

		$tpc_menu_page_data = array(
			'page_title' => __( 'Templates Cloud', 'templates-patterns-collection' ),
			'menu_title' => __( 'Templates Cloud', 'templates-patterns-collection' ),
			'capability' => 'manage_options',
			'menu_slug'  => $plugin_page,
			'callback'   => array(
				$this,
				'render_starter_sites',
			),
		);

		add_menu_page(
			$tpc_menu_page_data['page_title'],
			$tpc_menu_page_data['menu_title'],
			$tpc_menu_page_data['capability'],
			$tpc_menu_page_data['menu_slug'],
			$tpc_menu_page_data['callback'],
			$icon,
			$priority
		);

		if ( $this->is_library_disabled() && $this->is_starter_sites_disabled() ) {
			return false;
		}

		$library_data  = array(
			'parent_slug' => $plugin_page,
			'page_title'  => __( 'My Library', 'templates-patterns-collection' ),
			'menu_title'  => __( 'My Library', 'templates-patterns-collection' ),
			'capability'  => 'activate_plugins',
			'menu_slug'   => $plugin_page,
			'callback'    => $tpc_menu_page_data['callback'],
		);
		$settings_data = array(
			'parent_slug' => $plugin_page,
			'page_title'  => __( 'Settings', 'templates-patterns-collection' ),
			'menu_title'  => __( 'Settings', 'templates-patterns-collection' ),
			'capability'  => 'activate_plugins',
			'menu_slug'   => 'admin.php?page=' . $plugin_page . '#settings',
			'callback'    => '',
		);

		if ( $this->is_starter_sites_disabled() && ! $this->is_library_disabled() ) {
			$library_data['menu_slug'] = $plugin_page;
			$library_data['callback']  = array(
				$this,
				'render_starter_sites',
			);
			$this->add_subpage_for_tiob( $library_data );
			$this->add_subpage_for_tiob( $settings_data );
			return false;
		}
		$this->register_starter_sites_page();

		if ( $this->is_library_disabled() ) {
			return false;
		}
		$this->add_subpage_for_tiob( $library_data );
		$this->add_subpage_for_tiob( $settings_data );
	}

	/**
	 * Map license plan from Neve if available.
	 *
	 * @return int
	 */
	private function neve_license_plan() {
		$category = apply_filters( 'product_neve_license_plan', -1 );

		$category_mapping = License::NEVE_CATEGORY_MAPPING;

		return $category > -1 && isset( $category_mapping[ $category ] ) ? $category_mapping[ $category ] : -1;
	}

	/**
	 * Render method for the starter sites page.
	 */
	public function render_starter_sites() {
		echo '<div id="tpc-app"/>';
	}

	/**
	 * Render method for the onboarding page.
	 */
	public function render_onboarding() {
		echo '<div id="ob-app"/>';
	}

	/**
	 * Decide if the new onboarding should load
	 *
	 * @return bool
	 */
	private function should_load_onboarding() {
		if ( ! current_user_can( 'install_plugins' ) ) {
			return false;
		}

		if ( $this->is_starter_sites_disabled() ) {
			return false;
		}

		$current_theme = wp_get_theme();
		$template      = $current_theme->template === 'neve' ? $current_theme->template : $current_theme->parent();
		if ( $template !== 'neve' ) {
			return false;
		}

		$onboarding_done = get_option( 'tpc_onboarding_done', 'no' );
		if ( $onboarding_done === 'yes' ) {
			return false;
		}

		return get_option( 'tpc_obd_new_user', 'no' ) === 'yes';
	}

	/**
	 * Enqueue scripts and styles
	 *
	 * @return void
	 */
	public function enqueue() {
		$screen = get_current_screen();
		if ( ! isset( $screen->id ) ) {
			return;
		}

		if ( strpos( $screen->id, '_page_neve-onboarding' ) ) {

			wp_enqueue_media();

			$onboarding_dependencies = ( include TIOB_PATH . 'onboarding/build/index.asset.php' );
			wp_register_style( 'tiobObd', TIOB_URL . 'onboarding/build/style-index.css', array( 'wp-components' ), $onboarding_dependencies['version'] );
			wp_style_add_data( 'tiobObd', 'rtl', 'replace' );
			wp_enqueue_style( 'tiobObd' );

			wp_register_script( 'tiobObd', TIOB_URL . 'onboarding/build/index.js', array_merge( $onboarding_dependencies['dependencies'], array( 'updates', 'regenerator-runtime' ) ), $onboarding_dependencies['version'], true );
			wp_localize_script( 'tiobObd', 'tiobDash', apply_filters( 'neve_dashboard_page_data', $this->get_localization() ) );
			wp_enqueue_script( 'tiobObd' );

			wp_set_script_translations( 'tiobObd', 'templates-patterns-collection' );

			if ( ! empty( $this->google_fonts ) ) {
				$font_chunks = array_chunk( $this->google_fonts, absint( count( $this->google_fonts ) / 5 ) );
				foreach ( $font_chunks as $index => $fonts_chunk ) {
					wp_enqueue_style(
						'tiob-google-fonts-' . $index,
						'https://fonts.googleapis.com/css?family=' . implode( '|', $fonts_chunk ) . '&display=swap"',
						array(),
						$onboarding_dependencies['version']
					);
				}
			}
		}

		$is_tiob_page = strpos( $screen->id, '_page_tiob-plugin' ) !== false;
		if ( strpos( $screen->id, '_page_' . $this->page_slug ) === false && ! $is_tiob_page ) {
			return;
		}

		$dismiss_notice = isset( $_GET['dismiss_notice'] ) && $_GET['dismiss_notice'] === 'yes';
		if ( $dismiss_notice ) {
			update_option( self::VISITED_LIBRARY_OPT, 'yes' );
		}

		$dependencies = ( include TIOB_PATH . 'assets/build/app.asset.php' );

		wp_register_style( 'tiob', TIOB_URL . 'assets/build/style-app.css', array( 'wp-components' ), $dependencies['version'] );
		wp_style_add_data( 'tiob', 'rtl', 'replace' );
		wp_enqueue_style( 'tiob' );

		wp_register_script( 'tiob', TIOB_URL . 'assets/build/app.js', array_merge( $dependencies['dependencies'], array( 'updates', 'regenerator-runtime' ) ), $dependencies['version'], true );
		$tiob_dash = apply_filters( 'neve_dashboard_page_data', $this->get_localization() );
		if ( $is_tiob_page ) {
			$tiob_dash['hideStarterSites'] = true;
		}
		wp_localize_script( 'tiob', 'tiobDash', apply_filters( 'neve_dashboard_page_data', $tiob_dash ) );
		wp_enqueue_script( 'tiob' );

		wp_set_script_translations( 'tiob', 'templates-patterns-collection' );
	}

	/**
	 * Get localization data for the dashboard script.
	 *
	 * @return array
	 */
	private function get_localization() {
		$theme_name = apply_filters( 'ti_wl_theme_name', 'Neve' );
		$user       = wp_get_current_user();

		$neve_upgrade_link = 'https://themeisle.com/themes/neve/upgrade/';
		$upgrade_url       = apply_filters(
			'neve_upgrade_link_from_child_theme_filter',
			tsdk_translate_link( tsdk_utmify( $neve_upgrade_link, 'freevspro' ), 'query' )
		);
		$upgrade_url_tpc   = tsdk_translate_link( tsdk_utmify( 'https://themeisle.com/plugins/templates-cloud', 'tcupgrade' ), 'query' );
		if ( defined( 'NEVE_VERSION' ) ) {
			$upgrade_url_tpc = apply_filters(
				'neve_upgrade_link_from_child_theme_filter',
				tsdk_translate_link( tsdk_utmify( $neve_upgrade_link, 'templatecloud' ), 'query' )
			);
		}

		return array(
			'version'                       => TIOB_VERSION,
			'nonce'                         => wp_create_nonce( 'wp_rest' ),
			'assets'                        => TIOB_URL . 'assets/',
			'upgradeURL'                    => $upgrade_url,
			'upgradeURLTpc'                 => $upgrade_url_tpc,
			'siteUrl'                       => trailingslashit( get_site_url() ),
			'strings'                       => array(
				/* translators: %s - Theme name */
				'starterSitesTabDescription' => __( 'Choose from multiple unique demos, specially designed for you, that can be installed with a single click. You just need to choose your favorite, and we will take care of everything else.', 'templates-patterns-collection' ),
			),
			'cleanupAllowed'                => ( ! empty( get_transient( Active_State::STATE_NAME ) ) ) ? 'yes' : 'no',
			'onboarding'                    => array(),
			'hasFileSystem'                 => WP_Filesystem(),
			'themesURL'                     => admin_url( 'themes.php' ),
			'themeAction'                   => $this->get_theme_action(),
			'brandedTheme'                  => $this->get_whitelabel_name(),
			'hideStarterSites'              => $this->is_starter_sites_disabled(),
			'hideMyLibrary'                 => $this->is_library_disabled(),
			'fontParings'                   => $this->font_pairs_neve,
			'endpoint'                      => ( defined( 'TPC_TEMPLATES_CLOUD_ENDPOINT' ) ) ? TPC_TEMPLATES_CLOUD_ENDPOINT : self::get_templates_cloud_endpoint(),
			'params'                        => array(
				'site_url'   => get_site_url(),
				'license_id' => License::get_license_data()->key,
			),
			'upsellNotifications'           => $this->get_upsell_notifications(),
			'isValidLicense'                => $this->has_valid_addons(),
			'licenseTIOB'                   => License::get_license_data(),
			'emailSubscribe'                => array(
				'ajaxURL'    => esc_url( admin_url( 'admin-ajax.php' ) ),
				'nonce'      => wp_create_nonce( 'skip_subscribe_nonce' ),
				'skipStatus' => $this->get_skip_subscribe_status() ? 'yes' : 'no',
				'email'      => ( ! empty( $user->user_email ) ) ? $user->user_email : '',
			),
			'onboardingDone'                => array(
				'ajaxURL' => esc_url( admin_url( 'admin-ajax.php' ) ),
				'nonce'   => wp_create_nonce( 'onboarding_done_nonce' ),
			),
			'feedback'                      => array(
				'count'     => get_option( self::IMPORTED_TEMPLATES_COUNT_OPT, 0 ),
				'dismissed' => get_option( self::FEEDBACK_DISMISSED_OPT, false ),
			),
			'onboardingUpsell'              => array(
				'dashboard'    => tsdk_translate_link( tsdk_utmify( 'https://store.themeisle.com/', 'onboarding_upsell' ), 'query' ),
				'contact'      => tsdk_translate_link( tsdk_utmify( 'https://themeisle.com/contact/', 'onboarding_upsell' ), 'query' ),
				'upgrade'      => tsdk_translate_link( tsdk_utmify( 'https://themeisle.com/themes/neve/upgrade/', 'onboarding_upsell' ), 'query' ),
				'upgradeToast' => tsdk_translate_link( tsdk_utmify( 'https://themeisle.com/themes/neve/upgrade/', 'onboarding_toast' ), 'query' ),
			),
			'onboardingAllowed'             => $this->should_load_onboarding(),
			'onboardingRedirect'            => admin_url( 'admin.php?page=neve-onboarding' ),
			'tiobSettings'                  => admin_url( 'admin.php?page=tiob-plugin#settings' ),
			'links'                         => array(
				array(
					'label'       => __( 'Support', 'templates-patterns-collection' ),
					'is_external' => true,
					'url'         => tsdk_translate_link( tsdk_utmify( 'https://themeisle.com/contact/', 'settings_page' ), 'query' ),
				),
				array(
					'label'  => __( 'Feature request', 'templates-patterns-collection' ),
					'target' => '_self',
					'url'    => admin_url( 'admin.php?page=tiob-plugin&tab=feedback#settings' ),
				),
				array(
					'label'       => __( 'Leave a review', 'templates-patterns-collection' ),
					'is_external' => true,
					'url'         => 'https://wordpress.org/support/plugin/templates-patterns-collection/reviews/#new-post',
				),
				array(
					'label'     => __( 'Documentation', 'templates-patterns-collection' ),
					'url'       => tsdk_utmify( 'https://docs.themeisle.com/article/1354-neve-template-cloud-library', 'settings_page' ),
					'is_button' => true,
				),
			),
			'isFSETheme'                    => self::is_fse_theme(),
			'newTCNotice'                   => array(
				'show'    => get_option( self::TC_NEW_NOTICE_DISMISSED, 'no' ) !== 'yes' && self::has_legacy_template_cloud(),
				'ajaxURL' => esc_url( admin_url( 'admin-ajax.php' ) ),
				'nonce'   => wp_create_nonce( 'dismiss_new_tc_notice' ),
			),
			'onboardingPluginCompatibility' => array(
				'hyve-lite' => is_php_version_compatible( '8.1' ),
			),
		);
	}

	/**
	 * Check if the current theme is a FSE theme,
	 *
	 * @return bool
	 */
	public static function is_fse_theme() {
		if ( function_exists( 'wp_is_block_theme' ) ) {
			return (bool) wp_is_block_theme();
		}
		if ( function_exists( 'gutenberg_is_fse_theme' ) ) {
			return (bool) gutenberg_is_fse_theme();
		}

		return false;
	}

	/**
	 * Neve Pro upsells.
	 * @return array
	 */
	private function get_upsell_notifications() {

		$notifications['upsell_1'] = array(
			// We use these strings in Neve already so lets reuse the translations here.
			'text' => esc_html__( 'Purchase the Business plan or higher to get instant access to all Premium Starter Site Templates — including Expert Sites — and much more.', 'neve' ), //phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
			'cta'  => __( 'Get Neve Business', 'neve' ), //phpcs:ignore WordPress.WP.I18n.TextDomainMismatch
			'url'  => tsdk_utmify( 'https://themeisle.com/themes/neve/upgrade/', '<builder_name>notice', 'nevedashboard' ),
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
	 * Check if we can use the font pair to check for Google fonts.
	 *
	 * @param array $font_pair The font pair.
	 * @param string $key The key to check.
	 *
	 * @return bool
	 */
	private function font_array_key_is_defined( $font_pair, $key = 'bodyFont' ) {
		return isset( $font_pair[ $key ] ) && isset( $font_pair[ $key ]['fontSource'] ) && isset( $font_pair[ $key ]['font'] );
	}

	/**
	 * Check if the font pair is `Prata` and `Hanken Grotesk`.
	 *
	 * @param $font_pair
	 *
	 * @return bool
	 */
	private function is_font_prata_and_hanke( $font_pair ) {
		return $this->font_array_key_is_defined( $font_pair, 'bodyFont' ) && $this->font_array_key_is_defined( $font_pair, 'headingFont' ) && 'Prata' === $font_pair['headingFont']['font'] && 'Hanken Grotesk' === $font_pair['bodyFont']['font'];
	}

	/**
	 * Get the slug from the font pair.
	 *
	 * @param array $font_pair The font pair.
	 *
	 * @return string
	 */
	private function get_slug_from_font_pair( $font_pair ) {
		return strtolower( str_replace( ' ', '', $font_pair['headingFont']['font'] ) ) . '-' . strtolower( str_replace( ' ', '', $font_pair['bodyFont']['font'] ) );
	}

	/**
	 * Get font parings
	 */
	private function get_font_parings() {
		$font_pair_neve = array(
			array(
				'headingFont' => array(
					'font'        => 'Inter',
					'fontSource'  => 'Google',
					'previewSize' => '25px',
				),
				'bodyFont'    => array(
					'font'       => 'Inter',
					'fontSource' => 'Google',
				),
			),
			array(
				'headingFont' => array(
					'font'        => 'Playfair Display',
					'fontSource'  => 'Google',
					'previewSize' => '27px',
				),
				'bodyFont'    => array(
					'font'        => 'Source Sans Pro',
					'fontSource'  => 'Google',
					'previewSize' => '18px',
				),
			),
			array(
				'headingFont' => array(
					'font'       => 'Montserrat',
					'fontSource' => 'Google',
				),
				'bodyFont'    => array(
					'font'       => 'Open Sans',
					'fontSource' => 'Google',
				),
			),
			array(
				'headingFont' => array(
					'font'       => 'Nunito',
					'fontSource' => 'Google',
				),
				'bodyFont'    => array(
					'font'       => 'Lora',
					'fontSource' => 'Google',
				),
			),
			array(
				'headingFont' => array(
					'font'       => 'Lato',
					'fontSource' => 'Google',
				),
				'bodyFont'    => array(
					'font'       => 'Karla',
					'fontSource' => 'Google',
				),
			),
			array(
				'headingFont' => array(
					'font'        => 'Outfit',
					'fontSource'  => 'Google',
					'previewSize' => '25px',
				),
				'bodyFont'    => array(
					'font'       => 'Spline Sans',
					'fontSource' => 'Google',
				),
			),
			array(
				'headingFont' => array(
					'font'        => 'Lora',
					'fontSource'  => 'Google',
					'previewSize' => '25px',
				),
				'bodyFont'    => array(
					'font'       => 'Ubuntu',
					'fontSource' => 'Google',
				),
			),
			array(
				'headingFont' => array(
					'font'        => 'Prata',
					'fontSource'  => 'Google',
					'previewSize' => '25px',
				),
				'bodyFont'    => array(
					'font'        => 'Hanken Grotesk',
					'fontSource'  => 'Google',
					'previewSize' => '17px',
				),
			),
			array(
				'headingFont' => array(
					'font'        => 'Albert Sans',
					'fontSource'  => 'Google',
					'previewSize' => '25px',
				),
				'bodyFont'    => array(
					'font'        => 'Albert Sans',
					'fontSource'  => 'Google',
					'previewSize' => '17px',
				),
			),
			array(
				'headingFont' => array(
					'font'        => 'Fraunces',
					'fontSource'  => 'Google',
					'previewSize' => '25px',
				),
				'bodyFont'    => array(
					'font'        => 'Hanken Grotesk',
					'fontSource'  => 'Google',
					'previewSize' => '17px',
				),
			),
		);

		if ( class_exists( '\Neve\Core\Settings\Mods', false ) ) {
			$font_pair_neve = apply_filters(
				'neve_font_pairings',
				\Neve\Core\Settings\Mods::get( \Neve\Core\Settings\Config::MODS_TPOGRAPHY_FONT_PAIRS, \Neve\Core\Settings\Config::$typography_default_pairs )
			);
		}

		$index = 0;
		foreach ( $font_pair_neve as $font_pair ) {
			// limit the number of font pairs to first 5 and `Prata` and `Hanken Grotesk`.
			if ( $index > 4 && ! $this->is_font_prata_and_hanke( $font_pair ) ) {
				continue;
			}
			$slug                           = $this->get_slug_from_font_pair( $font_pair ) . '-' . $index;
			$this->font_pairs_neve[ $slug ] = $font_pair;

			if ( $this->font_array_key_is_defined( $font_pair, 'bodyFont' ) && 'Google' === $font_pair['bodyFont']['fontSource'] && ! in_array( $font_pair['bodyFont']['font'], $this->google_fonts, true ) ) {
				$this->google_fonts[] = $font_pair['bodyFont']['font'];
			}

			if ( $this->font_array_key_is_defined( $font_pair, 'headingFont' ) && 'Google' === $font_pair['headingFont']['fontSource'] && ! in_array( $font_pair['headingFont']['font'], $this->google_fonts, true ) ) {
				$this->google_fonts[] = $font_pair['headingFont']['font'];
			}

			$index++;
		}
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
			'logUrl'     => Logger::get_instance()->get_log_url(),
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
				if ( defined( 'TPC_REPLACE_API_SRC' ) && TPC_REPLACE_API_SRC === true ) {
					$api_src = defined( 'TPC_API_SRC' ) && ! empty( TPC_API_SRC ) ? TPC_API_SRC : self::API;

					if ( isset( $sites[ $builder ][ $slug ]['remote_url'] ) ) {
						$sites[ $builder ][ $slug ]['remote_url'] = str_replace( self::API, $api_src, $sites[ $builder ][ $slug ]['remote_url'] );
					}
					$sites[ $builder ][ $slug ]['screenshot'] = str_replace( self::API, $api_src, $sites[ $builder ][ $slug ]['screenshot'] );
				}
				if ( ! isset( $data['upsell'] ) || $data['upsell'] !== true ) {
					continue;
				}
				$sites[ $builder ][ $slug ]['utmOutboundLink'] = add_query_arg(
					apply_filters(
						'ti_onboarding_outbound_query_args',
						array(
							'utm_medium'   => 'about-' . get_template(),
							'utm_source'   => 'wpadmin',
							'utm_content'  => 'neve',
							'utm_campaign' => $slug,
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
	 * @return array|null
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
			'screenshot'          => TIOB_URL . 'migration/' . $folder_name . '/' . $data[ $old_theme ]['template'] . '.png',
			'template'            => TIOB_PATH . 'migration/' . $folder_name . '/' . $data[ $old_theme ]['template'] . '.json',
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
	 * @return string|bool
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
				sprintf( '<a href="https://docs.themeisle.com/article/1157-starter-sites-library-import-is-not-working#rest-api" target="_blank" rel="external noreferrer noopener">%1$s<i class="dashicons dashicons-external"></i></a>', __( 'here', 'templates-patterns-collection' ) )
			),
			'error_report'                => sprintf(
			/* translators: 1 - 'get in touch'. */
				__( 'Hi! It seems there is a configuration issue with your server that\'s causing the import to fail. Please %1$s with us with the error code below, so we can help you fix this.', 'templates-patterns-collection' ),
				sprintf( '<a href="https://themeisle.com/contact" target="_blank" rel="external noreferrer noopener">%1$s <i class="dashicons dashicons-external"></i></a>', __( 'get in touch', 'templates-patterns-collection' ) )
			),
			'troubleshooting'             => sprintf(
			/* translators: 1 - 'troubleshooting guide'. */
				__( 'Hi! It seems there is a configuration issue with your server that\'s causing the import to fail. Take a look at our %1$s to see if any of the proposed solutions work.', 'templates-patterns-collection' ),
				sprintf( '<a href="https://docs.themeisle.com/article/1157-starter-sites-library-import-is-not-working" target="_blank" rel="external noreferrer noopener">%1$s <i class="dashicons dashicons-external"></i></a>', __( 'troubleshooting guide', 'templates-patterns-collection' ) )
			),
			'support'                     => sprintf(
			/* translators: 1 - 'get in touch'. */
				__( 'If none of the solutions in the guide work, please %1$s with us with the error code below, so we can help you fix this.', 'templates-patterns-collection' ),
				sprintf( '<a href="https://themeisle.com/contact" target="_blank" rel="external noreferrer noopener">%1$s <i class="dashicons dashicons-external"></i></a>', __( 'get in touch', 'templates-patterns-collection' ) )
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

	/**
	 * Get logs from transient via ajax.
	 */
	public function external_get_logs() {

		$nonce = $_POST['nonce'];

		if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			wp_die( __( 'Nonce verification failed', 'templates-patterns-collection' ) );
		}

		$data = get_transient( Logger::$log_transient_name );

		if ( ! empty( $data ) ) {
			echo $data;
			wp_die();
		}

		wp_die( __( 'No logs found', 'templates-patterns-collection' ) );
	}

	private function get_prefix_for_menu_item() {
		$style = 'display:inline-block;';

		if ( ! is_rtl() ) {
			$style .= 'transform:scaleX(-1);margin-right:5px;';
		} else {
			$style .= 'margin-left:5px;';
		}

		$prefix = defined( 'NEVE_VERSION' ) ? '<span style="' . esc_attr( $style ) . '">&crarr;</span>' : '';

		return $prefix;
	}
}
