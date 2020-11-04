/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { registerPlugin } from '@wordpress/plugins';

/**
 * Internal dependencies
 */
import './editor.scss';
import './data/index.js';
import { iconBlack as icon } from './icon.js';
import Exporter from './extension.js';
import edit from './edit.js';

if ( 'free' !== window.tiTpc.params.license_id ) {
	registerBlockType( 'ti-tpc/templates-cloud', {
		title: __( 'Templates Cloud' ),
		description: __(
			'A cloud based templates library which enables you to create ready-made website in no time.'
		),
		icon,
		category: 'design',
		keywords: [ 'templates cloud', 'patterns', 'template library' ],
		supports: {
			html: false,
		},
		edit,
		save: () => null,
	} );

	registerPlugin( 'ti-tpc', {
		render: Exporter,
		icon,
	} );
}
