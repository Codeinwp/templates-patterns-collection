import classnames from 'classnames';

import { __ } from '@wordpress/i18n';
import { Spinner, Button } from '@wordpress/components';
import { close } from '@wordpress/icons';
import { useEffect, useState, Fragment } from '@wordpress/element';

import { fetchLibrary } from './common';
import ListItem from './ListItem';
import Filters from './Filters';
import PreviewFrame from './PreviewFrame';
import Pagination from '../../../../editor/src/components/pagination';

const Library = ( { isGeneral } ) => {
	const [ library, setLibrary ] = useState( [] );
	const [ isGrid, setIsGrid ] = useState( isGeneral );
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const [ currentPage, setCurrentPage ] = useState( 0 );
	const [ totalPages, setTotalPages ] = useState( 0 );
	const [ previewUrl, setPreviewUrl ] = useState( '' );

	useEffect( () => {
		setLoading( true );
		loadTemplates();
	}, [ isGeneral ] );

	const loadTemplates = () => {
		const params = {
			page: currentPage,
			per_page: 12,
		};

		if ( isGeneral ) {
			params.template_site_slug = 'general';
			params.premade = true;
		}

		if ( searchQuery ) {
			params.search = searchQuery;
		}

		fetchLibrary( isGeneral, params ).then( ( r ) => {
			setLibrary( r.templates );
			setTotalPages( r.total );
			setLoading( false );
		} );
	};

	const [ isLoading, setLoading ] = useState( false );

	const changePage = async ( index ) => {
		setLoading( true );
		setCurrentPage( index );

		const params = {
			page: index,
			per_page: 12,
		};

		if ( isGeneral ) {
			params.template_site_slug = 'general';
			params.premade = true;
		}

		if ( searchQuery ) {
			params.search = searchQuery;
		}

		await fetchLibrary( isGeneral, params ).then( ( r ) => {
			setLibrary( r.templates );
			setTotalPages( r.total );
		} );

		setLoading( false );
	};

	const onSearch = () => {
		const params = { search: searchQuery };
		if ( isGeneral ) {
			params.template_site_slug = 'general';
			params.premade = true;
		}

		fetchLibrary( isGeneral, params ).then( ( r ) => {
			setLibrary( r.templates );
			setTotalPages( r.total );
		} );
	};

	const handlePreview = ( url ) => {
		setPreviewUrl( url );
	};

	const wrapClasses = classnames( 'cloud-items', { 'is-grid': isGrid } );

	return (
		<div className={ wrapClasses }>
			<>
				<Filters
					isGrid={ isGrid }
					setGrid={ setIsGrid }
					searchQuery={ searchQuery }
					setSearchQuery={ setSearchQuery }
					onSearch={ onSearch }
				/>
				{ isLoading && <Spinner /> }
				{ ! isLoading &&
					( library.length > 0 ? (
						<>
							<div className="table">
								{ library.map( ( item ) => (
									<ListItem
										onPreview={ handlePreview }
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
					) ) }
				{ previewUrl && (
					<PreviewFrame
						previewUrl={ previewUrl }
						leftButtons={
							<Button
								icon={ close }
								onClick={ () => setPreviewUrl( '' ) }
							/>
						}
					/>
				) }
			</>
		</div>
	);
};

export default Library;
