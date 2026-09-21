<?php
/**
 * Starter sites abilities (WordPress Abilities API).
 *
 * Thin wrappers over the existing importer: the sites catalogue registered by
 * Sites_Listing, the REST handlers in Rest_Server and the cleanup state kept by
 * Active_State.
 *
 * @package         templates-patterns-collection
 */

namespace TIOB\Abilities;

use TIOB\Importers\Cleanup\Active_State;
use TIOB\Importers\Helpers\Slug_Mapping;
use TIOB\Logger;
use TIOB\Rest_Server;
use TIOB\Sites_Listing;
use TIOB\White_Label_Config;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Class Starter_Sites
 */
class Starter_Sites {
	use White_Label_Config;

	/**
	 * Ability category slug.
	 */
	const CATEGORY = 'starter-sites';

	/**
	 * Capability checked by the starter sites REST routes (see Rest_Server).
	 */
	const CAPABILITY = 'manage_options';

	/**
	 * Maximum number of log lines returned by the import status.
	 */
	const MAX_LOG_LINES = 500;

	/**
	 * Import steps, in the order the import modal runs them.
	 */
	const IMPORT_STEPS = array( 'plugins', 'content', 'theme_mods', 'widgets' );

	/**
	 * Hook the registration callbacks.
	 *
	 * @return void
	 */
	public function init() {
		if ( ! function_exists( 'wp_register_ability' ) ) {
			return;
		}

		add_action( 'wp_abilities_api_categories_init', array( $this, 'register_category' ) );
		add_action( 'wp_abilities_api_init', array( $this, 'register_abilities' ) );
		// Late, so ids already provided by Neve Pro are left alone.
		add_action( 'wp_abilities_api_init', array( $this, 'register_aliases' ), 999 );
	}

	/**
	 * Register the ability category.
	 *
	 * @return void
	 */
	public function register_category() {
		if ( ! function_exists( 'wp_register_ability_category' ) ) {
			return;
		}

		wp_register_ability_category(
			self::CATEGORY,
			array(
				'label'       => __( 'Starter Sites', 'templates-patterns-collection' ),
				'description' => __( 'List, import and revert starter sites.', 'templates-patterns-collection' ),
			)
		);
	}

	/**
	 * Register the abilities.
	 *
	 * @return void
	 */
	public function register_abilities() {
		foreach ( $this->get_definitions() as $definition ) {
			wp_register_ability( $definition['id'], $definition['args'] );
		}
	}

	/**
	 * Register the legacy `neve/*` ids as aliases of the abilities above.
	 *
	 * @return void
	 */
	public function register_aliases() {
		foreach ( $this->get_definitions() as $definition ) {
			if ( empty( $definition['alias'] ) ) {
				continue;
			}
			if ( function_exists( 'wp_has_ability' ) && wp_has_ability( $definition['alias'] ) ) {
				continue;
			}
			wp_register_ability( $definition['alias'], $definition['args'] );
		}
	}

