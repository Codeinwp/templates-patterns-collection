/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { Fragment, useEffect } from '@wordpress/element';

import {
	fetchTemplates,
	fetchLibrary,
} from './../data/templates-cloud/index.js';

import Template from './template.js';

const TemplatesContent = ( {
	isFetching,
	isGeneral,
	setFetching,
	items,
	currentPage,
	totalPages,
} ) => {
	const init = async () => {
		setFetching( true );
		if ( isGeneral ) {
			await fetchTemplates();
		} else {
			await fetchLibrary();
		}
		setFetching( false );
	};

	useEffect( () => {
		init();
	}, [ isGeneral ] );

	return (
		<Fragment>
			{ items.map( ( item ) => (
				<Template
					key={ item.template_id }
					id={ item.template_id }
					title={ item.template_name }
					thumbnail={ item.template_thumbnail }
					link={ item.link }
				/>
			) ) }
		</Fragment>
	);
};

export default compose(
	withSelect( ( select, { isGeneral } ) => {
		const library = isGeneral
			? select( 'tpc/elementor' ).getTemplates()
			: select( 'tpc/elementor' ).getLibrary();

		const { items = [], currentPage, totalPages } = library;

		return { items, currentPage, totalPages };
	} ),
	withDispatch( ( dispatch ) => {
		const { setFetching } = dispatch( 'tpc/elementor' );

		return {
			setFetching,
		};
	} )
)( TemplatesContent );
