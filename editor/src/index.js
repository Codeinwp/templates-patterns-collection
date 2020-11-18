/* global tiTpc */
import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import './data/index.js';
import { iconBlack as icon } from './icon';
import Exporter from './extension';
import edit from './edit';

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

if ( parseInt( tiTpc.tier ) === 3 ) {
	registerPlugin( 'ti-tpc', {
		render: Exporter,
		icon,
	} );
}
