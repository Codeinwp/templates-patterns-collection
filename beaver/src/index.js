/* global FLBuilder */

import { Modal } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { render, useState } from '@wordpress/element';

import './data/store/index.js';
import './export.js';
import './editor.scss';
import Header from './components/header';
import Content from './components/content';

const App = () => {
	const currentTab = useSelect( ( select ) =>
		select( 'tpc/beaver' ).getCurrentTab()
	);

	const { setFetching, updateCurrentTab } = useDispatch( 'tpc/beaver' );

	const [ nodeID, setNodeID ] = useState( null );

	const [ isOpen, setOpen ] = useState( false );

	const [ searchQuery, setSearchQuery ] = useState( {
		templates: '',
		library: '',
	} );

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

	const [ isSearch, setSearch ] = useState( {
		templates: false,
		library: false,
	} );

	const initModal = ( node ) => {
		setNodeID( node );
		setOpen( true );
	};

	const initModalExport = () => {
		setOpen( true );
		updateCurrentTab( 'export' );
	};

	window.tiTpc.initBeaver = ( node ) => initModal( node );

	window.tiTpc.initModalExport = initModalExport;

	const closeModal = () => {
		setOpen( false );
		FLBuilder._settingsCancelClicked();
	};

	const isGeneral = currentTab === 'templates';

	const setQuery = ( query ) => {
		if ( isGeneral ) {
			return setSearchQuery( {
				...searchQuery,
				templates: query,
			} );
		}

		return setSearchQuery( {
			...searchQuery,
			library: query,
		} );
	};

	const getSearchQuery = () => {
		if ( isGeneral ) {
			return searchQuery.templates;
		}

		return searchQuery.library;
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

	const getOrder = () => {
		if ( isGeneral ) {
			return sortingOrder.templates;
		}

		return sortingOrder.library;
	};

	const setSearchStatus = ( status ) => {
		if ( isGeneral ) {
			return setSearch( {
				...searchQuery,
				templates: status,
			} );
		}

		return setSearch( {
			...isSearch,
			library: status,
		} );
	};

	const getSearchStatus = () => {
		if ( isGeneral ) {
			return isSearch.templates;
		}

		return isSearch.library;
	};

	const importTemplate = ( template ) => {
		setFetching( true );

		FLBuilder.ajax(
			{
				action: 'ti_get_position',
				node: nodeID,
			},
			( response ) => {
				FLBuilder._settingsCancelClicked();
				const position = response;

				FLBuilder.ajax(
					{
						action: 'ti_apply_template',
						template,
						position,
					},
					( res ) => {
						setFetching( false );

						if ( undefined !== res.success && ! res.success ) {
							return FLBuilder.alert(
								`<h1>${ window.tiTpc.exporter.importFailed }</h1> ${ res.data }`
							);
						}

						closeModal();

						const data = FLBuilder._jsonParse( res );
						if ( data.layout ) {
							FLBuilder._renderLayout( data.layout );
							FLBuilder.triggerHook( 'didApplyTemplate' );
						}
					}
				);
			}
		);
	};

	if ( isOpen ) {
		return (
			<Modal
				title={ window.tiTpc.library.templatesCloud }
				shouldCloseOnClickOutside={ false }
				onRequestClose={ closeModal }
				isDismissible={ false }
				overlayClassName="tpc-template-cloud-modal"
			>
				<Header
					closeModal={ closeModal }
					getOrder={ getOrder }
					getSearchQuery={ getSearchQuery }
				/>

				<Content
					importTemplate={ importTemplate }
					getOrder={ getOrder }
					setQuery={ setQuery }
					getSearchQuery={ getSearchQuery }
					setSorting={ setSorting }
					isSearch={ getSearchStatus() }
					setSearch={ setSearchStatus }
				/>
			</Modal>
		);
	}

	return <p>:)</p>;
};

if ( ! window.tiTpc ) {
	window.tiTpc = {};
}

const elem = document.createElement( 'div' );
elem.id = 'ti-tpc-beaver-modal';
elem.style = 'display:none;';
document.body.appendChild( elem );

render( <App />, document.getElementById( 'ti-tpc-beaver-modal' ) );
