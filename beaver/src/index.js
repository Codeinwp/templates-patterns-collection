/* global FLBuilder */

import { Modal } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { render, unmountComponentAtNode, useState } from '@wordpress/element';

import './data/store/index.js';
import './editor.scss';
import Header from './components/header';
import Content from './components/content';

// eslint-disable-next-line no-unused-vars
const App = ( { nodeID } ) => {
	const currentTab = useSelect( ( select ) =>
		select( 'tpc/beaver' ).getCurrentTab()
	);

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

	const closeModal = () => {
		unmountComponentAtNode( document.getElementById( 'ti-tpc-beaver' ) );
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

	const importTemplate = () => {};

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
};

if ( ! window.tiTpc ) {
	window.tiTpc = {};
}

window.tiTpc.initBeaver = ( nodeID ) => {
	render(
		<App nodeID={ nodeID } />,
		document.getElementById( 'ti-tpc-beaver' )
	);
};
