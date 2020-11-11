import { stringifyUrl } from 'query-string';
import classnames from 'classnames';

import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';
import { useEffect, useState, Fragment } from '@wordpress/element';

import ListItem from './CloudLibrary/ListItem';
import Filters from './CloudLibrary/Filters';
import Pagination from '../../../editor/src/components/pagination';

const Library = ( { isGeneral } ) => {
	const [ library, setLibrary ] = useState( [] );
	const [ isGrid, setIsGrid ] = useState( true );
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const [ currentPage, setCurrentPage ] = useState( 0 );
	const [ totalPages, setTotalPages ] = useState( 0 );

	useEffect( () => {
		setLoading( true );
		const params = {};

		if ( isGeneral ) {
			params.template_site_slug = 'general';
			params.premade = true;
		}
		loadTemplates( params );
	}, [ isGeneral ] );

	const [ isLoading, setLoading ] = useState( false );

	const loadTemplates = async ( params = {} ) => {
		const url = stringifyUrl( {
			url: window.tiobDash.endpoint,
			query: {
				cache: window.localStorage.getItem( 'tpcCacheBuster' ),
				...window.tiobDash.params,
				per_page: 8,
				page: currentPage,
				...params,
			},
		} );

		try {
			const response = await apiFetch( {
				url,
				method: 'GET',
				parse: false,
			} );

			if ( response.ok ) {
				const templates = await response.json();

				if ( templates.message ) {
					console.log( templates.message );
				}

				const total = response.headers.get( 'x-wp-totalpages' );
				setLibrary( templates );
				setTotalPages( total );
			}
		} catch ( error ) {
			if ( error.message ) {
				console.log( error.message );
			}
		}
		setLoading( false );
	};

	const changePage = async ( index ) => {
		setLoading( true );
		setCurrentPage( index );
		if ( isGeneral ) {
			await loadTemplates( {
				page: index,
				template_site_slug: 'general',
				premade: true,
			} );
		} else {
			await loadTemplates( {
				page: index,
			} );
		}

		setLoading( false );
	};

	const onSearch = () => {
		const params = { search: searchQuery };
		if ( isGeneral ) {
			params.template_site_slug = 'general';
			params.premade = true;
		}

		loadTemplates( params );
	};

	const wrapClasses = classnames( 'cloud-items', { 'is-grid': isGrid } );

	return (
		<div className={ wrapClasses }>
			{ isLoading ? (
				<Spinner />
			) : (
				<>
					<Filters
						isGrid={ isGrid }
						setGrid={ setIsGrid }
						searchQuery={ searchQuery }
						setSearchQuery={ setSearchQuery }
						onSearch={ onSearch }
					/>

					{ library.length > 0 ? (
						<>
							<div className="table">
								{ library.map( ( item ) => (
									<ListItem
										userTemplate={ ! isGeneral }
										key={ item.template_id }
										item={ item }
										loadTemplates={ loadTemplates }
										grid={ isGrid }
									/>
								) ) }
							</div>
							<Pagination
								total={ totalPages }
								current={ currentPage }
								onChange={ changePage }
							/>
						</>
					) : (
						<Fragment>{ __( 'No templates found.' ) }</Fragment>
					) }
				</>
			) }
		</div>
	);
};

export default Library;