	/**
	 * Ability definitions.
	 *
	 * @return array
	 */
	private function get_definitions() {
		$builders = array( 'gutenberg', 'elementor', 'beaver', 'brizy' );

		return array(
			array(
				'id'    => 'starter-sites/list',
				'alias' => 'neve/starter-site-list',
				'args'  => array(
					'label'               => __( 'List starter sites', 'templates-patterns-collection' ),
					'description'         => __( 'List the available starter sites with their slug, builder, required plugins, preview and license tier. Optionally filter by search query or builder.', 'templates-patterns-collection' ),
					'category'            => self::CATEGORY,
					'input_schema'        => array(
						'type'       => 'object',
						'properties' => array(
							'query'   => array(
								'type'        => 'string',
								'description' => 'Filter by title/slug substring.',
							),
							'builder' => array(
								'type'        => 'string',
								'enum'        => $builders,
								'description' => 'Filter by page builder.',
							),
							'noop'    => array(
								'type'        => 'boolean',
								'description' => 'Optional compatibility flag; ignored.',
							),
						),
					),
					'output_schema'       => array(
						'type'       => 'object',
						'properties' => array(
							'sites'       => array(
								'type'  => 'array',
								'items' => array(
									'type'       => 'object',
									'properties' => array(
										'slug'             => array( 'type' => 'string' ),
										'title'            => array( 'type' => 'string' ),
										'builder'          => array( 'type' => 'string' ),
										'required_plugins' => array(
											'type'  => 'array',
											'items' => array( 'type' => 'string' ),
										),
										'preview_url'      => array( 'type' => 'string' ),
										'license_tier'     => array( 'type' => 'string' ),
										'locked'           => array( 'type' => 'boolean' ),
									),
								),
							),
							'upgrade_url' => array(
								'type'        => 'string',
								'description' => 'Where to upgrade to unlock the locked sites. Present only when at least one listed site is locked.',
							),
						),
					),
					'execute_callback'    => array( $this, 'list_sites' ),
					'permission_callback' => array( $this, 'check_permission' ),
					'meta'                => $this->get_meta( true, false, true ),
				),
			),
			array(
				'id'    => 'starter-sites/import',
				'alias' => 'neve/starter-site-import',
				'args'  => array(
					'label'               => __( 'Import a starter site', 'templates-patterns-collection' ),
					'description'         => __( 'Import a starter site by slug: installs required plugins, imports content, theme settings and widgets. This replaces significant parts of the site. Set confirm=true to proceed, or dry_run=true to inspect the import plan first. Each call runs one import step: while done is false, call again with the same input plus the returned cursor.', 'templates-patterns-collection' ),
					'category'            => self::CATEGORY,
					'input_schema'        => array(
						'type'       => 'object',
						'required'   => array( 'slug' ),
						'properties' => array(
							'slug'         => array(
								'type'        => 'string',
								'description' => 'The starter site slug (see starter-sites/list).',
							),
							'builder'      => array(
								'type'        => 'string',
								'enum'        => $builders,
								'description' => 'Constrain to a builder when slugs collide.',
							),
							'with_plugins' => array(
								'type'        => 'boolean',
								'default'     => true,
								'description' => 'Install the required and recommended plugins of the site.',
							),
							'confirm'      => array(
								'type'        => 'boolean',
								'default'     => false,
								'description' => 'Must be true to run the import.',
							),
							'dry_run'      => array(
								'type'        => 'boolean',
								'default'     => false,
								'description' => 'Return the resolved site and import plan without changing the site.',
							),
							'cursor'       => array(
								'type'        => 'string',
								'description' => 'Cursor returned by the previous call; the import continues from that step. Leave empty to start.',
							),
							'time_budget'  => array(
								'type'        => 'integer',
								'minimum'     => 1,
								'maximum'     => 60,
								'default'     => 20,
								'description' => 'Seconds to spend per call. An import step cannot be interrupted, so every call runs exactly one step.',
							),
						),
					),
					'output_schema'       => array(
						'type'       => 'object',
						'properties' => array(
							'success'           => array( 'type' => 'boolean' ),
							'dry_run'           => array( 'type' => 'boolean' ),
							'imported'          => array( 'type' => 'boolean' ),
							'slug'              => array( 'type' => 'string' ),
							'builder'           => array( 'type' => 'string' ),
							'plugins_installed' => array(
								'type'  => 'array',
								'items' => array( 'type' => 'string' ),
							),
							'plugins_planned'   => array(
								'type'  => 'array',
								'items' => array( 'type' => 'string' ),
							),
							'front_page_url'    => array( 'type' => 'string' ),
							'steps'             => array(
								'type'                 => 'object',
								'additionalProperties' => true,
							),
							'done'              => array( 'type' => 'boolean' ),
							'cursor'            => array( 'type' => 'string' ),
							'progress'          => array(
								'type'       => 'object',
								'properties' => array(
									'current' => array( 'type' => 'integer' ),
									'total'   => array( 'type' => 'integer' ),
									'message' => array( 'type' => 'string' ),
								),
							),
						),
					),
					'execute_callback'    => array( $this, 'import_site' ),
					'permission_callback' => array( $this, 'check_permission' ),
					'meta'                => array_merge(
						$this->get_meta( false, true, false ),
						array(
							'ai_connect' => false,
							'task'       => array(
								'mode'        => 'cursor',
								'results_key' => 'steps',
							),
						)
					),
				),
			),
			array(
				'id'    => 'starter-sites/cleanup',
				'alias' => 'neve/starter-site-cleanup',
				'args'  => array(
					'label'               => __( 'Clean up a starter site import', 'templates-patterns-collection' ),
					'description'         => __( 'Revert the recorded starter site import: removes the imported content, attachments, terms and plugins, and restores the previous theme settings, menus and widgets. Only resources recorded during the import are touched.', 'templates-patterns-collection' ),
					'category'            => self::CATEGORY,
					'input_schema'        => array(
						'type'       => 'object',
						'properties' => array(
							'confirm' => array(
								'type'        => 'boolean',
								'default'     => false,
								'description' => 'Must be true to proceed.',
							),
						),
					),
					'output_schema'       => array(
						'type'       => 'object',
						'properties' => array(
							'success'  => array( 'type' => 'boolean' ),
							'reverted' => array( 'type' => 'boolean' ),
						),
					),
					'execute_callback'    => array( $this, 'cleanup' ),
					'permission_callback' => array( $this, 'check_permission' ),
					'meta'                => array_merge( $this->get_meta( false, true, false ), array( 'ai_connect' => false ) ),
				),
			),
			array(
				'id'   => 'starter-sites/import-status',
				'args' => array(
					'label'               => __( 'Get the starter site import status', 'templates-patterns-collection' ),
					'description'         => __( 'Report the recorded state of the last starter site import: which resources were created or changed, whether a cleanup is available, and the recent importer log with its errors.', 'templates-patterns-collection' ),
					'category'            => self::CATEGORY,
					'input_schema'        => array(
						'type'       => 'object',
						'properties' => array(
							'log_lines' => array(
								'type'        => 'integer',
								'default'     => 50,
								'minimum'     => 0,
								'maximum'     => self::MAX_LOG_LINES,
								'description' => 'How many of the most recent importer log lines to return.',
							),
						),
					),
					'output_schema'       => array(
						'type'       => 'object',
						'properties' => array(
							'has_import'        => array( 'type' => 'boolean' ),
							'cleanup_available' => array( 'type' => 'boolean' ),
							'content_imported'  => array( 'type' => 'boolean' ),
							'plugins_installed' => array( 'type' => 'boolean' ),
							'created'           => array(
								'type'                 => 'object',
								'additionalProperties' => true,
							),
							'changed'           => array(
								'type'                 => 'object',
								'additionalProperties' => true,
							),
							'log'               => array(
								'type'  => 'array',
								'items' => array( 'type' => 'string' ),
							),
							'errors'            => array(
								'type'  => 'array',
								'items' => array( 'type' => 'string' ),
							),
						),
					),
					'execute_callback'    => array( $this, 'import_status' ),
					'permission_callback' => array( $this, 'check_permission' ),
					'meta'                => $this->get_meta( true, false, true ),
				),
			),
		);
	}

