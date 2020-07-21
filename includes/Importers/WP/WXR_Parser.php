<?php

namespace TIOB\Importers\WP;

use TIOB\Logger;

/**
 * WordPress Importer class for managing parsing of WXR files.
 */
class WXR_Parser {
	/**
	 * Logger instance.
	 *
	 * @var Logger
	 */
	private $logger;

	/**
	 * Used page builder.
	 *
	 * @var string
	 */
	private $page_builder;

	/**
	 * WXR_Parser constructor.
	 *
	 * @param string $page_builder the page builder used.
	 */
	public function __construct( $page_builder = '' ) {
		$this->page_builder = $page_builder;
		$this->logger       = Logger::get_instance();
	}

	/**
	 * Parse XML file.
	 *
	 * @param string $file file path.
	 *
	 * @return array|WP_Error
	 */
	public function parse( $file ) {
		$this->logger->log( "Starting parsing file:{$file}", 'progress' );
		$result = null;

		if ( $this->page_builder === 'beaver-builder' || $this->page_builder === 'beaver builder' ) {
			if ( extension_loaded( 'xml' ) ) {
				$parser = new Beaver_ParserXML();

				$result = $parser->parse( $file );
			} else {
				$this->logger->log( 'xml not active.' );
			}
			if ( is_wp_error( $result ) ) {
				$this->logger->log( "Parse failed with message: {$result->get_error_message()}" );
			}

			if ( $result === null ) {
				$this->logger->log( 'Nothing got parsed from XML.' );
			}

			return $result;
		}

		// Attempt to use proper XML parsers first
		if ( extension_loaded( 'simplexml' ) ) {
			$parser = new WXR_Parser_SimpleXML();
			$this->logger->log( 'Using WXR_Parser_SimpleXML...', 'progress' );
			$result = $parser->parse( $file );
			// If SimpleXML succeeds or this is an invalid WXR file then return the results
			if ( ! is_wp_error( $result ) || 'SimpleXML_parse_error' != $result->get_error_code() ) {
				$this->logger->log( 'Parsed XML', 'success' );

				return $result;
			}
		} elseif ( extension_loaded( 'xml' ) ) {
			$this->logger->log( 'Using WXR_Parser_XML...', 'progress' );
			$parser = new WXR_Parser_XML;
			$result = $parser->parse( $file );
			// If XMLParser succeeds or this is an invalid WXR file then return the results
			if ( ! is_wp_error( $result ) || 'XML_parse_error' != $result->get_error_code() ) {
				$this->logger->log( 'Parsed XML', 'success' );

				return $result;
			}
		}

		if ( is_wp_error( $result ) ) {
			$this->logger->log( 'simplexml and xml not active.' );
			$this->logger->log( "Parse failed with message: {$result->get_error_message()}" );
		}

		return $result;
	}
}
