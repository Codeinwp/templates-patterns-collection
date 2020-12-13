import useInfiniteScroll from 'react-infinite-scroll-hook';
import { Placeholder, Spinner } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';

import Template from './template.js';

import {
	fetchTemplates,
	fetchLibrary,
} from './../data/templates-cloud/index.js';

const TemplatesContent = ( {
	getSearchQuery,
	getOrder,
	onImport,
	isGeneral,
	items,
	currentPage,
	totalPages,
} ) => {
	const [ isLoading, setLoading ] = useState( false );

	const onLoadMore = async () => {
		if ( currentPage === totalPages ) {
			return;
		}

		setLoading( true );

		const order = getOrder();
		if ( isGeneral ) {
			await fetchTemplates( {
				search: getSearchQuery(),
				page: currentPage + 1,
				isScroll: true,
				...order,
			} );
		} else {
			await fetchLibrary( {
				search: getSearchQuery(),
				page: currentPage + 1,
				isScroll: true,
				...order
			} );
		}
		setLoading( false );
	};

	const infiniteRef = useInfiniteScroll( {
		loading: isLoading,
		hasNextPage: currentPage !== totalPages,
		onLoadMore,
		threshold: 1,
	} );

	return (
		<div
			className="ti-tpc-template-library-templates-container"
			ref={ infiniteRef }
		>
			{ items.map( ( item ) => (
				<Template
					key={ item.template_id }
					item={ item }
					id={ item.template_id }
					title={ item.template_name }
					thumbnail={ item.template_thumbnail }
					onImport={ onImport }
				/>
			) ) }

			{ 0 === items.length &&
				( isGeneral ? (
					<p>{ 'No templates found. Check again later!' }</p>
				) : (
					<p>
						{ 'No templates available. Try adding few templates.' }
					</p>
				) ) }

			{ isLoading && (
				<Placeholder>
					<Spinner />
				</Placeholder>
			) }
		</div>
	);
};

export default withSelect( ( select, { isGeneral } ) => {
	const library = isGeneral
		? select( 'tpc/elementor' ).getTemplates()
		: select( 'tpc/elementor' ).getLibrary();

	const { items = [], currentPage, totalPages } = library;

	return { items, currentPage, totalPages };
} )( TemplatesContent );
