<?php
/**
 * The cleanup manager.
 *
 * Used to manage all cleanup actions.
 *
 * @package    templates-patterns-collection
 */
namespace TIOB\Importers\Cleanup;

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

	final public function uninstall_plugin( $plugin ) {
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

	private function get_plugin_key_by_slug( $plugin_slug, $plugin_list ) {
		foreach ( $plugin_list as $key => $data ) {
			if ( isset( $data['Name'] ) && sanitize_title( $data['Name'] ) === $plugin_slug ) {
				return $key;
			}
		}
		return '';
	}

	private function cleanup_plugins( $state ) {
		if ( isset( $state[ Active_State::POSTS_NSP ] ) ) {
			$plugin_list = get_plugins();
			foreach ( $state[ Active_State::POSTS_NSP ] as $plugin_slug => $info ) {
				$plugin = $this->get_plugin_key_by_slug( $plugin_slug, $plugin_list );
				if ( empty( $plugin ) ) {
					continue;
				}
				$this->uninstall_plugin( $plugin );
				error_log( 'Plugin uninstalled: ' . $plugin );
			}
		}
	}

	private function cleanup_category( $state ) {
		if ( isset( $state[ Active_State::CATEGORY_NSP ] ) ) {
			foreach ( $state[ Active_State::CATEGORY_NSP ] as $category_id ) {
				wp_delete_category( $category_id );
				error_log( 'Category removed: ' . $category_id );
			}
		}
	}

	private function cleanup_terms( $state ) {
		if ( isset( $state[ Active_State::TERMS_NSP ] ) ) {
			foreach ( $state[ Active_State::TERMS_NSP ] as $term_data ) {
				wp_delete_term( $term_data['id'], $term_data['taxonomy'] );
				error_log( 'Term removed: ' . $term_data['id'] . ' as ' . $term_data['taxonomy'] );
			}
		}
		if ( isset( $state[ Active_State::TAGS_NSP ] ) ) {
			foreach ( $state[ Active_State::TAGS_NSP ] as $id ) {
				wp_delete_term( $id, 'post_tag' );
				error_log( 'Tag removed: ' . $id . ' as ' . 'post_tag' );
			}
		}
	}

	private function cleanup_posts( $state ) {
		if ( isset( $state[ Active_State::POSTS_NSP ] ) ) {
			foreach ( $state[ Active_State::POSTS_NSP ] as $post_id ) {
				wp_delete_post( $post_id, true );
				error_log( 'Post removed: ' . $post_id );
			}
		}
	}

	final public function do_cleanup() {
		$active_state = new Active_State();
		$state        = $active_state->get();

		$this->cleanup_plugins( $state );
		$this->cleanup_category( $state );
		$this->cleanup_terms( $state );
		$this->cleanup_posts( $state );

		//delete_transient( Active_State::STATE_NAME );

		return true;
	}
}
