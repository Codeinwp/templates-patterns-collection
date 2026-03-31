<?php
/**
 * Slug mapping helper.
 *
 * Keeps the old/new slug map and source URLs for the current import and
 * provides URL rewrite helpers that use this state.
 *
 * @package templates-patterns-collection
 */

namespace TIOB\Importers\Helpers;

/**
 * Class Slug_Mapping
 */
class Slug_Mapping {

	/**
	 * Transient key used for the import slug mapping state.
	 */
	const TRANSIENT_KEY = 'ti_tpc_import_slug_mapping';

	/**
	 * Map array key.
	 */
	const MAP_KEY = 'slug_map';

	/**
	 * Source URLs array key.
	 */
	const SOURCES_KEY = 'source_urls';

	/**
	 * Persisted state expiration.
	 */
	const EXPIRATION = 12 * HOUR_IN_SECONDS;

	/**
	 * Clear stored state.
	 *
	 * @return void
	 */
	public static function clear() {
		delete_transient( self::TRANSIENT_KEY );
	}

	/**
	 * Set slug map.
	 *
	 * @param array $slug_map old slug => new slug map.
	 *
	 * @return void
	 */
	public static function set_slug_map( $slug_map ) {
		if ( ! is_array( $slug_map ) ) {
			return;
		}

		$state = self::get_state();
		$map   = array();

		foreach ( $slug_map as $old_slug => $new_slug ) {
			if ( ! is_string( $old_slug ) || ! is_string( $new_slug ) ) {
				continue;
			}

			$old_slug = trim( $old_slug );
			$new_slug = trim( $new_slug );
			if ( $old_slug === '' || $new_slug === '' ) {
				continue;
			}

			$map[ $old_slug ] = $new_slug;
		}

		$state[ self::MAP_KEY ] = $map;
		self::save_state( $state );
	}

	/**
	 * Return the stored slug map.
	 *
	 * @return array
	 */
	public static function get_slug_map() {
		$state = self::get_state();
		return is_array( $state[ self::MAP_KEY ] ) ? $state[ self::MAP_KEY ] : array();
	}

	/**
	 * Resolve a slug through the map.
	 *
	 * @param string $slug old slug.
	 *
	 * @return string
	 */
	public static function resolve_slug( $slug ) {
		$map = self::get_slug_map();
		if ( isset( $map[ $slug ] ) ) {
			return $map[ $slug ];
		}

		return $slug;
	}

	/**
	 * Register an import source URL.
	 *
	 * @param string $source_url source URL.
	 *
	 * @return void
	 */
	public static function register_source_url( $source_url ) {
		if ( ! is_string( $source_url ) || empty( $source_url ) ) {
			return;
		}

		$source_url = esc_url_raw( trim( $source_url ) );
		if ( empty( $source_url ) ) {
			return;
		}

		$state       = self::get_state();
		$source_urls = isset( $state[ self::SOURCES_KEY ] ) && is_array( $state[ self::SOURCES_KEY ] ) ? $state[ self::SOURCES_KEY ] : array();

		if ( ! in_array( $source_url, $source_urls, true ) ) {
			$source_urls[] = $source_url;
		}

		$state[ self::SOURCES_KEY ] = $source_urls;
		self::save_state( $state );
	}

	/**
	 * Get all registered source URLs.
	 *
	 * @return array
	 */
	public static function get_source_urls() {
		$state = self::get_state();
		return isset( $state[ self::SOURCES_KEY ] ) && is_array( $state[ self::SOURCES_KEY ] ) ? $state[ self::SOURCES_KEY ] : array();
	}

	/**
	 * Recursively rewrite internal links in a value.
	 *
	 * @param mixed $value value to rewrite.
	 *
	 * @return mixed
	 */
	public static function rewrite_value( $value ) {
		if ( is_array( $value ) ) {
			foreach ( $value as $key => $item ) {
				$value[ $key ] = self::rewrite_value( $item );
			}

			return $value;
		}

		if ( is_string( $value ) ) {
			return self::rewrite_string_value( $value );
		}

		return $value;
	}

