/* global tiTpc */
import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import './data/index.js';
import { iconBlack as icon } from './icon';
import Exporter from './plugins/extension';
import SiteEditorExporter from './plugins/site-editor-extension';
import WrappedTpcTemplatesButton from './plugins/wrapped-tpc-templates-button'; // Adjust the import path based on your file structure

import edit from './edit';

if ( ! tiTpc.isSiteEditor ) {
	registerBlockType( 'ti-tpc/templates-cloud', {
		title: __( 'Templates Cloud', 'templates-patterns-collection' ),
		description: __(
			'A cloud based templates library which enables you to create ready-made website in no time.',
			'templates-patterns-collection'
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

	registerPlugin( 'ti-tpc-templates-button', {
		render: WrappedTpcTemplatesButton,
	} );
}

registerPlugin( 'ti-tpc', {
	render: tiTpc.isSiteEditor ? SiteEditorExporter : Exporter,
	icon,
} );
