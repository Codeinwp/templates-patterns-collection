/* eslint-disable @wordpress/no-global-event-listener */
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

const contextMenu = document.getElementById( 'tmpl-fl-row-overlay' );

const tpcExport = ( e ) => {
	const row = e.closest( '.fl-row' );
	const node = row.dataset.node;

	const message = `<div class="tpc-template-cloud-export-modal">
		<h1>${ window.tiTpc.exporter.modalLabel }</h1>
		<label for="tpc-${ node }">${ window.tiTpc.exporter.textLabel }</label>
		<input id="tpc-${ node }" type="text" placeholder="${ window.tiTpc.exporter.textPlaceholder }" />
	</div>`;

	FLBuilder.confirm( {
		message,
		ok: () => {
			const input = document.getElementById( `tpc-${ node }` );
			const title = input.value || 'Template';
			setTimeout( function () {
				FLBuilder.showAjaxLoader();
				FLBuilder.ajax(
					{
						action: 'ti_export_template',
						node,
						title,
					},
					( res ) => {
						if ( undefined !== res.success && ! res.success ) {
							FLBuilder.alert(
								`<h1>${ window.tiTpc.exporter.exportFailed }</h1> ${ res.data }`
							);
						}

						FLBuilder.hideAjaxLoader();
					}
				);
			}, 1000 );
		},
		strings: {
			ok: window.tiTpc.exporter.buttonLabel,
			cancel: window.tiTpc.exporter.cancelLabel,
		},
	} );
};

window.tpcExport = tpcExport;

if ( contextMenu ) {
	const text = contextMenu.textContent;
	contextMenu.textContent = text.replace(
		// eslint-disable-next-line prettier/prettier
		'<li><a class=\"fl-block-row-reset\" href=\"javascript:void(0);\">Reset Row Width</a></li>',
		// eslint-disable-next-line prettier/prettier
		'<li><a class=\"fl-block-row-reset\" href=\"javascript:void(0);\">Reset Row Width</a></li><li><a class=\"fl-block-row-tpc-export\" onclick="window.tpcExport(this)" href=\"javascript:void(0);\">Export to Templates Cloud</a></li>'
	);
}

render( <App />, document.getElementById( 'ti-tpc-beaver-modal' ) );
