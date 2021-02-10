/* eslint-disable camelcase */
import { withDispatch, withSelect, useDispatch } from '@wordpress/data';
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

const Edit = ( {
	clientId,
	isPreview,
	previewData,
	currentTab,
	removeBlock,
	replaceBlocks,
	closePreview,
} ) => {
	const { createErrorNotice } = useDispatch( 'core/notices' );

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

	const importBlocks = ( content ) => {
		replaceBlocks( clientId, parse( content ) );
	};

	const importFromPreview = async () => {
		setImporting( true );
		await importTemplate( previewData.template_id ).then( ( r ) => {
			if ( r.__file && r.content && 'wp_export' === r.__file ) {
				closePreview();
				setImporting( false );
				importBlocks( r.content );
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
