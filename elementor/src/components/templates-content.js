import useInfiniteScroll from 'react-infinite-scroll-hook';
import classnames from 'classnames';
import { Button, Placeholder, Spinner } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { Fragment, useState } from '@wordpress/element';

import Template from './template.js';

import {
	fetchTemplates,
	fetchLibrary,
} from './../data/templates-cloud/index.js';

const sortByOptions = {
	template_name: window.tiTpc.library.filters.sortLabels.name,
	date: window.tiTpc.library.filters.sortLabels.date,
	modified: window.tiTpc.library.filters.sortLabels.modified,
};

const TemplatesContent = ( {
	getSearchQuery,
	getOrder,
	setSorting,
	onImport,
	onUpdateTemplate,
	onDelete,
	onDuplicate,
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
				...order,
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
			className={ classnames(
				'ti-tpc-template-library-templates-container',
				{
					'is-table': ! isGeneral,
				}
			) }
			ref={ infiniteRef }
		>
			{ isGeneral ? (
				items.map( ( item ) => (
					<Template
						key={ item.template_id }
						item={ item }
						id={ item.template_id }
						title={ item.template_name }
						thumbnail={ item.template_thumbnail }
						onImport={ onImport }
					/>
				) )
			) : (
				<Fragment>
					<div className="ti-tpc-template-library-templates-table-header">
						{ Object.keys( sortByOptions ).map( ( i ) => (
							<div
								key={ i }
								className="ti-tpc-template-library-templates-table-column"
							>
								<Button
									className={ classnames( {
										'is-selected': i === getOrder().orderby,
										'is-asc': 'ASC' === getOrder().order,
									} ) }
									onClick={ () => {
										const order = {
											order: 'DESC',
											orderby: i,
										};

										if ( i === getOrder().orderby ) {
											if ( 'DESC' === getOrder().order ) {
												order.order = 'ASC';
											}
										}
										setSorting( {
											...order,
										} );
									} }
								>
									{ sortByOptions[ i ] }
								</Button>
							</div>
						) ) }
						<div className="ti-tpc-template-library-templates-table-column">
							<Button>
								{
									window.tiTpc.library.filters.sortLabels
										.actions
								}
							</Button>
						</div>
					</div>

					{ items.map( ( item ) => (
						<Template
							table={ true }
							key={ item.template_id }
							item={ item }
							id={ item.template_id }
							title={ item.template_name }
							onImport={ onImport }
							onUpdateTemplate={ onUpdateTemplate }
							onDelete={ onDelete }
							onDuplicate={ ( id ) => onDuplicate( id ) }
						/>
					) ) }
				</Fragment>
			) }

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
