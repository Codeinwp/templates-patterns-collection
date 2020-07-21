<?php
/**
 * The plugin upgrader quiet skin.
 *
 * Used to silence installation progress for plugins installs.
 *
 * @package    templates-patterns-collection
 */

namespace TIOB\Importers\Helpers;

use WP_Upgrader_Skin;

/**
 * Class Quiet_Skin_Legacy
 *
 * Silences plugin install and activate.
 */
class Quiet_Skin_Legacy extends WP_Upgrader_Skin {
	/**
	 * Done Header.
	 *
	 * @var bool
	 */
	public $done_header = true;

	/**
	 * Done Footer.
	 *
	 * @var bool
	 */
	public $done_footer = true;

	/**
	 * Feedback function overwrite.
	 *
	 * @param string $string feedback string.
	 */
	public function feedback( $string ) {
		// Keep install quiet.
	}

	/**
	 * Quiet after.
	 */
	public function after() {
		// Quiet after
	}

	/**
	 * Quiet before.
	 */
	public function before() {
		// Quiet before.
	}


}
