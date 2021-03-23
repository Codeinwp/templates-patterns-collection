import classnames from 'classnames';
import { Placeholder, Spinner } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { Fragment, useEffect, useState } from '@wordpress/element';

import Filters from './filters';
import ListItem from './list-item';
import Pagination from './pagination';
import { fetchLibrary, fetchTemplates } from './../data/templates-cloud/index';

const TemplatesContent = ( {
	importTemplate,
	isGeneral = false,
	isFetching,
	getOrder,
	setQuery,
	getSearchQuery,
	setSorting,
	isSearch,
	setSearch,
} ) => {
	const { items, currentPage, totalPages } = useSelect( ( select ) => {
		return isGeneral
			? select( 'tpc/beaver' ).getTemplates()
			: select( 'tpc/beaver' ).getLibrary();
	} );

	const { setFetching } = useDispatch( 'tpc/beaver' );
	const [ layout, setLayout ] = useState( 'grid' );

	const init = async () => {
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

	const onSearch = async ( search = getSearchQuery() ) => {
		setFetching( true );

		if ( search ) {
			setSearch( true );
		} else {
			setSearch( false );
		}

		const order = getOrder();
		if ( isGeneral ) {
			await fetchTemplates( {
				search,
				...order,
			} );
		} else {
			await fetchLibrary( {
				search,
				...order,
			} );
		}

		setFetching( false );
	};

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
					isSearch={ isSearch }
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
					isSearch={ isSearch }
				/>

				{ window.tiTpc.library[ 404 ] }
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
				isSearch={ isSearch }
			/>

			<div className={ contentClasses }>
				{ items.map( ( item ) => (
					<ListItem
						sortingOrder={ getOrder() }
						deletable={ ! isGeneral }
						key={ item.template_id }
						layout={ layout }
						item={ item }
						importTemplate={ importTemplate }
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

export default TemplatesContent;