	/**
	 * Build the ability meta.
	 *
	 * @param bool $readonly    Whether the ability only reads data.
	 * @param bool $destructive Whether the ability may remove or replace data.
	 * @param bool $idempotent  Whether repeated calls have the same effect.
	 *
	 * @return array
	 */
	private function get_meta( $readonly, $destructive, $idempotent ) {
		return array(
			'annotations'  => array(
				'readonly'    => $readonly,
				'destructive' => $destructive,
				'idempotent'  => $idempotent,
			),
			'show_in_rest' => true,
		);
	}

	/**
	 * Permission callback. Mirrors the `ti-sites-lib/v1` REST routes.
	 *
	 * @return bool
	 */
	public function check_permission() {
		return current_user_can( self::CAPABILITY );
	}

	/**
	 * List the starter sites.
	 *
	 * @param mixed $input Ability input.
	 *
	 * @return array|WP_Error
	 */
	public function list_sites( $input = array() ) {
		$disabled = $this->get_disabled_error();
		if ( $disabled ) {
			return $disabled;
		}

		$input   = is_array( $input ) ? $input : array();
		$query   = isset( $input['query'] ) ? strtolower( sanitize_text_field( $input['query'] ) ) : '';
		$builder = isset( $input['builder'] ) ? sanitize_key( $input['builder'] ) : '';
		$sites   = array();

		foreach ( $this->get_sites() as $builder_key => $builder_sites ) {
			if ( $builder !== '' && $builder !== $builder_key ) {
				continue;
			}
			if ( ! is_array( $builder_sites ) ) {
				continue;
			}

			foreach ( $builder_sites as $slug => $data ) {
				$title = isset( $data['title'] ) ? (string) $data['title'] : (string) $slug;

				if ( $query !== '' && strpos( strtolower( $title . ' ' . $slug ), $query ) === false ) {
					continue;
				}

				$required = array();
				if ( isset( $data['mandatory_plugins'] ) && is_array( $data['mandatory_plugins'] ) ) {
					$required = array_map( 'strval', array_keys( $data['mandatory_plugins'] ) );
				}

				$sites[] = array(
					'slug'             => (string) $slug,
					'title'            => $title,
					'builder'          => (string) $builder_key,
					'required_plugins' => $required,
					'preview_url'      => isset( $data['screenshot'] ) ? (string) $data['screenshot'] : '',
					'license_tier'     => isset( $data['upsell'] ) ? 'pro' : 'free',
					'locked'           => isset( $data['upsell'] ) && $data['upsell'] === true,
				);
			}
		}

		$result = array( 'sites' => $sites );

		// Locked sites need Neve Pro; tell the agent where to get it.
		if ( in_array( true, array_column( $sites, 'locked' ), true ) ) {
			$result['upgrade_url'] = $this->get_upgrade_url( 'locked-starter-sites' );
		}

		return $result;
	}

