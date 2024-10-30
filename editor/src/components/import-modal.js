/* eslint-disable no-undef */
/* eslint-disable camelcase */
import { useDispatch, useSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { Modal, Button } from '@wordpress/components';
import { parse } from '@wordpress/blocks';
import { close } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import Header from './header';
import Content from './content';
import PreviewFrame from '../../../assets/src/Components/CloudLibrary/PreviewFrame';
import { importTemplate } from '../data/templates-cloud';

const ImportModal = ( {
	clientId,
	autoLoad = true,
	isFse = false,
	modalOpen,
	setModalOpen,
} ) => {
	const { isPreview, currentTab, previewData } = useSelect( ( select ) => ( {
		isPreview: select( 'tpc/block-editor' ).isPreview(),
		currentTab: select( 'tpc/block-editor' ).getCurrentTab(),
		previewData: select( 'tpc/block-editor' ).getPreview(),
	} ) );

	const { removeBlock, replaceBlocks, insertBlocks, resetBlocks } =
		useDispatch( 'core/block-editor' );

	const { togglePreview } = useDispatch( 'tpc/block-editor' );

	const closePreview = () => togglePreview( false );

	const { type } = useSelect( ( select ) => ( {
		type: select( 'core/editor' ).getEditedPostAttribute( 'type' ),
	} ) );

	const { createErrorNotice } = useDispatch( 'core/notices' );

	const { editPost } = useDispatch( 'core/editor' );

	const { updateLibrary, updateTemplates } =
		useDispatch( 'tpc/block-editor' );

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

	const importBlocks = ( content, metaFields = [], template_type = '' ) => {
		updateLibrary( [] );
		updateTemplates( [] );
		const { allowed_post } = window.tiTpc;

		if (
			0 < Object.keys( tryParseJSON( metaFields ) || {} ).length &&
			allowed_post.includes( type )
		) {
			const fields = JSON.parse( metaFields );
			// eslint-disable-next-line no-unused-vars
			const { _wp_page_template, ...restFields } = fields;
			const meta = { ...restFields };

			editPost( { meta } );

			if ( 'page' === type && fields._wp_page_template ) {
				editPost( {
					template: fields._wp_page_template,
				} );
			}
		}

		if ( ! clientId ) {
			if ( template_type === 'fse' ) {
				resetBlocks( parse( content ) );
			} else {
				insertBlocks( parse( content ) );
			}
		} else {
			replaceBlocks( clientId, parse( content ) );
		}

		closeModal();
	};

	const importFromPreview = async () => {
		setImporting( true );
		await importTemplate( previewData.template_id ).then( ( r ) => {
			if ( r.__file && r.content && 'wp_export' === r.__file ) {
				closePreview();
				setImporting( false );
				importBlocks(
					r.content,
					previewData.meta || [],
					previewData.template_type
				);
				return false;
			}

			createErrorNotice(
				__(
					'Something went wrong while importing. Please try again.',
					'templates-patterns-collection'
				),
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
		if ( ! isFse ) {
			removeBlock( clientId );
		}
	};

	useEffect( () => {
		if ( autoLoad ) {
			setTimeout( () => {
				setModalOpen( true );
			}, 100 );
		}
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
								? __(
										'Importing',
										'templates-patterns-collection'
								  ) + '...'
								: __(
										'Import',
										'templates-patterns-collection'
								  ) }
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

export default ImportModal;
