<?php
namespace TIOB\Importers\WP;

/**
 * Brought in from Beaver Builder Lite
 *
 * Portions borrowed from https://github.com/Blogestudio/Fix-Serialization/blob/master/fix-serialization.php
 *
 * Attempts to fix broken serialized data.
 *
 * @since 1.8
 */
final class Beaver_Data_Fix {

	/**
	 * @since 1.8
	 * @return string
	 */
	static public function run( $data ) {
		// return if empty
		if ( empty( $data ) ) {
			return $data;
		}

		$data = maybe_unserialize( $data );

		// return if maybe_unserialize() returns an object or array, this is good.
		if ( is_object( $data ) || is_array( $data ) ) {
			return $data;
		}

		return preg_replace_callback( '!s:(\d+):([\\\\]?"[\\\\]?"|[\\\\]?"((.*?)[^\\\\])[\\\\]?");!', 'TIOB\Importers\WP\Beaver_Data_Fix::regex_callback', $data );
	}

	/**
	 * @since 1.8
	 * @return string
	 */
	static public function regex_callback( $matches ) {
		if ( ! isset( $matches[3] ) ) {
			return $matches[0];
		}

		return 's:' . strlen( self::unescape_mysql( $matches[3] ) ) . ':"' . self::unescape_quotes( $matches[3] ) . '";';
	}

	/**
	 * Unescape to avoid dump-text issues.
	 *
	 * @since 1.8
	 * @access private
	 * @return string
	 */
	static private function unescape_mysql( $value ) {
		return str_replace(
			array( '\\\\', "\\0", "\\n", "\\r", '\Z', "\'", '\"' ),
			array( '\\', "\0", "\n", "\r", "\x1a", "'", '"' ),
			$value
		);
	}

	/**
	 * Fix strange behaviour if you have escaped quotes in your replacement.
	 *
	 * @since 1.8
	 * @access private
	 * @return string
	 */
	static private function unescape_quotes( $value ) {
		return str_replace( '\"', '"', $value );
	}
}