	/**
	 * Import a starter site.
	 *
	 * @param mixed $input Ability input.
	 *
	 * @return array|WP_Error
	 */
	public function import_site( $input = array() ) {
		$disabled = $this->get_disabled_error();
		if ( $disabled ) {
			return $disabled;
		}

		$input   = is_array( $input ) ? $input : array();
		$slug    = isset( $input['slug'] ) ? sanitize_text_field( $input['slug'] ) : '';
		$builder = isset( $input['builder'] ) ? sanitize_key( $input['builder'] ) : '';

		if ( $slug === '' ) {
			return new WP_Error( 'tpc_ability_missing_slug', __( 'A starter site slug is required.', 'templates-patterns-collection' ), array( 'status' => 400 ) );
		}

		$found = $this->find_site( $slug, $builder );
		if ( $found === null ) {
			return new WP_Error( 'tpc_ability_unknown_site', __( 'No starter site with that slug.', 'templates-patterns-collection' ), array( 'status' => 404 ) );
		}

		$site = $found['data'];

		// The catalogue flags premium sites the current license cannot import.
		if ( isset( $site['upsell'] ) && $site['upsell'] === true ) {
			$upgrade_url = $this->get_upgrade_url( 'premium-starter-site' );

			return new WP_Error(
				'tpc_ability_premium_site',
				sprintf(
					/* translators: 1: error message, 2: upgrade URL. */
					__( '%1$s Upgrade: %2$s', 'templates-patterns-collection' ),
					__( 'This starter site requires an active premium license.', 'templates-patterns-collection' ),
					$upgrade_url
				),
				array(
					'status'      => 403,
					'upgrade_url' => $upgrade_url,
				)
			);
		}

		$json = $this->fetch_site_json( $site );
		if ( is_wp_error( $json ) ) {
			return $json;
		}

		$with_plugins = ! isset( $input['with_plugins'] ) || ! empty( $input['with_plugins'] );
		$plugins      = array();
		if ( $with_plugins ) {
			foreach ( array( 'recommended_plugins', 'mandatory_plugins' ) as $group ) {
				if ( isset( $json[ $group ] ) && is_array( $json[ $group ] ) ) {
					foreach ( array_keys( $json[ $group ] ) as $plugin_slug ) {
						$plugins[ (string) $plugin_slug ] = true;
					}
				}
			}
		}

		$pending = array();
		foreach ( self::IMPORT_STEPS as $step ) {
			$key = $step === 'content' ? 'content_file' : $step;
			if ( $step === 'plugins' ? ! empty( $plugins ) : ! empty( $json[ $key ] ) ) {
				$pending[] = $step;
			}
		}
		$total = count( $pending );

		if ( ! empty( $input['dry_run'] ) ) {
			return array(
				'success'         => true,
				'dry_run'         => true,
				'imported'        => false,
				'slug'            => $slug,
				'builder'         => $found['builder'],
				'plugins_planned' => array_keys( $plugins ),
				'steps'           => array_merge( array_fill_keys( self::IMPORT_STEPS, false ), array_fill_keys( $pending, true ) ),
				'done'            => true,
				'cursor'          => '',
				'progress'        => array(
					'current' => 0,
					'total'   => $total,
					'message' => __( 'Dry run, nothing was imported.', 'templates-patterns-collection' ),
				),
			);
		}

		if ( empty( $input['confirm'] ) ) {
			return new WP_Error( 'tpc_ability_confirm_required', __( 'Set confirm=true to import this starter site, or use dry_run=true to inspect the plan.', 'templates-patterns-collection' ), array( 'status' => 400 ) );
		}

		$cursor = isset( $input['cursor'] ) && is_string( $input['cursor'] ) ? $input['cursor'] : '';
		$index  = 0;
		if ( $cursor !== '' ) {
			$index = array_search( $cursor, $pending, true );
			if ( $index === false ) {
				return new WP_Error( 'tpc_ability_invalid_cursor', __( 'The cursor is not a pending step of this import.', 'templates-patterns-collection' ), array( 'status' => 400 ) );
			}
		}

		$result = array(
			'success'           => true,
			'imported'          => false,
			'slug'              => $slug,
			'builder'           => $found['builder'],
			'plugins_installed' => array(),
			'plugins_planned'   => array_keys( $plugins ),
			'steps'             => array(),
			'done'              => false,
			'cursor'            => '',
			'progress'          => array(
				'current' => 0,
				'total'   => $total,
				'message' => __( 'Nothing to import.', 'templates-patterns-collection' ),
			),
		);

		if ( $total > 0 ) {
			$step   = $pending[ $index ];
			$source = $this->get_site_url( $site );

			if ( $source !== '' ) {
				Slug_Mapping::register_source_url( $source );
			}
			$this->ensure_active_state();

			$outcome = $this->run_import_step( $step, $json, $plugins, $slug, isset( $site['editor'] ) ? $site['editor'] : $found['builder'], $source );

			if ( empty( $outcome['success'] ) ) {
				return new WP_Error(
					'tpc_ability_import_step_failed',
					/* translators: 1: import step name, 2: error message. */
					sprintf( __( 'The "%1$s" import step failed: %2$s', 'templates-patterns-collection' ), $step, $outcome['error'] ),
					array(
						'status' => 500,
						'step'   => $step,
						'cursor' => $step,
					)
				);
			}

			$result['steps'][ $step ] = $outcome;
			if ( $step === 'plugins' ) {
				$result['plugins_installed'] = array_keys( $plugins );
			}

			++$index;
			$result['progress']['current'] = $index;
			/* translators: 1: import step name, 2: finished steps, 3: total steps. */
			$result['progress']['message'] = sprintf( __( 'Finished the "%1$s" step (%2$d of %3$d).', 'templates-patterns-collection' ), $step, $index, $total );
		}

		if ( $index < $total ) {
			$result['cursor'] = $pending[ $index ];

			return $result;
		}

		$result['done']           = true;
		$result['imported']       = true;
		$result['front_page_url'] = home_url( '/' );

		return $result;
	}

