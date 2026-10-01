<?php
/**
 * Minimal Beaver Builder stubs for loading TI_Beaver without the plugin.
 *
 * Declares global FLBuilder* classes, so it must only ever be loaded from an
 * isolated process.
 *
 * @package templates-patterns-collection
 */

/**
 * Class FLBuilderModule, reduced to the script storage TI_Beaver relies on.
 */
class FLBuilderModule {
	/**
	 * Module directory url.
	 *
	 * @var string
	 */
	public $url = '';

	/**
	 * Scripts added with add_js(), keyed by handle.
	 *
	 * @var array<string, array{0: string|null, 1: list<string>|null, 2: string|bool|null, 3: bool|null}>
	 */
	public $js = array();

	/**
	 * Styles added with add_css(), keyed by handle.
	 *
	 * @var array<string, array{0: string|null, 1: list<string>|null, 2: string|bool|null, 3: string|null}>
	 */
	public $css = array();

	/**
	 * Module constructor.
	 *
	 * @param array{name: string, description: string, category: string, dir: string, url: string, icon: string} $params Module params.
	 */
	public function __construct( array $params ) {
		$this->url = trailingslashit( $params['url'] );
	}

	/**
	 * Store a script for later enqueueing.
	 *
	 * @param string            $handle    Script handle.
	 * @param string|null       $src       Script url.
	 * @param list<string>|null $deps      Dependencies.
	 * @param string|bool|null  $ver       Version.
	 * @param bool|null         $in_footer Load in footer.
	 *
	 * @return void
	 */
	public function add_js( string $handle, ?string $src = null, ?array $deps = null, $ver = null, ?bool $in_footer = null ): void {
		$this->js[ $handle ] = array( $src, $deps, $ver, $in_footer );
	}

	/**
	 * Store a style for later enqueueing.
	 *
	 * @param string            $handle Style handle.
	 * @param string|null       $src    Style url.
	 * @param list<string>|null $deps   Dependencies.
	 * @param string|bool|null  $ver    Version.
	 * @param string|null       $media  Media.
	 *
	 * @return void
	 */
	public function add_css( string $handle, ?string $src = null, ?array $deps = null, $ver = null, ?string $media = null ): void {
		$this->css[ $handle ] = array( $src, $deps, $ver, $media );
	}

	/**
	 * Hook for subclasses; untyped so TI_Beaver's override stays compatible.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
	}
}

/**
 * Class FLBuilder.
 */
class FLBuilder {
	/**
	 * Register a module class.
	 *
	 * @param string              $class Module class.
	 * @param array<string, mixed> $form  Settings form.
	 *
	 * @return void
	 */
	public static function register_module( string $class, array $form ): void {
	}

	/**
	 * Same order as Beaver: module hook first, then the stored scripts.
	 *
	 * @param FLBuilderModule $module Module instance.
	 *
	 * @return void
	 */
	public static function enqueue_module_layout_styles_scripts( FLBuilderModule $module ): void {
		$module->enqueue_scripts();

		foreach ( $module->js as $handle => $props ) {
			wp_enqueue_script( $handle, $props[0], $props[1], $props[2], $props[3] );
		}
	}
}
