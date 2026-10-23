<?php
/**
 * WXR parser selection tests.
 *
 * @package templates-patterns-collection
 */

use TIOB\Importers\WP\WXR_Parser;
use TIOB\Importers\WP\WXR_Parser_SimpleXML;
use TIOB\Importers\WP\WXR_Parser_XML;

/**
 * WXR parser on a host without the DOM extension.
 */
class WXR_Parser_Without_Dom extends WXR_Parser {
	protected function can_use_simplexml(): bool {
		return false;
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

	public function test_parse_uses_simplexml_parser_when_dom_is_available(): void {
		$expected = ( new WXR_Parser_SimpleXML() )->parse( $this->file );

		$this->assertSame( $expected, ( new WXR_Parser( 'gutenberg' ) )->parse( $this->file ) );
	}

	public function test_parse_falls_back_to_xml_parser_when_dom_is_unavailable(): void {
		$expected = ( new WXR_Parser_XML() )->parse( $this->file );

		$this->assertSame( $expected, ( new WXR_Parser_Without_Dom( 'gutenberg' ) )->parse( $this->file ) );
	}
}