	/**
	 * Run one import step through the importer the matching REST route uses.
	 *
	 * @param string $step    Step name, one of IMPORT_STEPS.
	 * @param array  $json    Import data of the site.
	 * @param array  $plugins Plugins to install, as slug => true.
	 * @param string $slug    Site slug.
	 * @param string $editor  Site editor.
	 * @param string $source  Demo site URL.
	 *
	 * @return array
	 */
	private function run_import_step( $step, $json, $plugins, $slug, $editor, $source ) {
		$rest = new Rest_Server();

		if ( $step === 'plugins' ) {
			return $this->get_step_result( $rest->run_plugin_importer( $this->build_request( $plugins ) ) );
		}

		if ( $step === 'content' ) {
			$payload = array(
				'contentFile' => $json['content_file'],
				'source'      => 'remote',
				'demoSlug'    => $slug,
				'editor'      => $editor,
			);
			$mapping = array(
				'front_page'     => 'frontPage',
				'shop_pages'     => 'shopPages',
				'payment_forms'  => 'paymentForms',
				'masteriyo_data' => 'masteriyoData',
			);
			foreach ( $mapping as $json_key => $payload_key ) {
				if ( isset( $json[ $json_key ] ) ) {
					$payload[ $payload_key ] = $json[ $json_key ];
				}
			}

			return $this->get_step_result( $rest->run_xml_importer( $this->build_request( $payload ) ) );
		}

		if ( $step === 'theme_mods' ) {
			return $this->get_step_result(
				$rest->run_theme_mods_importer(
					$this->build_request(
						array(
							'source_url' => $source,
							'theme_mods' => $json['theme_mods'],
							'wp_options' => isset( $json['wp_options'] ) ? $json['wp_options'] : array(),
						)
					)
				)
			);
		}

		return $this->get_step_result(
			$rest->run_widgets_importer(
				$this->build_request(
					array(
						'source_url' => $source,
						'widgets'    => $json['widgets'],
					)
				)
			)
		);
	}

