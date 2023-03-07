<?php
/**
 * Post clone tests.
 *
 * @author Bogdan Preda <bogdan.preda@themeisle.com>
 * @package templates-patterns-collection
 */

use TIOB\Admin;

/**
 * Class Post_Clone_Test
 */
class Post_Clone_Test extends WP_UnitTestCase {

	private $post_id;

	/**
	 * Create a post with _ti_tpc_template_id meta.
	 */
	public function setUp(): void {
		parent::setUp();
		$admin = new Admin();
		add_action( 'save_post', array( $admin, 'check_unique_template_id_on_save' ) );

		$this->post_id = $this->factory->post->create(
			array(
				'post_title' => 'Test Source Post',
				'post_type'  => 'post',
			)
		);
		update_post_meta( $this->post_id, '_ti_tpc_template_id', 'tpc_template_test_ID' );
		update_post_meta( $this->post_id, '_ti_tpc_template_sync', true );
		update_post_meta( $this->post_id, '_ti_tpc_published', true );
	}

	/**
	 * Clone a post and its meta.
	 *
	 * @return int
	 */
	private function clone_post_and_meta() {
		$post = get_post( $this->post_id );
		$new_post_id = wp_insert_post(
			array(
				'post_title'   => $post->post_title,
				'post_content' => $post->post_content,
				'post_status'  => 'publish',
				'post_type'    => $post->post_type,
			)
		);
		$meta_keys = get_post_custom_keys( $this->post_id );
		foreach ( $meta_keys as $meta_key ) {
			$meta_values = get_post_custom_values( $meta_key, $this->post_id );
			foreach ( $meta_values as $meta_value ) {
				$meta_value = maybe_unserialize( $meta_value );
				add_post_meta( $new_post_id, $meta_key, $meta_value );
			}
		}
		return $new_post_id;
	}

	/**
	 * Test that the post has the meta defined and if cloned the meta is not the same.
	 */
	final public function test_post_meta_and_clone() {
		$this->assertTrue( get_post_meta( $this->post_id, '_ti_tpc_template_id', true ) === 'tpc_template_test_ID' );
		$this->assertTrue( ! empty( get_post_meta( $this->post_id, '_ti_tpc_template_sync', true ) ) );
		$this->assertTrue( ! empty( get_post_meta( $this->post_id, '_ti_tpc_published', true ) ) );

		$clone_post_id = $this->clone_post_and_meta();

		// assert that the new cloned post does not have the same meta as the original.
		var_dump( get_post_meta( $clone_post_id, '_ti_tpc_template_id', true ) );
		$this->assertTrue( $clone_post_id !== $this->post_id );
		$this->assertTrue( get_post_meta( $clone_post_id, '_ti_tpc_template_id', true ) !== 'tpc_template_test_ID' );
		$this->assertTrue( empty( get_post_meta( $clone_post_id, '_ti_tpc_template_sync', true ) ) );
		$this->assertTrue( empty( get_post_meta( $clone_post_id, '_ti_tpc_published', true ) ) );
	}
}