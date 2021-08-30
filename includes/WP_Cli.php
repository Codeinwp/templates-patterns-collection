<?php
/**
 * WP CLI commands.
 *
 * Author:          Andrei Baicus <andrei@themeisle.com>
 * Created on:      26/06/2019
 *
 * @package         templates-patterns-collection
 */

namespace TIOB;

use TIOB\Importers\Content_Importer;
use TIOB\Importers\Helpers\Helper;
use TIOB\Importers\Plugin_Importer;
use TIOB\Importers\Theme_Mods_Importer;
use TIOB\Importers\Widgets_Importer;

/**
 * Class WP_Cli
 */
class WP_Cli {
	use Helper;

	/**
	 * Command namespace version.
	 *
	 * @var string Version string.
	 */
	const CLI_NAMESPACE = 'themeisle-si';
	/**
	 * List of commands.
	 *
	 * @var array List of REST controllers.
	 */
	private $commands = array(
		'import'     => 'import',
		'list_sites' => 'list',
	);

	/**
	 * All sites data.
	 *
	 * @var array
	 */
	private $data = array();

	/**
	 * Theme mods importer.
	 *
	 * @var Theme_Mods_Importer
	 */
	private $theme_mods_importer;

	/**
	 * Content importer.
	 *
	 * @var Content_Importer
	 */
	private $content_importer;

	/**
	 * Widgets importer.
	 *
	 * @var Widgets_Importer
	 */
	private $widgets_importer;

	/**
	 * Plugins importer.
	 *
	 * @var Plugin_Importer
	 */
	private $plugin_importer;

	/**
	 * Setup class props.
	 */
	private function setup_props() {
		$theme_support             = get_theme_support( 'themeisle-demo-import' );
		$this->data                = $theme_support[0]['remote'];
		$this->theme_mods_importer = new Theme_Mods_Importer();
		$this->content_importer    = new Content_Importer();
		$this->widgets_importer    = new Widgets_Importer();
		$this->plugin_importer     = new Plugin_Importer();
	}

	/**
	 * Load the WP CLI commands.
	 */
	public function load_commands() {
		foreach ( $this->commands as $callback => $command ) {
			try {
				\WP_CLI::add_command( self::CLI_NAMESPACE . ' ' . $command, array( $this, $callback ) );
			} catch ( \Exception $e ) {
				error_log( 'Error loading cli commnands' . $e->getMessage() );
			}
		}
	}

	/**
	 * Get all sites as (string) $slug => (array) $args
	 *
	 * @param string $builder what editor to get sites for.
	 *
	 * @return array
	 */
	private function get_all_sites( $builder = false ) {
		$this->setup_props();
		$all_sites = array();

		foreach ( $this->data as $editor => $sites ) {

			if ( $builder !== false && strpos( $editor, $builder ) === false ) {
				continue;
			}
			foreach ( $sites as $slug => $data ) {
				$this->data[ $editor ][ $slug ]['slug']   = $slug;
				$this->data[ $editor ][ $slug ]['editor'] = $editor;
				$all_sites[ $slug ]                       = $this->data[ $editor ][ $slug ];
			}
		}

		return $all_sites;
	}

	/**
	 * Import single starter site.
	 *
	 * ## OPTIONS
	 *
	 * <slug>
	 * : The slug of the starter site to import. T
	 *
	 *
	 * ## EXAMPLES
	 *
	 *     wp themeisle-si import neve-restaurant
	 *
	 * @param array $args inline args.
	 * @param array $assoc_args associative args.
	 *
	 */
	public function import( $args, $assoc_args ) {
		$this->setup_props();

		$sites     = $this->get_all_sites();
		$site_slug = $args[0];
		if ( ! array_key_exists( $site_slug, $sites ) ) {
			\WP_CLI::warning( "No site to import with the slug ${site_slug}." );

			return;
		}

		$site = $sites[ $site_slug ];

		$json_array = $this->get_starter_site_json( $site );
		$this->import_plugins_for_starter_site( $json_array );
		$xml = $this->get_starter_site_xml( $site, $json_array );
		\WP_CLI::line( 'Importing content file...' );
		$this->import_xml_file( $xml, array_merge( array( 'demoSlug' => $site_slug ), $json_array ), $site['editor'] );
		\WP_CLI::line( 'Done!' );
		$this->import_theme_mods( $json_array );
		$this->setup_pages( $json_array, $args[0] );
		$this->import_widgets( $json_array );
	}

	/**
	 * Import widgets
	 *
	 * @param array $json site json data.
	 */
	private function import_widgets( $json ) {
		if ( ! isset( $json['widgets'] ) || empty( $json['widgets'] ) ) {
			return;
		}
		$this->widgets_importer->actually_import( $json['widgets'] );
	}

	/**
	 * Setup pages
	 *
	 * @param array $json site json data.
	 * @param string $demo_slug the demo slug.
	 */
	private function setup_pages( $json, $demo_slug ) {
		if ( isset( $json['front_page'] ) ) {
			$this->content_importer->setup_front_page( $json['front_page'], $demo_slug );
		} else {
			\WP_CLI::warning( 'Incorrect front page arguments.' );
		}

		if ( isset( $json['shop_pages'] ) ) {
			$this->content_importer->setup_shop_pages( $json['shop_pages'], $demo_slug );
		} else {
			\WP_CLI::warning( 'No shop page arguments.' );
		}
	}