	/**
	 * Revert the recorded import.
	 *
	 * @param mixed $input Ability input.
	 *
	 * @return array|WP_Error
	 */
	public function cleanup( $input = array() ) {
		$input = is_array( $input ) ? $input : array();

		if ( empty( $input['confirm'] ) ) {
			return new WP_Error( 'tpc_ability_confirm_required', __( 'Set confirm=true to revert the last import.', 'templates-patterns-collection' ), array( 'status' => 400 ) );
		}

		// Same gate the import UI uses before offering the cleanup.
		if ( empty( get_transient( Active_State::STATE_NAME ) ) ) {
			return new WP_Error( 'tpc_ability_nothing_to_cleanup', __( 'There is no recorded starter site import to revert.', 'templates-patterns-collection' ), array( 'status' => 404 ) );
		}

		$rest = new Rest_Server();
		$rest->run_cleanup();

		return array(
			'success'  => true,
			'reverted' => true,
		);
	}

	/**
	 * Report the recorded state of the last import.
	 *
	 * @param mixed $input Ability input.
	 *
	 * @return array
	 */
	public function import_status( $input = array() ) {
		$input     = is_array( $input ) ? $input : array();
		$log_lines = isset( $input['log_lines'] ) ? absint( $input['log_lines'] ) : 50;
		$log_lines = min( $log_lines, self::MAX_LOG_LINES );

		$state = get_transient( Active_State::STATE_NAME );
		$state = is_array( $state ) ? $state : array();

		$created = array();
		$lists   = array(
			'posts'       => Active_State::POSTS_NSP,
			'attachments' => Active_State::ATTACHMENT_NSP,
			'comments'    => Active_State::COMMENTS_NSP,
			'categories'  => Active_State::CATEGORY_NSP,
			'tags'        => Active_State::TAGS_NSP,
		);
		foreach ( $lists as $key => $namespace ) {
			$ids             = isset( $state[ $namespace ] ) && is_array( $state[ $namespace ] ) ? array_values( array_map( 'absint', $state[ $namespace ] ) ) : array();
			$created[ $key ] = array(
				'count' => count( $ids ),
				'ids'   => $ids,
			);
		}

		$terms = array();
		if ( isset( $state[ Active_State::TERMS_NSP ] ) && is_array( $state[ Active_State::TERMS_NSP ] ) ) {
			foreach ( $state[ Active_State::TERMS_NSP ] as $term ) {
				if ( isset( $term['id'], $term['taxonomy'] ) ) {
					$terms[] = array(
						'id'       => absint( $term['id'] ),
						'taxonomy' => (string) $term['taxonomy'],
					);
				}
			}
		}
		$created['terms'] = array(
			'count' => count( $terms ),
			'items' => $terms,
		);

		$created['plugins'] = isset( $state[ Active_State::PLUGINS_NSP ] ) && is_array( $state[ Active_State::PLUGINS_NSP ] ) ? array_map( 'strval', array_keys( $state[ Active_State::PLUGINS_NSP ] ) ) : array();

		$changed = array(
			'theme_mods' => $this->pluck_names( $state, Active_State::THEME_MODS_NSP, 'mod' ),
			'widgets'    => $this->pluck_names( $state, Active_State::WIDGETS_NSP, 'id' ),
			'menus'      => isset( $state[ Active_State::MENUS_NSP ] ),
			'options'    => array(),
		);
		foreach ( array( Active_State::FRONT_PAGE_NSP, Active_State::SHOP_PAGE_NSP ) as $namespace ) {
			if ( isset( $state[ $namespace ] ) && is_array( $state[ $namespace ] ) ) {
				$changed['options'] = array_merge( $changed['options'], array_map( 'strval', array_keys( $state[ $namespace ] ) ) );
			}
		}

		$log    = array();
		$errors = array();
		$raw    = get_transient( Logger::$log_transient_name );
		if ( is_string( $raw ) && $raw !== '' && $log_lines > 0 ) {
			$lines = array_values( array_filter( array_map( 'trim', explode( PHP_EOL, $raw ) ) ) );
			$log   = array_slice( $lines, -1 * $log_lines );
			foreach ( $log as $line ) {
				if ( strpos( $line, '(E):' ) !== false ) {
					$errors[] = $line;
				}
			}
		}

		return array(
			'has_import'        => ! empty( $state ),
			'cleanup_available' => ! empty( $state ),
			'content_imported'  => get_theme_mod( 'ti_content_imported' ) === 'yes',
			'plugins_installed' => get_option( 'themeisle_ob_plugins_installed' ) === 'yes',
			'created'           => $created,
			'changed'           => $changed,
			'log'               => $log,
			'errors'            => $errors,
		);
	}

