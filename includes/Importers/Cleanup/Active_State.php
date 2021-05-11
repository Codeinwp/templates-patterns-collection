<?php
/**
 * The plugin active state for cleanup.
 *
 * Used to keep track of the state of the import for cleanup.
 *
 * @package    templates-patterns-collection
 */
namespace TIOB\Importers\Cleanup;

/**
 * Class Active_State
 * @package TIOB\Importers\Cleanup
 */
class Active_State {

	const STATE_NAME      = 'neve_last_imports';
	const HOUR_IN_SECONDS = 3600;
	const PLUGINS_NSP     = 'plugins';
	/**
	 * @var array $state
	 */
	private $state;

	/**
	 * Active_State constructor.
	 */
	final public function __construct() {
		$this->fresh_state();
	}

	/**
	 * Make sure state is fresh.
	 *
	 * @return void
	 */
	private function fresh_state() {
		$state = get_transient( self::STATE_NAME );
		if ( empty( $state ) ) {
			$this->state = array();
		}
		$this->state = $state;
	}

	/**
	 * Get current active state.
	 *
	 * @return array|null
	 */
	final public function get() {
		$this->fresh_state();
		return $this->state;
	}

	/**
	 * Add to state method.
	 *
	 * @param string $key State key.
	 * @param mixed $data Data for the state key.
	 * @return void
	 */
	final public function add( $key, $data ) {
		$this->state[ $key ] = $data;
		set_transient( self::STATE_NAME, $this->state, 24 * self::HOUR_IN_SECONDS );
	}

	/**
	 * Remove from state method.
	 *
	 * @param string $key
	 * @return void
	 */
	final public function remove( $key ) {
		unset( $this->state[ $key ] );
		set_transient( self::STATE_NAME, $this->state, 24 * self::HOUR_IN_SECONDS );
	}

	/**
	 * Return specific key from state.
	 *
	 * @param string $key State key.
	 * @return mixed|null
	 */
	final public function get_by_key( $key ) {
		$this->fresh_state();
		if ( empty( $this->state[ $key ] ) ) {
			return null;
		}
		return $this->state[ $key ];
	}

	/**
	 * Method to get set keys.
	 * @return string[]
	 */
	final public function get_set_keys() {
		$this->fresh_state();
		return array_keys( $this->state );
	}
}
