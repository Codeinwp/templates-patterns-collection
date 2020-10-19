/* eslint-disable camelcase */
/**
 * External dependencies
 */
import { stringifyUrl } from 'query-string';

import { v4 as uuidv4 } from 'uuid';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;

const { apiFetch } = wp;

const { serialize } = wp.blocks;

const {
	Button,
	Icon,
	Modal,
	PanelBody,
	TextControl,
	ToggleControl,
} = wp.components;

const { useDispatch, useSelect } = wp.data;

const {
	PluginBlockSettingsMenuItem,
	PluginSidebar,
	PluginSidebarMoreMenuItem,
} = wp.editPost;

const { Fragment, useState, useEffect } = wp.element;

/**
 * Internal dependencies.
 */
import { iconBlack } from './icon.js';

const Exporter = () => {
	const [ isOpen, setOpen ] = useState( false );
	const [ isLoading, setLoading ] = useState( false );
	const [ title, setTitle ] = useState( '' );

	const { createErrorNotice, createSuccessNotice } = useDispatch(
		'core/notices'
	);

	const { editPost } = useDispatch( 'core/editor' );

	const content = useSelect( ( select ) => {
		const {
			getSelectedBlockCount,
			getSelectedBlock,
			getMultiSelectedBlocks,
		} = select( 'core/block-editor' );
		const blocks =
			1 === getSelectedBlockCount()
				? getSelectedBlock()
				: getMultiSelectedBlocks();

		return serialize( blocks );
	}, [] );

	const editorContent = useSelect( ( select ) => {
		const { getBlocks } = select( 'core/block-editor' );
		const blocks = getBlocks();

		return serialize( blocks );
	}, [] );

	const {
		meta,
		postTitle,
		meta: { _template_sync, _template_id },
	} = useSelect( ( select ) => ( {
		meta: select( 'core/editor' ).getEditedPostAttribute( 'meta' ) || {},
		postTitle:
			select( 'core/editor' ).getEditedPostAttribute( 'title' ) ||
			__( 'Template' ),
	} ) );

	const isPostSaving = useSelect( ( select, { forceIsSaving } ) => {
		const { isSavingPost, isPublishingPost, isAutosavingPost } = select(
			'core/editor'
		);

		const isSaving = forceIsSaving || isSavingPost();
		const isAutoSaving = isAutosavingPost();
		const isPublishing = isPublishingPost();

		return ( isPublishing || isSaving ) && ! isAutoSaving;
	} );

	const [ templateSync, setTemplateSync ] = useState( _template_sync );
	const [ templateID, setTemplateID ] = useState( _template_id );

	useEffect( () => {
		editPost( {
			meta: {
				...meta,
				_template_sync: templateSync,
				_template_id: templateID,
			},
		} );
	}, [ templateSync, templateID ] );

	useEffect( () => {
		if ( isPostSaving && templateSync ) {
			onSavePage();
		}
	}, [ isPostSaving, templateSync ] );

	const onSave = async () => {
		setLoading( true );

		const data = {
			__file: 'wp_export',
			version: 2,
			content,
		};

		const url = stringifyUrl( {
			url: window.tiTpc.endpoint,
			query: {
				...window.tiTpc.params,
				template_name: title,
				template_type: 'gutenberg',
			},
		} );

		try {
			const response = await apiFetch( {
				url,
				method: 'POST',
				data,
				parse: false,
			} );

			if ( response.ok ) {
				const res = await response.json();

				if ( res.message ) {
					createErrorNotice( res.message, {
						type: 'snackbar',
					} );
				} else {
					window.localStorage.setItem( 'tpcCacheBuster', uuidv4() );

					createSuccessNotice( __( 'Template saved.' ), {
						type: 'snackbar',
					} );
				}
			}
		} catch ( error ) {
			if ( error.message ) {
				createErrorNotice( error.message, {
					type: 'snackbar',
				} );
			}
		}

		setLoading( false );
		setOpen( false );
		setTitle( '' );
	};

	const onSavePage = async () => {
		setLoading( true );

		const data = {
			__file: 'wp_export',
			version: 2,
			content: editorContent,
		};

		let url;

		if ( templateID ) {
			url = stringifyUrl( {
				url: window.tiTpc.endpoint + templateID,
				query: {
					...window.tiTpc.params,
					template_name: postTitle,
				},
			} );
		} else {
			url = stringifyUrl( {
				url: window.tiTpc.endpoint,
				query: {
					...window.tiTpc.params,
					template_name: postTitle,
					template_type: 'gutenberg',
				},
			} );
		}

		try {
			const response = await apiFetch( {
				url,
				method: 'POST',
				data,
				parse: false,
			} );

			if ( response.ok ) {
				const res = await response.json();

				if ( res.message ) {
					createErrorNotice( res.message, {
						type: 'snackbar',
					} );
				} else {
					if ( res.template_id ) {
						setTemplateID( res.template_id );
					}

					window.localStorage.setItem( 'tpcCacheBuster', uuidv4() );

					createSuccessNotice( __( 'Template saved.' ), {
						type: 'snackbar',
					} );
				}
			}
		} catch ( error ) {
			if ( error.message ) {
				createErrorNotice( error.message, {
					type: 'snackbar',
				} );
			}
		}

		setLoading( false );
	};

	return (
		<Fragment>
			<PluginBlockSettingsMenuItem
				label={ __( 'Save as Template' ) }
				icon={ 'none' } // We don't want an icon, as new UI of Gutenberg does't have icons for Menu Items, but the component doesn't allow that so we pass an icon which doesn't exist.
				onClick={ () => setOpen( true ) }
			/>

			<PluginSidebarMoreMenuItem
				icon={ <Icon icon={ iconBlack } /> }
				target="ti-tpc"
			>
				{ __( 'Templates Cloud' ) }
			</PluginSidebarMoreMenuItem>

			<PluginSidebar
				name="ti-tpc"
				title={ __( 'Templates Cloud' ) }
				className="ti-tpc-components-panel"
			>
				<PanelBody>
					{ __(
						'Save this page as a template in your Templates Cloud library.'
					) }

					<Button
						isPrimary
						isLarge
						isBusy={ isLoading }
						disabled={ isLoading }
						onClick={ onSavePage }
					>
						{ __( 'Save Page as Template' ) }
					</Button>

					<ToggleControl
						label={ __( 'Automatically sync to the cloud' ) }
						checked={ templateSync }
						onChange={ () => setTemplateSync( ! templateSync ) }
					/>
				</PanelBody>
			</PluginSidebar>

			{ isOpen && (
				<Modal
					title={ __( 'Save Template' ) }
					onRequestClose={ () => setOpen( false ) }
				>
					<TextControl
						label={ __( 'Template Name' ) }
						value={ title }
						onChange={ setTitle }
					/>

					<Button
						isPrimary
						isBusy={ isLoading }
						disabled={ isLoading }
						onClick={ onSave }
					>
						{ __( 'Save' ) }
					</Button>
				</Modal>
			) }
		</Fragment>
	);
};

export default Exporter;