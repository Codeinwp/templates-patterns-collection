<?php
/**
 * The cleanup manager.
 *
 * Used to manage all cleanup actions.
 *
 * @package    templates-patterns-collection
 */
namespace TIOB\Importers\Cleanup;

use TIOB\Importers\Plugin_Importer;

/**
 * Class Manager
 * @package TIOB\Importers\Cleanup
 */
class Manager {

	/**
	 * Main
	 *
	 * @var Manager
	 */
	protected static $instance = null;

	/**
	 * Instantiate the class.
	 *
	 * @static
	 * @return Manager
	 * @since  1.0.0
	 * @access public
	 */
	final public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
			self::$instance->init();
		}

		return self::$instance;
	}

	/**
	 * Do init actions.
	 */
	private function init() {}

	/**
	 * Uninstall Plugin method.
	 *
	 * @param string $plugin The plugin file path.
	 * @return bool
	 */
	private function uninstall_plugin( $plugin ) {
		require_once( ABSPATH . '/wp-admin/includes/file.php' );
		global $wp_filesystem;
		WP_Filesystem();
		if ( is_plugin_active( $plugin ) ) {
			deactivate_plugins( $plugin, true );
		}

		if ( is_uninstallable_plugin( $plugin ) ) {
			uninstall_plugin( $plugin );
		}
		$plugins_dir     = $wp_filesystem->wp_plugins_dir();
		$plugins_dir     = trailingslashit( $plugins_dir );
		$this_plugin_dir = trailingslashit( dirname( $plugins_dir . $plugin ) );

		if ( strpos( $plugin, '/' ) && $this_plugin_dir != $plugins_dir ) {
			$deleted = $wp_filesystem->delete( $this_plugin_dir, true );
		} else {
			$deleted = $wp_filesystem->delete( $plugins_dir . $plugin );
		}
		return $deleted;
	}

	/**
	 * Returns plugin key from slug.
	 *
	 * @param string $plugin_slug The plugin slug.
	 * @param array $plugin_list The plugin list.
	 * @return string
	 */
	private function get_plugin_key_by_slug( $plugin_slug, $plugin_list ) {
		foreach ( $plugin_list as $key => $data ) {
			$parts = explode( '/', $key );

			if ( isset( $parts[0] ) && $parts[0] === $plugin_slug ) {
				return $key;
			}
		}
		return '';
	}

	/**
	 * Handles plugin cleanup.
	 * @param array $state The cleanup state.
	 */
	private function cleanup_plugins( $state ) {
		if ( isset( $state[ Active_State::PLUGINS_NSP ] ) ) {
			$plugin_list = get_plugins();
			foreach ( $state[ Active_State::PLUGINS_NSP ] as $plugin_slug => $info ) {
				if ( $plugin_slug === Plugin_Importer::OPTIMOLE_SLUG ) {
					return;
				}

				$plugin = $this->get_plugin_key_by_slug( $plugin_slug, $plugin_list );
				if ( empty( $plugin ) ) {
					continue;
				}
				$this->uninstall_plugin( $plugin );
				if ( $plugin_slug === 'woocommerce' ) {
					// Remove WooCommerce Pages.
					wp_delete_post( get_option( 'woocommerce_shop_page_id' ), true );
					wp_delete_post( get_option( 'woocommerce_cart_page_id' ), true );
					wp_delete_post( get_option( 'woocommerce_checkout_page_id' ), true );
					wp_delete_post( get_option( 'woocommerce_myaccount_page_id' ), true );
					wp_delete_post( get_option( 'woocommerce_edit_address_page_id' ), true );
					wp_delete_post( get_option( 'woocommerce_view_order_page_id' ), true );
					wp_delete_post( get_option( 'woocommerce_change_password_page_id' ), true );
					wp_delete_post( get_option( 'woocommerce_logout_page_id' ), true );
				}
			}
		}
	}

	/**
	 * Handles category cleanup.
	 * @param array $state The cleanup state.
	 */
	private function cleanup_category( $state ) {
		if ( isset( $state[ Active_State::CATEGORY_NSP ] ) ) {
			foreach ( $state[ Active_State::CATEGORY_NSP ] as $category_id ) {
				wp_delete_category( $category_id );
			}
		}
	}

	/**
	 * Handles terms cleanup.
	 * @param array $state The cleanup state.
	 */
	private function cleanup_terms( $state ) {
		if ( isset( $state[ Active_State::TERMS_NSP ] ) ) {
			foreach ( $state[ Active_State::TERMS_NSP ] as $term_data ) {
				wp_delete_term( $term_data['id'], $term_data['taxonomy'] );
			}
		}
		if ( isset( $state[ Active_State::TAGS_NSP ] ) ) {
			foreach ( $state[ Active_State::TAGS_NSP ] as $id ) {
				wp_delete_term( $id, 'post_tag' );
			}
		}
	}

	/**
	 * Handles posts cleanup.
	 * @param array $state The cleanup state.
	 */
	private function cleanup_posts( $state ) {
		if ( isset( $state[ Active_State::POSTS_NSP ] ) ) {
			foreach ( $state[ Active_State::POSTS_NSP ] as $post_id ) {
				wp_delete_post( $post_id, true );
			}
		}
		if ( isset( $state[ Active_State::COMMENTS_NSP ] ) ) {
			foreach ( $state[ Active_State::COMMENTS_NSP ] as $comment_id ) {
				wp_delete_comment( $comment_id, true );
			}
		}
	}

	/**
	 * Handles attachments cleanup.
	 * @param array $state The cleanup state.
	 */
	private function cleanup_attachments( $state ) {
		if ( isset( $state[ Active_State::ATTACHMENT_NSP ] ) ) {
			foreach ( $state[ Active_State::ATTACHMENT_NSP ] as $post_id ) {
				wp_delete_attachment( $post_id, true );
			}
		}
	}

	/**
	 * Handles theme mods cleanup.
	 * @param array $state The cleanup state.
	 */
	private function cleanup_theme_mods( $state ) {
		if ( isset( $state[ Active_State::THEME_MODS_NSP ] ) ) {
			foreach ( $state[ Active_State::THEME_MODS_NSP ] as $theme_mod ) {
				if ( empty( $theme_mod['value'] ) ) {
					remove_theme_mod( $theme_mod['mod'] );
					continue;
				}
				set_theme_mod( $theme_mod['mod'], $theme_mod['value'] );
			}
		}
	}

	/**
	 * Handles menu cleanup.
	 * @param array $state The cleanup state.
	 */
	private function cleanup_menus( $state ) {
		if ( isset( $state[ Active_State::MENUS_NSP ] ) ) {
			set_theme_mod( 'nav_menu_locations', $state[ Active_State::MENUS_NSP ] );
		}
	}

	/**
	 * Handles widget cleanup.
	 * @param array $state The cleanup state.
	 */
	private function cleanup_widgets( $state ) {
		if ( isset( $state[ Active_State::WIDGETS_NSP ] ) ) {
			foreach ( $state[ Active_State::WIDGETS_NSP ] as $widget ) {
				if ( empty( $widget['value'] ) ) {
					delete_option( $widget['id'] );
					continue;
				}
				update_option( $widget['id'], $widget['value'] );
			}
		}
	}

	/**
	 * Handles other options cleanup.
	 * @param array $state The cleanup state.
	 */
	private function cleanup_options( $namespace, $state ) {
		if ( isset( $state[ $namespace ] ) ) {
			foreach ( $state[ $namespace ] as $option => $value ) {
				if ( empty( $value ) ) {
					delete_option( $option );
					continue;
				}
				update_option( $option, $value );
			}
		}
	}

	final public function do_cleanup() {
		$active_state = new Active_State();
		$state        = $active_state->get();

		$this->cleanup_theme_mods( $state );
		$this->cleanup_menus( $state );
		$this->cleanup_category( $state );
		$this->cleanup_terms( $state );
		$this->cleanup_options( Active_State::FRONT_PAGE_NSP, $state );
		$this->cleanup_options( Active_State::SHOP_PAGE_NSP, $state );
		$this->cleanup_posts( $state );
		$this->cleanup_attachments( $state );
		$this->cleanup_widgets( $state );
		$this->cleanup_plugins( $state );

		return delete_transient( Active_State::STATE_NAME );
	}
}