	/**
	 * Get one field from each item of a state namespace.
	 *
	 * @param array  $state     The cleanup state.
	 * @param string $namespace The state namespace.
	 * @param string $field     The field to read.
	 *
	 * @return array
	 */
	private function pluck_names( $state, $namespace, $field ) {
		$names = array();
		if ( ! isset( $state[ $namespace ] ) || ! is_array( $state[ $namespace ] ) ) {
			return $names;
		}
		foreach ( $state[ $namespace ] as $item ) {
			if ( is_array( $item ) && isset( $item[ $field ] ) && is_scalar( $item[ $field ] ) ) {
				$names[] = (string) $item[ $field ];
			}
		}

		return array_values( array_unique( $names ) );
	}

	/**
	 * Neve Pro upgrade link, the one the starter sites screen uses, tagged for MCP.
	 *
	 * @param string $area Gated feature key, used as the campaign.
	 *
	 * @return string
	 */
	private function get_upgrade_url( $area ) {
		return tsdk_translate_link( tsdk_utmify( 'https://themeisle.com/themes/neve/upgrade/', $area, 'mcp' ), 'query' );
	}

	/**
	 * Error returned when starter sites are disabled through white label.
	 *
	 * @return WP_Error|null
	 */
	private function get_disabled_error() {
		$this->setup_white_label();
		if ( $this->is_starter_sites_disabled() ) {
			return new WP_Error( 'tpc_ability_starter_sites_disabled', __( 'Starter sites are disabled on this site.', 'templates-patterns-collection' ), array( 'status' => 403 ) );
		}

		return null;
	}

	/**
	 * Get the starter sites catalogue as builder => slug => data.
	 *
	 * @return array
	 */
	private function get_sites() {
		$sites = $this->read_theme_support();

		// The listing is only set up for users resolved before `init`; do it now otherwise.
		if ( empty( $sites ) ) {
			$listing = new Sites_Listing();
			$listing->init();
			$sites = $this->read_theme_support();
		}

		return $sites;
	}

	/**
	 * Read the catalogue from the `themeisle-demo-import` theme support.
	 *
	 * @return array
	 */
	private function read_theme_support() {
		$support = get_theme_support( 'themeisle-demo-import' );

		if ( is_array( $support ) && isset( $support[0]['remote'] ) && is_array( $support[0]['remote'] ) ) {
			return $support[0]['remote'];
		}

		return array();
	}

