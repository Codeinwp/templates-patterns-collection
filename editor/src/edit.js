/* eslint-disable no-undef */
/* eslint-disable camelcase */
import {
	withDispatch,
	withSelect,
	useDispatch,
	useSelect,
} from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { Modal, Button } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { parse } from '@wordpress/blocks';
import { close } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import Header from './components/header';
import Content from './components/content';
import PreviewFrame from '../../assets/src/Components/CloudLibrary/PreviewFrame';
import { importTemplate } from './data/templates-cloud';

const { omit } = lodash;

const Edit = ( {
	clientId,
	isPreview,
	previewData,
	currentTab,
	removeBlock,
	replaceBlocks,
	closePreview,
} ) => {
	const { type } = useSelect( ( select ) => ( {
		type: select( 'core/editor' ).getEditedPostAttribute( 'type' ),
	} ) );

	const { createErrorNotice } = useDispatch( 'core/notices' );

	const { editPost } = useDispatch( 'core/editor' );

	const { updateLibrary, updateTemplates } = useDispatch(
		'tpc/block-editor'
	);

	const [ modalOpen, setModalOpen ] = useState( false );
	const [ importing, setImporting ] = useState( false );

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

	const tryParseJSON = ( jsonString ) => {
		try {
			const o = JSON.parse( jsonString );

			// Handle non-exception-throwing cases:
			// Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
			// but... JSON.parse(null) returns null, and typeof null === "object",
			// so we must check for that, too. Thankfully, null is falsey, so this suffices:
			// Source: https://stackoverflow.com/a/20392392
			if ( o && typeof o === 'object' ) {
				return o;
			}
		} catch ( e ) {}

		return false;
	};

	const importBlocks = ( content, metaFields = [] ) => {
		updateLibrary( [] );
		updateTemplates( [] );

		if (
			0 < Object.keys( tryParseJSON( metaFields ) || {} ).length &&
			[ 'post', 'page' ].includes( type )
		) {
			const fields = JSON.parse( metaFields );
			const meta = {
				...omit( { ...fields }, '_wp_page_template' ),
			};
			editPost( { meta } );

			if ( 'page' === type && fields._wp_page_template ) {
				editPost( {
					template: fields._wp_page_template,
				} );
			}
		}

		replaceBlocks( clientId, parse( content ) );
	};

	const importFromPreview = async () => {
		setImporting( true );
		await importTemplate( previewData.template_id ).then( ( r ) => {
			if ( r.__file && r.content && 'wp_export' === r.__file ) {
				closePreview();
				setImporting( false );
				importBlocks( r.content, previewData.meta || [] );
				return false;
			}

			createErrorNotice(
				__( 'Something went wrong while importing. Please try again.' ),
				{
					type: 'snackbar',
				}
			);
			setImporting( false );
			removeBlock( clientId );
		} );
	};

	const closeModal = () => {
		setModalOpen( false );
		setImporting( false );
		removeBlock( clientId );
	};

	useEffect( () => {
		setTimeout( () => {
			setModalOpen( true );
		}, 100 );
	}, [] );

	if ( ! modalOpen ) {
		return null;
	}

	const PreviewWrap = () => {
		if ( ! isPreview || currentTab !== 'templates' ) {
			return null;
		}
		const { link, template_name } = previewData;

		return (
			<Modal
				isDismissible={ false }
				shouldCloseOnClickOutside={ false }
				shouldCloseOnEsc={ false }
				className="tpc-preview-wrap-modal"
			>
				<PreviewFrame
					previewUrl={ link }
					heading={ template_name }
					leftButtons={
						<>
							<Button
								disabled={ importing }
								icon={ close }
								onClick={ closePreview }
							/>
						</>
					}
					rightButtons={
						<Button
							disabled={ importing }
							isPrimary
							onClick={ importFromPreview }
						>
							{ importing
								? __( 'Importing' ) + '...'
								: __( 'Import' ) }
						</Button>
					}
				/>
				;
			</Modal>
		);
	};

	return (
		<>
			<Modal
				onRequestClose={ closeModal }
				shouldCloseOnEsc={ false }
				shouldCloseOnClickOutside={
					! isPreview || currentTab !== 'templates'
				}
				isDismissible={ false }
				overlayClassName="tpc-template-cloud-modal"
			>
				<Header
					closeModal={ closeModal }
					getOrder={ getOrder }
					getSearchQuery={ getSearchQuery }
				/>

				<Content
					importBlocks={ importBlocks }
					getOrder={ getOrder }
					setQuery={ setQuery }
					getSearchQuery={ getSearchQuery }
					setSorting={ setSorting }
				/>

				<PreviewWrap />
			</Modal>
		</>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { isPreview, getPreview, getCurrentTab } = select(
			'tpc/block-editor'
		);
		return {
			isPreview: isPreview(),
			currentTab: getCurrentTab(),
			previewData: getPreview().item,
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { removeBlock, replaceBlocks } = dispatch( 'core/block-editor' );
		const { togglePreview } = dispatch( 'tpc/block-editor' );

		const closePreview = () => togglePreview( false );

		return {
			removeBlock,
			replaceBlocks,
			closePreview,
		};
	} )
)( Edit );
