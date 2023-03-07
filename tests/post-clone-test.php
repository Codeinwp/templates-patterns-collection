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
	private $template_id = 'tpc_template_source_ID';

	/**
	 * Create a post with _ti_tpc_template_id meta.
	 */
	public function setUp(): void {
		parent::setUp();

		$admin = new Admin();
		// Only Hook the save_post action from the Admin class.
		$admin->register_prevent_clone_hooks();
	}

	/**
	 * Check meta value is true. Utility function for better readability.
	 *
	 * @param mixed $value The meta value.
	 *
	 * @return bool
	 */
	private function meta_value_is_true( $value ) {
		return $value === '1' || $value === 'true' || $value === true;
	}

	/**
	 * Create a post with meta.
	 * Utility function to create a post with meta.
	 *
	 * @param string $post_title The post title.
	 * @param string $template_id The template id.
	 *
	 * @return int
	 */
	private function create_post_with_meta( $post_title = 'A test Post', $template_id = 'tpc_template_test_ID', $published = true ) {
		$post_id = $this->factory()->post->create(
			array(
				'post_title' => $post_title,
				'post_type'  => 'post',
			)
		);
		update_post_meta( $post_id, '_ti_tpc_template_id', $template_id );
		update_post_meta( $post_id, '_ti_tpc_template_sync', $published );
		update_post_meta( $post_id, '_ti_tpc_published', $published );
		return $post_id;
	}

	/**
	 * Clone a post and its meta.
	 * Utility function to clone a post and its meta.
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
		$this->post_id = $this->create_post_with_meta( 'The Original Post source', $this->template_id );

		$this->assertTrue( get_post_meta( $this->post_id, '_ti_tpc_template_id', true ) === $this->template_id );
		$this->assertTrue( $this->meta_value_is_true( get_post_meta( $this->post_id, '_ti_tpc_template_sync', true ) ) );
		$this->assertTrue( $this->meta_value_is_true( get_post_meta( $this->post_id, '_ti_tpc_published', true ) ) );

		$clone_post_id = $this->clone_post_and_meta();

		// assert that the new cloned post does not have the same meta as the original.
		$this->assertTrue( $clone_post_id !== $this->post_id );
		$this->assertTrue( get_post_meta( $clone_post_id, '_ti_tpc_template_id', true ) !== $this->template_id );
		$this->assertTrue( ! $this->meta_value_is_true( get_post_meta( $clone_post_id, '_ti_tpc_template_sync', true ) ) );
		$this->assertTrue( ! $this->meta_value_is_true( get_post_meta( $clone_post_id, '_ti_tpc_published', true ) ) );
	}

	final public function test_create_new_post_check_meta_is_not_stripped() {
		$template_id = 'tpcs_new_template_ID_' . time();
		$new_post_id = $this->create_post_with_meta( 'The New Post', $template_id, true );
		$this->assertTrue( get_post_meta( $new_post_id, '_ti_tpc_template_id', true ) === $template_id );
		$this->assertTrue( $this->meta_value_is_true( get_post_meta( $new_post_id, '_ti_tpc_template_sync', true ) ) );
		$this->assertTrue( $this->meta_value_is_true( get_post_meta( $new_post_id, '_ti_tpc_published', true ) ) );

		// attempt to create a post with same template id.
		$new_test_post = $this->create_post_with_meta( 'The New Manual Post', $template_id, true );
		$this->assertTrue( get_post_meta( $new_test_post, '_ti_tpc_template_id', true ) !== $template_id );
		$this->assertTrue( ! $this->meta_value_is_true( get_post_meta( $new_test_post, '_ti_tpc_template_sync', true ) ) );
		$this->assertTrue( ! $this->meta_value_is_true( get_post_meta( $new_test_post, '_ti_tpc_published', true ) ) );
	}

}