import { __ } from '@wordpress/i18n';
import { Placeholder, Spinner } from '@wordpress/components';
import { withSelect, useDispatch } from '@wordpress/data';
import { Fragment, useEffect, useState } from '@wordpress/element';

import classnames from 'classnames';

import Filters from './filters';
import ListItem from './list-item';
import Pagination from './pagination';
import { fetchLibrary, fetchTemplates } from './../data/templates-cloud/index';

const TemplatesContent = ( {
	importBlocks,
	isGeneral = false,
	isFetching,
	items,
	currentPage,
	totalPages,
	getOrder,
	setQuery,
	getSearchQuery,
	setSorting,
} ) => {
	const { setFetching } = useDispatch( 'tpc/block-editor' );
	const [ layout, setLayout ] = useState( 'grid' );

	const init = async () => {
		setFetching( true );
		const order = getOrder();
		if ( isGeneral ) {
			await fetchTemplates( {
				search: getSearchQuery(),
				...order,
			} );
		} else {
			await fetchLibrary( {
				search: getSearchQuery(),
				...order,
			} );
		}
		setFetching( false );
	};

	useEffect( () => {
		if ( items && items.length > 0 ) {
			return;
		}
		init();
	}, [ isGeneral ] );

	const changePage = async ( index ) => {
		setFetching( true );
		const order = getOrder();
		if ( isGeneral ) {
			await fetchTemplates( {
				search: getSearchQuery(),
				page: index,
				...order,
			} );
		} else {
			await fetchLibrary( {
				search: getSearchQuery(),
				page: index,
				...order,
			} );
		}

		setFetching( false );
	};

	const onSearch = async () => {
		setFetching( true );
		const order = getOrder();
		if ( isGeneral ) {
			await fetchTemplates( {
				search: getSearchQuery(),
				...order,
			} );
		} else {
			await fetchLibrary( {
				search: getSearchQuery(),
				...order,
			} );
		}

		setFetching( false );
	};

	const changeOrder = async ( order ) => {
		setFetching( true );
		if ( isGeneral ) {
			await fetchTemplates( {
				...order,
				search: getSearchQuery(),
			} );
		} else {
			await fetchLibrary( {
				...order,
				search: getSearchQuery(),
			} );
		}

		setFetching( false );
	};

	if ( isFetching ) {
		return (
			<Fragment>
				<Filters
					layout={ layout }
					sortingOrder={ getOrder() }
					setLayout={ setLayout }
					searchQuery={ getSearchQuery() }
					onSearch={ onSearch }
					setSearchQuery={ setQuery }
					setSortingOrder={ setSorting }
					changeOrder={ changeOrder }
				/>

				<Placeholder>
					<Spinner />
				</Placeholder>
			</Fragment>
		);
	}

	if ( ! Boolean( items.length ) ) {
		return (
			<div className="table-content">
				<Filters
					layout={ layout }
					sortingOrder={ getOrder() }
					setLayout={ setLayout }
					searchQuery={ getSearchQuery() }
					onSearch={ onSearch }
					setSearchQuery={ setQuery }
					setSortingOrder={ setSorting }
					changeOrder={ changeOrder }
				/>

				{ __( 'No templates available. Add a new one?' ) }
			</div>
		);
	}

	const contentClasses = classnames( 'table-content', {
		'is-grid': 'grid' === layout,
	} );

	return (
		<Fragment>
			<Filters
				layout={ layout }
				sortingOrder={ getOrder() }
				setLayout={ setLayout }
				searchQuery={ getSearchQuery() }
				onSearch={ onSearch }
				setSearchQuery={ setQuery }
				setSortingOrder={ setSorting }
				changeOrder={ changeOrder }
			/>

			<div className={ contentClasses }>
				{ items.map( ( item ) => (
					<ListItem
						sortingOrder={ getOrder() }
						deletable={ ! isGeneral }
						key={ item.template_id }
						layout={ layout }
						item={ item }
						importBlocks={ importBlocks }
					/>
				) ) }
			</div>

			<Pagination
				onChange={ changePage }
				current={ currentPage }
				total={ totalPages }
			/>
		</Fragment>
	);
};

export default withSelect( ( select, { isGeneral } ) => {
	const library = isGeneral
		? select( 'tpc/block-editor' ).getTemplates()
		: select( 'tpc/block-editor' ).getLibrary();
	const { items = [], currentPage, totalPages } = library;
	return { items, currentPage, totalPages };
} )( TemplatesContent );
