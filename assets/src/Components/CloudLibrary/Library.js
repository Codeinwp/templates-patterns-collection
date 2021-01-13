import classnames from 'classnames';

import { chevronLeft, chevronRight, close } from '@wordpress/icons';
import { useEffect, useState, Fragment } from '@wordpress/element';
import { withDispatch, withSelect } from '@wordpress/data';
import { Spinner, Button } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { __, isRTL } from '@wordpress/i18n';

import { fetchLibrary } from './common';
import ListItem from './ListItem';
import Filters from './Filters';
import PreviewFrame from './PreviewFrame';
import ImportTemplatesModal from './ImportTemplatesModal';
import Pagination from '../../../../editor/src/components/pagination';

const Library = ( {
	isGeneral,
	setInstallModal,
	setTemplateModal,
	templateModal,
	themeStatus,
	currentTab,
} ) => {
	const [ library, setLibrary ] = useState( [] );
	const [ toImport, setToImport ] = useState( [] );
	const [ isGrid, setIsGrid ] = useState( isGeneral );
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const [ currentPage, setCurrentPage ] = useState( 0 );
	const [ totalPages, setTotalPages ] = useState( 0 );
	const [ isLoading, setLoading ] = useState( false );
	const [ previewUrl, setPreviewUrl ] = useState( '' );

	const [ sortingOrder, setSortingOrder ] = useState( {
		templates: {
			order: 'DESC',
			orderby: 'date',
		},
		library: {
			order: 'DESC',
			orderby: 'date',
		},
	} );

	useEffect( () => {
		setLoading( true );
		loadTemplates();
	}, [ isGeneral ] );

	const loadTemplates = ( updateItem = {} ) => {
		const params = {
			page: currentPage,
			per_page: 12,
			...updateItem,
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

	const handlePageChange = async ( index ) => {
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

	const handleSearch = () => {
		setLoading( true );
		const params = {
			search: searchQuery,
			...getOrder(),
		};
		if ( isGeneral ) {
			params.template_site_slug = 'general';
			params.premade = true;
		}

		fetchLibrary( isGeneral, params ).then( ( r ) => {
			setLibrary( r.templates );
			setTotalPages( r.total );
			setLoading( false );
		} );
	};

	const handlePreview = ( url ) => {
		setPreviewUrl( url );
	};

	const handleImport = ( id ) => {
		if ( themeStatus ) {
			setInstallModal( true );

			return false;
		}
		setToImport( [ id ] );
		setTemplateModal( true );
	};

	const currentPreviewIndex =
		library && library.findIndex( ( item ) => item.link === previewUrl );
	const previewedItem =
		library && library.find( ( item ) => previewUrl === item.link );
	const wrapClasses = classnames( 'cloud-items', { 'is-grid': isGrid } );

	const handlePrevious = () => {
		let newIndex = currentPreviewIndex - 1;
		if ( currentPreviewIndex === 0 ) {
			newIndex = library.length - 1;
		}
		setPreviewUrl( library[ newIndex ].link );
	};

	const handleNext = () => {
		let newIndex = currentPreviewIndex + 1;
		if ( currentPreviewIndex === library.length - 1 ) {
			newIndex = 0;
		}
		setPreviewUrl( library[ newIndex ].link );
	};

	const getOrder = () => {
		if ( isGeneral ) {
			return sortingOrder.templates;
		}

		return sortingOrder.library;
	};

	const setSorting = ( order ) => {
		if ( isGeneral ) {
			return setSortingOrder( {
				...sortingOrder,
				templates: order,
			} );
		}

		return setSortingOrder( {
			...sortingOrder,
			library: order,
		} );
	};

	const changeOrder = async ( order ) => {
		setLoading( true );
		const params = {
			search: searchQuery,
			...order,
		};
		if ( isGeneral ) {
			params.template_site_slug = 'general';
			params.premade = true;
		}

		fetchLibrary( isGeneral, params ).then( ( r ) => {
			setLibrary( r.templates );
			setTotalPages( r.total );
			setLoading( false );
		} );
	};

	return (
		<div className={ wrapClasses }>
			<>
				<Filters
					currentTab={ currentTab }
					isGrid={ isGrid }
					setGrid={ setIsGrid }
					searchQuery={ searchQuery }
					setSearchQuery={ setSearchQuery }
					onSearch={ handleSearch }
					sortingOrder={ getOrder() }
					setSortingOrder={ setSorting }
					changeOrder={ changeOrder }
				/>
				{ isLoading && <Spinner /> }
				{ ! isLoading &&
					( library && library.length > 0 ? (
						<>
							<div className="table">
								{ library.map( ( item ) => (
									<ListItem
										sortingOrder={ getOrder() }
										onPreview={ handlePreview }
										userTemplate={ ! isGeneral }
										key={ item.template_id }
										item={ item }
										loadTemplates={ loadTemplates }
										onImport={ () => handleImport( item ) }
										grid={ isGrid }
									/>
								) ) }
							</div>
							<Pagination
								total={ totalPages }
								current={ currentPage }
								onChange={ handlePageChange }
							/>
						</>
					) : (
						<Fragment>{ __( 'No templates found.' ) }</Fragment>
					) ) }
				{ previewUrl && (
					<PreviewFrame
						previewUrl={ previewUrl }
						rightButtons={
							<Button
								isPrimary
								onClick={ () => handleImport( previewedItem ) }
							>
								{ __( 'Import Template' ) }
							</Button>
						}
						heading={ previewedItem.template_name }
						leftButtons={
							<>
								<Button
									icon={ close }
									onClick={ () => setPreviewUrl( '' ) }
								/>
								{ library.length > 1 && (
									<>
										<Button
											icon={
												isRTL()
													? chevronRight
													: chevronLeft
											}
											onClick={ handlePrevious }
										/>
										<Button
											icon={
												isRTL()
													? chevronLeft
													: chevronRight
											}
											onClick={ handleNext }
										/>
									</>
								) }
							</>
						}
					/>
				) }
			</>
			{ templateModal &&
				toImport &&
				! isLoading &&
				toImport.length > 0 && (
				<ImportTemplatesModal
					generalTemplates={ true }
					isUserTemplate={ ! isGeneral }
					templatesData={ toImport }
				/>
			) }
		</div>
	);
};

export default compose(
	withDispatch( ( dispatch ) => {
		const { setInstallModalStatus, setTemplateModal } = dispatch(
			'neve-onboarding'
		);

		return {
			setInstallModal: ( status ) => setInstallModalStatus( status ),
			setTemplateModal,
		};
	} ),
	withSelect( ( select ) => {
		const {
			getTemplateModal,
			getThemeAction,
			getCurrentEditor,
			getCurrentTab,
		} = select( 'neve-onboarding' );

		return {
			templateModal: getTemplateModal(),
			themeStatus: getThemeAction().action || false,
			editor: getCurrentEditor(),
			currentTab: getCurrentTab(),
		};
	} )
)( Library );
