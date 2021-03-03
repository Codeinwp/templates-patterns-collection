/* global FLBuilder */

import { Modal } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { render, useState } from '@wordpress/element';

import './data/store/index.js';
import './editor.scss';
import Header from './components/header';
import Content from './components/content';

// eslint-disable-next-line no-unused-vars
const App = () => {
	const currentTab = useSelect( ( select ) =>
		select( 'tpc/beaver' ).getCurrentTab()
	);

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

	const { setFetching } = useDispatch( 'tpc/beaver' );

	const initModal = ( node ) => {
		setNodeID( node );
		setOpen( true );
	};

	window.tiTpc.initBeaver = ( node ) => initModal( node );

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
						closeModal();
						setFetching( false );

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
elem.className = 'hidden';
document.body.appendChild( elem );

render( <App />, document.getElementById( 'ti-tpc-beaver-modal' ) );
