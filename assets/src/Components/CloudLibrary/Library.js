/* global tiobDash */
import classnames from 'classnames';
import VizSensor from 'react-visibility-sensor';

import { chevronLeft, chevronRight, close } from '@wordpress/icons';
import { useEffect, useState, Fragment, useContext } from '@wordpress/element';
import { withDispatch, withSelect } from '@wordpress/data';
import { Spinner, Button, Icon } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { __, isRTL } from '@wordpress/i18n';

import { fetchLibrary } from './common';
import ListItem from './ListItem';
import Loading from '../Loading';
import Filters from './Filters';
import PreviewFrame from './PreviewFrame';
import ImportTemplatesModal from './ImportTemplatesModal';
import Logo from '../Icon';
import { LicensePanelContext } from '../LicensePanelContext';
import FeedbackNotice from './FeedbackNotice';
import {EDITOR_MAP} from '../../utils/common';
import EditorSelector from '../EditorSelector';

const Library = ( {
	isGeneral,
	setPreview,
	setTemplateModal,
	templateModal,
	currentTab,
	userStatus,
	themeData,
} ) => {
	const [ library, setLibrary ] = useState( {
		gutenberg: [],
		elementor: [],
	} );
	const [ type, setType ] = useState( 'gutenberg' );
	const [ toImport, setToImport ] = useState( [] );
	const [ isGrid, setIsGrid ] = useState( isGeneral );
	const [ showFSE, setShowFSE ] = useState(
		tiobDash.isFSETheme
			? window?.localStorage?.tpcShowFse === 'true'
			: false
	);
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
			label: __( 'Gutenberg', 'templates-patterns-collection' ),
			icon: 'gutenberg.jpg',
		},
		elementor: {
			label: __( 'Elementor', 'templates-patterns-collection' ),
			icon: 'elementor.jpg',
		},
		beaver: {
			label: __( 'Beaver', 'templates-patterns-collection' ),
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

		if ( type === 'gutenberg' && showFSE ) {
			params.type = [ 'gutenberg', 'fse' ];
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

		if ( type === 'gutenberg' && showFSE ) {
			params.type = [ 'gutenberg', 'fse' ];
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

	const handleFSEToggle = () => {
		setLoading( true );

		const newValue = ! showFSE;
		setShowFSE( newValue );
		window.localStorage.setItem( 'tpcShowFse', newValue.toString() );

		const params = {
			search: searchQuery,
			type,
			...getOrder(),
		};

		if ( isGeneral ) {
			params.template_site_slug = 'general';
			params.premade = true;
		}

		if ( type === 'gutenberg' && newValue ) {
			params.type = [ 'gutenberg', 'fse' ];
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
		setPreview( true );
	};

	const handleClose = () => {
		setPreviewUrl( '' );
		setPreview( false );
	};

	const handleImport = ( id ) => {
		setToImport( [ id ] );
		setTemplateModal( true );
	};

	const currentPreviewIndex =
		library[ type ] &&
		library[ type ].findIndex( ( item ) => item.link === previewUrl );
	const previewedItem =
		library[ type ] &&
		library[ type ].find( ( item ) => previewUrl === item.link );
	const wrapClasses = classnames( 'cloud-items', {
		'is-grid': isGrid || ( ! userStatus && ! isGeneral ),
		'is-dummy': ( ! userStatus && ! isGeneral ) || themeData !== false,
	} );

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

	const { upgradeURLTpc } = window.tiobDash;

	const UpsellModal = ( {
		title,
		description,
		showUpgradeBtn = true,
		showLicenseToggle = true,
	} ) => {
		const { setLicenseOpen } = useContext( LicensePanelContext );

		return (
			<div className={ wrapClasses }>
				<div className="table">
					{ [ ...Array( 12 ) ].map( ( i, n ) => (
						<ListItem
							sortingOrder={ getOrder() }
							onPreview={ handlePreview }
							userTemplate={ false }
							key={ n }
							item={ {} }
							grid={ true }
						/>
					) ) }
				</div>

				<div className="upsell-modal-overlay">
					<div className="upsell-modal">
						<div className="upsell-modal-content">
							<div className="info">
								<h3>{ title }</h3>

								<p
									dangerouslySetInnerHTML={ {
										__html: description,
									} }
								></p>

								{ showUpgradeBtn && (
									<Button
										variant="primary"
										isPrimary
										href={ upgradeURLTpc }
										target="_blank"
									>
										{ __(
											'Upgrade to PRO',
											'templates-patterns-collection'
										) }
									</Button>
								) }

								{ showLicenseToggle && (
									<Button isLink style={{ marginLeft: '12px' }} href={ tiobDash?.tiobSettings }>
										{ __( 'I already have a key', 'templates-patterns-collection' ) }
									</Button>
								) }
							</div>
							<div className="icon">
								<Icon icon={ Logo } />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	if ( ! userStatus && ! isGeneral ) {
		return (
			<UpsellModal
				title={ __(
					'Templates Cloud is a PRO Feature',
					'templates-patterns-collection'
				) }
				description={ __(
					'Unlock the Templates Cloud features and save your pages or posts in the cloud.',
					'templates-patterns-collection'
				) }
			/>
		);
	}

	return (
		<div className={ wrapClasses }>
			<>
				<div style={ { display: "flex" } }>
					<FeedbackNotice importTemplate={templateModal} />
				</div>
				<Filters
					currentTab={ currentTab }
					isGrid={ isGrid }
					showFSE={ showFSE }
					setShowFSE={ handleFSEToggle }
					setGrid={ setIsGrid }
					isSearch={ isSearch }
					searchQuery={ searchQuery }
					setSearchQuery={ setSearchQuery }
					onSearch={ handleSearch }
					sortingOrder={ getOrder() }
					setSortingOrder={ setSorting }
					changeOrder={ changeOrder }
					type={ type }
					setType={ setType }
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
						<div className="empty-information">
							<img
								src={
									window.tiobDash.assets + '/img/layout.jpg'
								}
								alt={ __(
									'No Templates Found',
									'templates-patterns-collection'
								) }
							/>
							<h3>
								{ __(
									'There are no templates yet',
									'templates-patterns-collection'
								) }
							</h3>
							<p>
								{ __(
									'You can add a page or post to the cloud by accessing it with the WordPress or Elementor/Beaver editor. Learn more about this in our docs.',
									'templates-patterns-collection'
								) }
							</p>
							<Button
								variant="secondary"
								isSecondary
								href="https://docs.themeisle.com/article/1354-neve-template-cloud-library?utm_medium=nevedashboard&utm_source=wpadmin&utm_campaign=templatescloud&utm_content=neve"
								target="_blank"
							>
								{ __(
									'Learn more',
									'templates-patterns-collection'
								) }
							</Button>
						</div>
					) ) }
				{ previewUrl && (
					<PreviewFrame
						previewUrl={ previewUrl }
						rightButtons={
							<Button
								isPrimary
								onClick={ () => handleImport( previewedItem ) }
							>
								{ __(
									'Import Template',
									'templates-patterns-collection'
								) }
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
		const {
			setInstallModalStatus,
			setTemplateModal,
			setPreviewStatus,
		} = dispatch( 'neve-onboarding' );

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
			getUserStatus,
		} = select( 'neve-onboarding' );

		return {
			templateModal: getTemplateModal(),
			themeData: getThemeAction() || false,
			editor: getCurrentEditor(),
			currentTab: getCurrentTab(),
			userStatus: getUserStatus(),
		};
	} )
)( Library );
