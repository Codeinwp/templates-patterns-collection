<?php
/**
 * WXR parser selection tests.
 *
 * @package templates-patterns-collection
 */

use TIOB\Importers\WP\WXR_Parser;
use TIOB\Importers\WP\WXR_Parser_XML;

/**
 * WXR parser on a host missing some PHP extensions.
 */
class WXR_Parser_Missing_Extensions extends WXR_Parser {
	/**
	 * @var list<string>
	 */
	private $missing;

	/**
	 * @param list<string> $missing extensions to report as not loaded.
	 */
	public function __construct( array $missing ) {
		parent::__construct( 'gutenberg' );
		$this->missing = $missing;
	}

	/**
	 * @param string $extension extension name.
	 */
	protected function is_extension_loaded( $extension ): bool {
		return ! in_array( $extension, $this->missing, true ) && parent::is_extension_loaded( $extension );
	}
}

/**
 * Class WXR_Parser_Test
 */
class WXR_Parser_Test extends WP_UnitTestCase {
	/**
	 * @var string
	 */
	private $file;

	public function setUp(): void {
		parent::setUp();
		$this->file = __DIR__ . '/fixtures/export.xml';
	}

	public function test_parse_falls_back_to_xml_parser_when_dom_is_unavailable(): void {
		$expected = ( new WXR_Parser_XML() )->parse( $this->file );

		$this->assertSame( $expected, ( new WXR_Parser_Missing_Extensions( array( 'dom' ) ) )->parse( $this->file ) );
	}

	public function test_parse_returns_error_when_no_xml_parser_is_available(): void {
		$result = ( new WXR_Parser_Missing_Extensions( array( 'dom', 'xml' ) ) )->parse( $this->file );

		$this->assertSame( 'WXR_parser_unavailable', is_wp_error( $result ) ? $result->get_error_code() : $result );
	}
}