	/**
	 * Import theme mods
	 *
	 * @param array $json site json data.
	 */
	private function import_theme_mods( $json ) {

		if ( isset( $json['theme_mods'] ) && ! empty( $json['theme_mods'] ) ) {
			array_walk(
				$json['theme_mods'],
				function ( &$item ) {
					$item = $this->replace_image_urls( $item );
				}
			);

			foreach ( $json['theme_mods'] as $key => $value ) {
				if ( $key === '__ti_import_menus_location' ) {
					continue;
				}
				if ( $value === 'true' ) {
					$value = true;
				}

				if ( $value === 'false' ) {
					$value = false;
				}

				set_theme_mod( $key, $value );
			}
		}

		if ( isset( $json['wp_options'] ) && ! empty( $json['wp_options'] ) ) {
			foreach ( $json['wp_options'] as $key => $value ) {
				if ( $value === 'true' ) {
					$value = true;
				}

				if ( $value === 'false' ) {
					$value = false;
				}
				update_option( $key, $value );
			}
		}

		// Set nav menu locations.
		if ( isset( $json['theme_mods']['__ti_import_menus_location'] ) ) {
			$this->theme_mods_importer->setup_nav_menus( $json['theme_mods']['__ti_import_menus_location'] );
		}
		\WP_CLI::success( 'Theme mods imported.' );
	}

	/**
	 * Import XML file
	 *
	 * @param string $path XML file path.
	 * @param array $json json data for site.
	 * @param string $editor page builder.
	 */
	private function import_xml_file( $path, $json, $editor ) {
		if ( ! file_exists( $path ) || ! is_readable( $path ) ) {
			\WP_CLI::warning( "Cannot import XML file. Either the file is not readable or it does not exist (${path})" );
		}
		$this->content_importer->import_file( $path, $json, $editor );
		$this->content_importer->maybe_bust_elementor_cache();
		\WP_CLI::success( 'Content imported.' );
	}

	/**
	 * Installs and activates all mandatory and recommended plugins.
	 *
	 * @param array $json_data site json data.
	 */
	private function import_plugins_for_starter_site( $json_data ) {
		require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
		require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader-skin.php';
		require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
		require_once ABSPATH . 'wp-admin/includes/class-plugin-upgrader.php';

		$all_plugins = array();

		if ( isset( $json_data['recommended_plugins'] ) ) {
			$all_plugins = array_merge( $all_plugins, array_keys( $json_data['recommended_plugins'] ) );
		}

		if ( isset( $json_data['mandatory_plugins'] ) ) {
			$all_plugins = array_merge( $all_plugins, array_keys( $json_data['mandatory_plugins'] ) );
		}

		$all_plugins = array_combine( $all_plugins, $all_plugins );
		$all_plugins = array_fill_keys( $all_plugins, true );

		\WP_CLI::line( 'Installing...' );
		\WP_CLI::print_value( $all_plugins );

		$this->plugin_importer->run_plugins_install( $all_plugins );

		\WP_CLI::success( 'Plugins installed and activated' );
	}

	/**
	 * Lists starter sites.
	 *
	 * ## OPTIONS
	 *
	 * [--field=<field>]
	 * : Which field to list.
	 * ---
	 * default: null
	 * options:
	 *   - slug
	 *   - editor
	 *   - source
	 *   - title
	 *   - url
	 * ---
	 *
	 * [--editor=<editor>]
	 * : For which editor to list.
	 * ---
	 * default: null
	 * options:
	 *   - gutenberg
	 *   - elementor
	 *   - beaver
	 *   - brizy
	 *   - divi
	 *   - thrive
	 * ---
	 *
	 * [--show-url=<bool>]
	 * : Should display URLs (true / false).
	 * ---
	 * default: false
	 * options:
	 *   - true
	 *   - false
	 * ---
	 *
	 * ## EXAMPLES
	 *
	 *     wp ti-starter-sites list --source=local --show-url=false
	 *
	 * @param array $args inline args.
	 * @param array $assoc_args associative args.
	 *
	 */
	public function list_sites( $args, $assoc_args ) {
		$fields = array(
			'title',
			'slug',
			'editor',
		);

		if ( $assoc_args['show-url'] === 'true' ) {
			$fields[] = 'url';
		}

		$filtered_by_editor = $assoc_args['editor'] !== null;

		$sites = $filtered_by_editor ? $this->get_all_sites( $assoc_args['editor'] ) : $this->get_all_sites();

		if ( $assoc_args['field'] ) {
			if ( in_array( $assoc_args['field'], $fields, true ) ) {
				$formatter = new \WP_CLI\Formatter( $assoc_args, null );
				$formatter->display_items( $sites, array( $assoc_args['field'] ) );
			} else {
				\WP_CLI::error( 'Error' );
			}

			return;
		}

		\WP_CLI\Utils\format_items( 'table', $sites, $fields );
	}

	/**
	 * Get the starter site XML.
	 *
	 * @param array $site site data array.
	 * @param array $json site json data.
	 *
	 * @return string
	 */
	private function get_starter_site_xml( $site, $json ) {
		set_time_limit( 0 );
		\WP_CLI::line( 'Saving... ' . $json['content_file'] );
		$response_file     = wp_remote_get( $json['content_file'] );
		$content_file_path = $this->content_importer->save_xhr_return_path( wp_remote_retrieve_body( $response_file ) );
		\WP_CLI::line( 'Saved content file in ' . $content_file_path );

		return $content_file_path;
	}

	/**
	 * Get starter site JSON.
	 *
	 * @param array $site site data array.
	 *
	 * @return array
	 */
	private function get_starter_site_json( $site ) {
		$request       = wp_remote_get( $site['url'] . 'wp-json/ti-demo-data/data' );
		$response_code = wp_remote_retrieve_response_code( $request );
		if ( $response_code !== 200 || empty( $request['body'] ) || ! isset( $request['body'] ) ) {
			\WP_CLI::warning( 'Cannot get site json data.' );
		}

		$json = json_decode( $request['body'], true );

		return $json;
	}
}

$ti_ob_cli = new WP_Cli();
$ti_ob_cli->load_commands();