	/**
	 * Find a site by slug, optionally within a builder.
	 *
	 * @param string $slug    Site slug.
	 * @param string $builder Builder key or empty string.
	 *
	 * @return array|null
	 */
	private function find_site( $slug, $builder ) {
		foreach ( $this->get_sites() as $builder_key => $sites ) {
			if ( $builder !== '' && $builder !== $builder_key ) {
				continue;
			}
			if ( isset( $sites[ $slug ] ) && is_array( $sites[ $slug ] ) ) {
				return array(
					'builder' => (string) $builder_key,
					'data'    => $sites[ $slug ],
				);
			}
		}

		return null;
	}

	/**
	 * The demo site URL.
	 *
	 * @param array $site Site data.
	 *
	 * @return string
	 */
	private function get_site_url( $site ) {
		if ( ! empty( $site['url'] ) ) {
			return (string) $site['url'];
		}

		return ! empty( $site['remote_url'] ) ? (string) $site['remote_url'] : '';
	}

	/**
	 * Fetch the import data of a site, the same way the import modal does.
	 *
	 * @param array $site Site data.
	 *
	 * @return array|WP_Error
	 */
	private function fetch_site_json( $site ) {
		$address = ! empty( $site['remote_url'] ) ? (string) $site['remote_url'] : $this->get_site_url( $site );
		if ( $address === '' ) {
			return new WP_Error( 'tpc_ability_no_source', __( 'The starter site has no source URL.', 'templates-patterns-collection' ), array( 'status' => 500 ) );
		}

		$url = add_query_arg(
			array(
				'license'      => rawurlencode( (string) apply_filters( 'product_neve_license_key', 'free' ) ),
				'ti_downloads' => 'yes',
			),
			trailingslashit( $address ) . 'wp-json/ti-demo-data/data'
		);

		$response = wp_remote_get( esc_url_raw( $url ), array( 'timeout' => 30 ) );

		if ( is_wp_error( $response ) ) {
			return new WP_Error( 'tpc_ability_site_data', $response->get_error_message(), array( 'status' => 502 ) );
		}

		if ( (int) wp_remote_retrieve_response_code( $response ) !== 200 ) {
			return new WP_Error( 'tpc_ability_site_data', __( 'Could not fetch the starter site data.', 'templates-patterns-collection' ), array( 'status' => 502 ) );
		}

		$json = json_decode( wp_remote_retrieve_body( $response ), true );
		if ( ! is_array( $json ) ) {
			return new WP_Error( 'tpc_ability_site_data', __( 'The starter site data was malformed.', 'templates-patterns-collection' ), array( 'status' => 502 ) );
		}

		return $json;
	}

	/**
	 * Make sure the cleanup state is being recorded during the import.
	 *
	 * Main only wires it for users resolved before `init`.
	 *
	 * @return void
	 */
	private function ensure_active_state() {
		if ( has_action( 'themeisle_cl_add_property_state' ) ) {
			return;
		}

		$active_state = new Active_State();
		$active_state->init();
	}

	/**
	 * Build the JSON request the importers read their parameters from.
	 *
	 * @param array $payload Request body.
	 *
	 * @return WP_REST_Request
	 */
	private function build_request( $payload ) {
		$request = new WP_REST_Request( 'POST' );
		$request->set_header( 'content-type', 'application/json' );
		$request->set_body( wp_json_encode( $payload ) );

		return $request;
	}

	/**
	 * Normalize an importer response into { success, error? }.
	 *
	 * @param mixed $response Importer response.
	 *
	 * @return array
	 */
	private function get_step_result( $response ) {
		if ( is_wp_error( $response ) ) {
			return array(
				'success' => false,
				'error'   => $response->get_error_message(),
			);
		}

		$data = $response instanceof WP_REST_Response ? $response->get_data() : $response;

		if ( is_array( $data ) && isset( $data['success'] ) && $data['success'] === false ) {
			$error = 'import_step_failed';
			if ( isset( $data['data'] ) && is_wp_error( $data['data'] ) ) {
				$error = $data['data']->get_error_message();
			} elseif ( isset( $data['data'] ) && is_string( $data['data'] ) ) {
				$error = $data['data'];
			}

			return array(
				'success' => false,
				'error'   => $error,
			);
		}

		return array( 'success' => true );
	}
}
