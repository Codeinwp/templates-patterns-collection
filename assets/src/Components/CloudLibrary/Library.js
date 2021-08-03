import classnames from 'classnames';
import VizSensor from 'react-visibility-sensor';

import { chevronLeft, chevronRight, close } from '@wordpress/icons';
import { useEffect, useState, Fragment } from '@wordpress/element';
import { withDispatch, withSelect } from '@wordpress/data';
import { Spinner, Button } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { __, isRTL } from '@wordpress/i18n';

import { fetchLibrary } from './common';
import ListItem from './ListItem';
import Loading from '../Loading';
import Filters from './Filters';
import PreviewFrame from './PreviewFrame';
import ImportTemplatesModal from './ImportTemplatesModal';

const Library = ( {
	isGeneral,
	setPreview,
	setInstallModal,
	setTemplateModal,
	templateModal,
	themeStatus,
	currentTab,
} ) => {
	const [ library, setLibrary ] = useState( {
		gutenberg: [],
		elementor: [],
	} );
	const [ type, setType ] = useState( 'gutenberg' );
	const [ toImport, setToImport ] = useState( [] );
	const [ isGrid, setIsGrid ] = useState( isGeneral );
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const [ currentPage, setCurrentPage ] = useState( {
		gutenberg: 0,
		elementor: 0,
		beaver: 0,
	} );
	const [ totalPages, setTotalPages ] = useState( {
		gutenberg: 0,
		elementor: 0,
		beaver: 0,
	} );
	const [ isLoading, setLoading ] = useState( false );
	const [ isSearch, setSearch ] = useState( false );
	const [ isFetching, setFetching ] = useState( false );
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
		setSearchQuery( '' );

		setCurrentPage( {
			gutenberg: 0,
			elementor: 0,
			beaver: 0,
		} );

		setTotalPages( {
			gutenberg: 0,
			elementor: 0,
			beaver: 0,
		} );

		loadTemplates();
	}, [ isGeneral, type ] );

	const EDITORS = {
		gutenberg: {
			label: __( 'Gutenberg' ),
			icon: 'gutenberg.jpg',
		},
		elementor: {
			label: __( 'Elementor' ),
			icon: 'elementor.jpg',
		},
		beaver: {
			label: __( 'Beaver' ),
			icon: 'beaver.jpg',
		},
	};

	const loadTemplates = ( updateItem = {} ) => {
		const params = {
			page: currentPage[ type ],
			per_page: 12,
			type,
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
			setLibrary( {
				...library,
				[ type ]: r.templates,
			} );
			setTotalPages( {
				...totalPages,
				[ type ]: r.total,
			} );
			setLoading( false );
		} );
	};

	const handlePageChange = async ( index = currentPage[ type ] + 1 ) => {
		setFetching( true );
		setCurrentPage( {
			...currentPage,
			[ type ]: index,
		} );

		const params = {
			page: index,
			per_page: 12,
			type,
		};

		if ( isGeneral ) {
			params.template_site_slug = 'general';
			params.premade = true;
		}

		if ( searchQuery ) {
			params.search = searchQuery;
		}

		await fetchLibrary( isGeneral, params ).then( ( r ) => {
			setLibrary( {
				...library,
				[ type ]: [ ...library[ type ], ...r.templates ],
			} );
			setTotalPages( {
				...totalPages,
				[ type ]: r.total,
			} );
		} );

		setFetching( false );
	};

	const handleSearch = ( query = searchQuery ) => {
		setLoading( true );

		if ( query ) {
			setSearch( true );
		} else {
			setSearch( false );
		}

		const params = {
			search: query,
			type,
			...getOrder(),
		};
		if ( isGeneral ) {
			params.template_site_slug = 'general';
			params.premade = true;
		}

		fetchLibrary( isGeneral, params ).then( ( r ) => {
			setLibrary( {
				...library,
				[ type ]: [ ...r.templates ],
			} );
			setTotalPages( {
				...totalPages,
				[ type ]: r.total,
			} );
			setLoading( false );
		} );
	};

	const handlePreview = ( url ) => {
		setPreviewUrl( url );
		setPreview(true);
	};

	const handleClose = () => {
		setPreviewUrl( '' );
		setPreview(false);
	}

	const handleImport = ( id ) => {
		if ( themeStatus ) {
			setInstallModal( true );

			return false;
		}
		setToImport( [ id ] );
		setTemplateModal( true );
	};

	const currentPreviewIndex =
		library[ type ] &&
		library[ type ].findIndex( ( item ) => item.link === previewUrl );
	const previewedItem =
		library[ type ] &&
		library[ type ].find( ( item ) => previewUrl === item.link );
	const wrapClasses = classnames( 'cloud-items', { 'is-grid': isGrid } );

	const handlePrevious = () => {
		let newIndex = currentPreviewIndex - 1;
		if ( currentPreviewIndex === 0 ) {
			newIndex = library[ type ].length - 1;
		}
		setPreviewUrl( library[ type ][ newIndex ].link );
	};

	const handleNext = () => {
		let newIndex = currentPreviewIndex + 1;
		if ( currentPreviewIndex === library[ type ].length - 1 ) {
			newIndex = 0;
		}
		setPreviewUrl( library[ type ][ newIndex ].link );
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
			type,
			...order,
		};

		if ( isGeneral ) {
			params.template_site_slug = 'general';
			params.premade = true;
		}

		fetchLibrary( isGeneral, params ).then( ( r ) => {
			setLibrary( {
				...library,
				[ type ]: [ ...r.templates ],
			} );
			setTotalPages( {
				...totalPages,
				[ type ]: r.total,
			} );
			setLoading( false );
		} );
	};

	return (
		<div className={ wrapClasses }>
			<>
				<div className="editor-tabs">
					{ Object.keys( EDITORS ).map( ( key ) => (
						// eslint-disable-next-line jsx-a11y/anchor-is-valid
						<a
							key={ key }
							href="#"
							onClick={ () => {
								setType( key );
								setSearch( false );
							} }
							className={ classnames( 'tab', {
								active: type === key,
							} ) }
						>
							<span className="icon-wrap">
								<img
									className="editor-icon"
									src={
										window.tiobDash.assets +
										'img/' +
										EDITORS[ key ].icon
									}
									alt={ EDITORS[ key ].label }
								/>
							</span>
							<span className="editor">
								{ EDITORS[ key ].label }
							</span>
						</a>
					) ) }
				</div>
				<Filters
					currentTab={ currentTab }
					isGrid={ isGrid }
					setGrid={ setIsGrid }
					isSearch={ isSearch }
					searchQuery={ searchQuery }
					setSearchQuery={ setSearchQuery }
					onSearch={ handleSearch }
					sortingOrder={ getOrder() }
					setSortingOrder={ setSorting }
					changeOrder={ changeOrder }
				/>
				{ isLoading && <Loading isGrid={ isGrid } /> }
				{ ! isLoading &&
					( library[ type ] && library[ type ].length > 0 ? (
						<>
							<div className="table">
								{ library[ type ].map( ( item ) => (
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

							<VizSensor
								onChange={ ( isVisible ) => {
									if ( ! isVisible ) {
										return false;
									}

									if (
										Number( totalPages[ type ] ) >
										currentPage[ type ]
									) {
										handlePageChange();
									}
								} }
							>
								<span
									style={ {
										height: 10,
										width: 10,
										display: 'block',
									} }
								/>
							</VizSensor>

							{ isFetching && (
								<div className="fetching-loader">
									<Spinner />
								</div>
							) }
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
									onClick={ handleClose }
								/>
								{ library[ type ].length > 1 && (
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
		const { setInstallModalStatus, setTemplateModal, setPreviewStatus } = dispatch(
			'neve-onboarding'
		);

		return {
			setPreview: ( status ) => setPreviewStatus( status ),
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
