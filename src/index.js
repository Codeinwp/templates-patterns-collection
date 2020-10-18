/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { registerBlockType } = wp.blocks;

const { registerPlugin } = wp.plugins;

/**
 * Internal dependencies
 */
import './editor.scss';
import './data/index.js';
import { iconBlack as icon } from './icon.js';
import Exporter from './extension.js';
import edit from './edit.js';

registerBlockType( 'ti-tpc/templates-cloud', {
	title: __( 'Templates Cloud' ),
	description: __( 'A cloud based templates library which enables you to create ready-made website in no time.' ),
	icon,
	category: 'design',
	keywords: [
		'templates cloud',
		'patterns',
		'template library'
	],
	supports: {
		html: false
	},
	edit,
	save: () => null
});

registerPlugin( 'ti-tpc', {
	render: Exporter
});