	/**
	 * Rewrite a single URL if it belongs to an import source.
	 *
	 * @param string $url URL.
	 *
	 * @return string
	 */
	public static function rewrite_url( $url ) {
		if ( ! is_string( $url ) || empty( $url ) ) {
			return $url;
		}

		$source_url = self::get_matching_source_url( $url );
		if ( empty( $source_url ) ) {
			return $url;
		}

		$url_parts    = wp_parse_url( $url );
		$source_parts = wp_parse_url( $source_url );
		$home_parts   = wp_parse_url( get_home_url() );

		if ( ! is_array( $url_parts ) || ! is_array( $source_parts ) || ! is_array( $home_parts ) ) {
			return $url;
		}

		$target_path = isset( $url_parts['path'] ) ? $url_parts['path'] : '/';
		$source_path = isset( $source_parts['path'] ) ? rtrim( $source_parts['path'], '/' ) : '';
		$home_path   = isset( $home_parts['path'] ) ? rtrim( $home_parts['path'], '/' ) : '';
		$relative    = $target_path;

		if ( ! empty( $source_path ) && $source_path !== '/' ) {
			if ( $target_path === $source_path ) {
				$relative = '';
			} elseif ( strpos( $target_path, $source_path . '/' ) === 0 ) {
				$relative = substr( $target_path, strlen( $source_path ) );
			} else {
				return $url;
			}
		}

		$rewritten_relative = $relative;
		if ( $rewritten_relative !== '' ) {
			$rewritten_relative = self::replace_path_slugs( $rewritten_relative );
		}

		$new_path = $home_path . $rewritten_relative;
		if ( $new_path === '' ) {
			$new_path = '/';
		}
		if ( strpos( $new_path, '/' ) !== 0 ) {
			$new_path = '/' . $new_path;
		}

		$url_parts['scheme'] = isset( $home_parts['scheme'] ) ? $home_parts['scheme'] : ( isset( $url_parts['scheme'] ) ? $url_parts['scheme'] : 'http' );
		$url_parts['host']   = isset( $home_parts['host'] ) ? $home_parts['host'] : $url_parts['host'];
		$url_parts['path']   = $new_path;

		if ( isset( $home_parts['port'] ) ) {
			$url_parts['port'] = $home_parts['port'];
		} else {
			unset( $url_parts['port'] );
		}

		if ( isset( $home_parts['user'] ) ) {
			$url_parts['user'] = $home_parts['user'];
		} else {
			unset( $url_parts['user'] );
		}

		if ( isset( $home_parts['pass'] ) ) {
			$url_parts['pass'] = $home_parts['pass'];
		} else {
			unset( $url_parts['pass'] );
		}

		return self::build_url( $url_parts );
	}

	/**
	 * Rewrite string values and support serialized content.
	 *
	 * @param string $value string value.
	 *
	 * @return string
	 */
	private static function rewrite_string_value( $value ) {
		if ( $value === '' ) {
			return $value;
		}

		if ( is_serialized( $value ) ) {
			$unserialized = maybe_unserialize( $value );
			$rewritten    = self::rewrite_value( $unserialized );

			return maybe_serialize( $rewritten );
		}

		$value = self::rewrite_plain_urls_in_string( $value );
		$value = self::rewrite_escaped_urls_in_string( $value );

		return $value;
	}

	/**
	 * Rewrite plain URLs found in string.
	 *
	 * @param string $value value.
	 *
	 * @return string
	 */
	private static function rewrite_plain_urls_in_string( $value ) {
		return preg_replace_callback(
			'#https?://[^\s"\'<>()]+#i',
			function ( $matches ) {
				return self::rewrite_url( $matches[0] );
			},
			$value
		);
	}

	/**
	 * Rewrite escaped URLs found in string.
	 *
	 * @param string $value value.
	 *
	 * @return string
	 */
	private static function rewrite_escaped_urls_in_string( $value ) {
		return preg_replace_callback(
			'#https?:\\\\/\\\\/[^\s"\'<>()]+#i',
			function ( $matches ) {
				$escaped_url = $matches[0];
				$decoded_url = str_replace( '\\/', '/', $escaped_url );
				$rewritten   = self::rewrite_url( $decoded_url );
				$rewritten   = str_replace( '/', '\\/', $rewritten );

				return $rewritten;
			},
			$value
		);
	}

