/* eslint-disable no-undef */
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import {
	Button,
	Icon,
	PanelBody,
	ToggleControl,
	Modal,
	TextControl,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import api from '@wordpress/api';

import { stringifyUrl } from 'query-string';
import { v4 as uuidv4 } from 'uuid';
import { iconBlack } from '../icon';
import TemplatePredefine from '../components/template-predefine';
import ImportModal from '../components/import-modal';

const SiteEditorExporter = () => {
	const { settingId, postType } = useSelect( ( select ) => {
		return {
			settingId: select( 'core/edit-site' ).getEditedPostId(),
			postType: select( 'core/edit-site' ).getEditedPostType(),
		};
	} );

	// Current template
	const { getEntityRecord } = wp.data.select( coreStore );
	const template = getEntityRecord( 'postType', postType, settingId );

	const [ isOpen, setOpen ] = useState( false );
	const [ title, setTitle ] = useState( '' );
	const [ isLoading, setLoading ] = useState( false );
	const [ templateData, setTemplateData ] = useState( {} );
	const { createErrorNotice, createSuccessNotice } =
		useDispatch( 'core/notices' );
	const [ isPostSavingPrev, setIsPostSavingPrev ] = useState( false );
	const [ modalOpen, setModalOpen ] = useState( false );

	// This parameter is used internally to be able to publish a template.
	const { canPredefine } = window.tiTpc;

	/**
	 * Get the template data.
	 *
	 * @return {Object} Template data.
	 */
	const fetchTemplate = () => {
		const { getCurrentTemplateTemplateParts } =
			wp.data.select( 'core/edit-site' );

		let templateContent = wp.blocks.serialize(
			wp.data.select( 'core/editor' ).getBlocks()
		);

		// Current template parts
		const currentTemplateParts = getCurrentTemplateTemplateParts();

		// Iterate over the current templates and replace the content with the template part content
		currentTemplateParts.forEach( ( currentTemplatePart ) => {
			const toReplace = wp.blocks.serialize( currentTemplatePart.block );
			const replaceWith = currentTemplatePart.templatePart.content.raw;
			templateContent = templateContent.replace( toReplace, replaceWith );
		} );

		return {
			...template,
			content: { ...template.content, raw: templateContent },
		};
	};

	/**
	 * Save the template.
	 *
	 * @return {Promise<void>}
	 */
	const onSavePage = async () => {
		setLoading( true );

		const resultedTemplate = fetchTemplate();

		const data = {
			__file: 'wp_export',
			version: 2,
			content: resultedTemplate?.content?.raw || '',
		};

		const url = getRequestUrl();

		try {
			const response = await apiFetch( {
				url,
				method: 'POST',
				data,
				parse: false,
			} );

			if ( ! response.ok ) {
				return;
			}

			const res = await response.json();

			if ( hasError( res ) ) {
				return;
			}

			handleSaveSuccess( res );
		} catch ( error ) {
			handleSaveError( error );
		}

		setOpen( false );
		setLoading( false );
	};

	/**
	 * Get the request URL.
	 *
	 * @return {string} Request URL.
	 */
	const getRequestUrl = () => {
		const { meta, ...filteredParams } = tiTpc.params;

		if ( ! templateData?._ti_tpc_template_id ) {
			return stringifyUrl( {
				url: window.tiTpc.endpoint + 'templates',
				query: {
					...filteredParams,
					meta: JSON.stringify( templateData ),
					template_name:
						title ||
						template?.title?.raw ||
						__( 'FSE Template', 'templates-patterns-collection' ),
					template_type: 'fse',
					template_site_slug: templateData?._ti_tpc_site_slug || '',
					template_thumbnail:
						templateData?._ti_tpc_screenshot_url || '',
				},
			} );
		}

		return stringifyUrl( {
			url:
				window.tiTpc.endpoint +
				'templates/' +
				templateData?._ti_tpc_template_id,
			query: {
				...filteredParams,
				meta: JSON.stringify( templateData ),
				template_name:
					title ||
					template?.title?.raw ||
					__( 'FSE Template', 'templates-patterns-collection' ),
			},
		} );
	};

	/**
	 * Handle save error.
	 *
	 * @param {Object} res Response object.
	 *
	 * @return {boolean} True if error, false otherwise.
	 */
	const hasError = ( res ) => {
		switch ( res.code ) {
			case 'rest_invalid_param':
				createErrorNotice(
					__(
						'Could not save template, check that the template is not empty.',
						'templates-patterns-collection'
					),
					{
						type: 'snackbar',
					}
				);
				return true;
			case 'rest_forbidden':
				createErrorNotice(
					__(
						'You are not allowed to save templates.',
						'templates-patterns-collection'
					),
					{
						type: 'snackbar',
					}
				);
				return true;
			case 'rest_template_invalid_id':
				createErrorNotice(
					__(
						'Could not save template, invalid template ID.',
						'templates-patterns-collection'
					)
				);
				return true;
			default:
				return false;
		}
	};

	/**
	 * Handle save success.
	 *
	 * @param {Object} res Response object.
	 */
	const handleSaveSuccess = ( res ) => {
		window.localStorage.setItem( 'tpcCacheBuster', uuidv4() );

		createSuccessNotice(
			__( 'Template saved.', 'templates-patterns-collection' ),
			{
				type: 'snackbar',
			}
		);

		let data = {
			...templateData,
		};
		if ( res.template_id ) {
			data = {
				_ti_tpc_template_id: res.template_id,
				...templateData,
			};
		}

		setTemplateData( data );
		saveSettings( settingId, data );
	};

	/**
	 * Save settings.
	 *
	 * @param {string} id   Setting ID.
	 * @param {Object} data Data to save.
	 */
	const saveSettings = ( id, data ) => {
		const settings = new api.models.Settings();

		settings.fetch().then( ( response ) => {
			const newSettings = {
				...response.templates_patterns_collection_fse_templates,
				[ id ]: data,
			};

			settings.save( {
				templates_patterns_collection_fse_templates: newSettings,
			} );
		} );
	};

	/**
	 * Handle save error.
	 *
	 * @param {Object} error Error object.
	 */
	const handleSaveError = ( error ) => {
		const message =
			error.message ||
			__(
				'Could not save template, check that the template is not empty.',
				'templates-patterns-collection'
			);
		createErrorNotice( message, {
			type: 'snackbar',
		} );
	};

	/**
	 * Check if current post is saving.
	 */
	const isPostSaving = useSelect( ( select ) => {
		const { __experimentalGetDirtyEntityRecords, isSavingEntityRecord } =
			select( coreStore );

		const dirtyEntityRecords = __experimentalGetDirtyEntityRecords();
		return dirtyEntityRecords.some( ( record ) =>
			isSavingEntityRecord( record.kind, record.name, record.key )
		);
	} );

	useEffect( () => {
		if ( ! settingId ) {
			return;
		}

		const settings = new api.models.Settings();
		settings.fetch().then( ( response ) => {
			const initialData =
				response?.templates_patterns_collection_fse_templates[
					settingId
				] || {};
			setTemplateData( initialData );
		} );
	}, [ settingId ] );

	useEffect( () => {
		/**
		 * Call onSavePost only after the save post happened, so we can get the correct content of the template.
		 */
		if (
			isPostSavingPrev &&
			! isPostSaving &&
			templateData._ti_tpc_template_sync
		) {
			onSavePage();
		}

		// Update the previous value of isPostSaving
		setIsPostSavingPrev( isPostSaving );
	}, [ isPostSaving, templateData, isPostSavingPrev ] );

	return (
		<Fragment>
			<PluginSidebarMoreMenuItem
				icon={ <Icon icon={ iconBlack } /> }
				target="ti-tpc"
			>
				{ __( 'Templates Cloud', 'templates-patterns-collection' ) }
			</PluginSidebarMoreMenuItem>

			<PluginSidebar
				name="ti-tpc"
				title={ __(
					'Templates Cloud',
					'templates-patterns-collection'
				) }
				className="ti-tpc-components-panel"
			>
				<PanelBody>
					{ __(
						'Save this page as a template in your Templates Cloud library.',
						'templates-patterns-collection'
					) }

					<Button
						isPrimary
						isBusy={ isLoading }
						disabled={ isLoading }
						onClick={ async () => {
							if ( templateData?._ti_tpc_template_id ) {
								await onSavePage();
							} else {
								setOpen( true );
							}
						} }
					>
						{ __(
							'Save Page to Templates Cloud',
							'templates-patterns-collection'
						) }
					</Button>

					<ToggleControl
						label={ __(
							'Automatically sync to the cloud',
							'templates-patterns-collection'
						) }
						checked={ templateData._ti_tpc_template_sync || false }
						onChange={ () =>
							setTemplateData( {
								...templateData,
								_ti_tpc_template_sync:
									! templateData._ti_tpc_template_sync ||
									false,
							} )
						}
					/>
				</PanelBody>
				<PanelBody>
					{ __(
						'Import a template from your Templates Cloud library.',
						'templates-patterns-collection'
					) }
					<Button isPrimary onClick={ () => setModalOpen( true ) }>
						{ __(
							'Import from Templates Cloud',
							'templates-patterns-collection'
						) }
					</Button>
				</PanelBody>
				{ canPredefine && (
					<TemplatePredefine
						templateData={ templateData }
						setTemplateData={ setTemplateData }
						canPredefine={ canPredefine }
						setLoading={ setLoading }
						createErrorNotice={ createErrorNotice }
						createSuccessNotice={ createSuccessNotice }
						isLoading={ isLoading }
						saveMeta={ ( newTemplateData ) => {
							saveSettings( settingId, newTemplateData );
						} }
					/>
				) }
			</PluginSidebar>
			{ isOpen && (
				<Modal
					title={ __(
						'Save Template',
						'templates-patterns-collection'
					) }
					onRequestClose={ () => setOpen( false ) }
				>
					<TextControl
						label={ __(
							'Template Name',
							'templates-patterns-collection'
						) }
						value={ title || template?.title?.raw || '' }
						onChange={ setTitle }
					/>

					<Button
						isPrimary
						isBusy={ isLoading }
						disabled={ isLoading }
						onClick={ onSavePage }
					>
						{ __( 'Save', 'templates-patterns-collection' ) }
					</Button>
				</Modal>
			) }
			<ImportModal
				isFse={ true }
				autoLoad={ false }
				modalOpen={ modalOpen }
				setModalOpen={ setModalOpen }
			/>
		</Fragment>
	);
};

export default SiteEditorExporter;