	/**
	 * Replace path segments using slug map.
	 *
	 * @param string $path path.
	 *
	 * @return string
	 */
	private static function replace_path_slugs( $path ) {
		$map = self::get_slug_map();
		if ( empty( $map ) || ! is_string( $path ) || $path === '' ) {
			return $path;
		}

		if ( $path === '/' ) {
			return $path;
		}

		$starts_with_slash = strpos( $path, '/' ) === 0;
		$ends_with_slash   = substr( $path, -1 ) === '/';
		$segments          = explode( '/', trim( $path, '/' ) );

		foreach ( $segments as $index => $segment ) {
			$decoded = rawurldecode( $segment );
			if ( isset( $map[ $decoded ] ) ) {
				$segments[ $index ] = rawurlencode( $map[ $decoded ] );
			}
		}

		$new_path = implode( '/', $segments );
		if ( $starts_with_slash ) {
			$new_path = '/' . $new_path;
		}
		if ( $ends_with_slash && $new_path !== '/' ) {
			$new_path .= '/';
		}
		if ( $new_path === '' ) {
			$new_path = '/';
		}

		return $new_path;
	}

	/**
	 * Return the matching source URL for a URL.
	 *
	 * @param string $url URL.
	 *
	 * @return string
	 */
	private static function get_matching_source_url( $url ) {
		$url_parts = wp_parse_url( $url );
		if ( ! is_array( $url_parts ) || ! isset( $url_parts['host'] ) ) {
			return '';
		}

		$target_host = strtolower( $url_parts['host'] );
		$target_path = isset( $url_parts['path'] ) ? $url_parts['path'] : '/';
		$best_match  = '';
		$best_length = -1;

		foreach ( self::get_source_urls() as $source_url ) {
			$source_parts = wp_parse_url( $source_url );
			if ( ! is_array( $source_parts ) || ! isset( $source_parts['host'] ) ) {
				continue;
			}

			if ( strtolower( $source_parts['host'] ) !== $target_host ) {
				continue;
			}

			if ( isset( $source_parts['port'], $url_parts['port'] ) && (int) $source_parts['port'] !== (int) $url_parts['port'] ) {
				continue;
			}

			$source_path = isset( $source_parts['path'] ) ? rtrim( $source_parts['path'], '/' ) : '';
			if ( empty( $source_path ) || $source_path === '/' ) {
				$path_length = 0;
				if ( $path_length > $best_length ) {
					$best_match  = $source_url;
					$best_length = $path_length;
				}
				continue;
			}

			if ( $target_path === $source_path || strpos( $target_path, $source_path . '/' ) === 0 ) {
				$path_length = strlen( $source_path );
				if ( $path_length > $best_length ) {
					$best_match  = $source_url;
					$best_length = $path_length;
				}
			}
		}

		return $best_match;
	}

	/**
	 * Build URL from parsed URL parts.
	 *
	 * @param array $parts parsed URL parts.
	 *
	 * @return string
	 */
	private static function build_url( $parts ) {
		$scheme   = isset( $parts['scheme'] ) ? $parts['scheme'] . '://' : '';
		$user     = isset( $parts['user'] ) ? $parts['user'] : '';
		$pass     = isset( $parts['pass'] ) ? ':' . $parts['pass'] : '';
		$auth     = ( $user || $pass ) ? "{$user}{$pass}@" : '';
		$host     = isset( $parts['host'] ) ? $parts['host'] : '';
		$port     = isset( $parts['port'] ) ? ':' . $parts['port'] : '';
		$path     = isset( $parts['path'] ) ? $parts['path'] : '';
		$query    = isset( $parts['query'] ) ? '?' . $parts['query'] : '';
		$fragment = isset( $parts['fragment'] ) ? '#' . $parts['fragment'] : '';

		return "{$scheme}{$auth}{$host}{$port}{$path}{$query}{$fragment}";
	}

	/**
	 * Get state from transient.
	 *
	 * @return array
	 */
	private static function get_state() {
		$state = get_transient( self::TRANSIENT_KEY );
		if ( ! is_array( $state ) ) {
			$state = array();
		}

		if ( ! isset( $state[ self::MAP_KEY ] ) || ! is_array( $state[ self::MAP_KEY ] ) ) {
			$state[ self::MAP_KEY ] = array();
		}
		if ( ! isset( $state[ self::SOURCES_KEY ] ) || ! is_array( $state[ self::SOURCES_KEY ] ) ) {
			$state[ self::SOURCES_KEY ] = array();
		}

		return $state;
	}

	/**
	 * Save state.
	 *
	 * @param array $state state.
	 *
	 * @return void
	 */
	private static function save_state( $state ) {
		set_transient( self::TRANSIENT_KEY, $state, self::EXPIRATION );
	}
}
