/* eslint-disable no-undef */
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { Button, Icon, PanelBody, ToggleControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-site';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import api from '@wordpress/api';

import { stringifyUrl } from 'query-string';
import { v4 as uuidv4 } from 'uuid';
import { iconBlack } from './icon';
import TemplatePredefine from './components/template-predefine';

const { omit } = lodash;

const SiteEditorExporter = () => {
	const { settingId } = useSelect( ( select ) => {
		return {
			settingId: select( 'core/edit-site' ).getEditedPostId(),
		};
	} );
	const [ isLoading, setLoading ] = useState( false );
	const [ templateData, setTemplateData ] = useState( {} );
	const { createErrorNotice, createSuccessNotice } = useDispatch(
		'core/notices'
	);
	const [ isPostSavingPrev, setIsPostSavingPrev ] = useState( false );

	// This parameter is used internally to be able to publish a template.
	const canPredefine = true; //window.tiTpc;

	/**
	 * Get the template data.
	 *
	 * @return {Promise<void>} Promise.
	 */
	const fetchTemplate = async () => {
		const { getEditedPostId, getEditedPostType } = wp.data.select(
			'core/edit-site'
		);
		const { getEntityRecord } = wp.data.select( coreStore );
		const editedPostId = getEditedPostId();
		const editedPostType = getEditedPostType();

		return await getEntityRecord(
			'postType',
			editedPostType,
			editedPostId
		);
	};

	/**
	 * Save the template.
	 *
	 * @return {Promise<void>}
	 */
	const onSavePage = async () => {
		setLoading( true );

		await fetchTemplate().then( async ( template ) => {
			const data = {
				__file: 'wp_export',
				version: 2,
				content: template?.content?.raw || '',
			};

			const url = getRequestUrl( template );

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

			setLoading( false );
		} );
	};

	/**
	 * Get the request URL.
	 *
	 * @param {Object} template Template object.
	 * @return {string} Request URL.
	 */
	const getRequestUrl = ( template ) => {
		if ( ! templateData?._ti_tpc_template_id ) {
			return stringifyUrl( {
				url: window.tiTpc.endpoint + 'templates',
				query: {
					...omit( tiTpc.params, 'meta' ),
					meta: JSON.stringify( templateData ),
					template_name:
						template?.title?.raw ||
						__( 'FSE Template', 'templates-patterns-collection' ),
					template_type: 'fse-templates',
					template_site_slug: templateData?._ti_tpc_site_slug || '',
					template_thumbnail:
						templateData?._ti_tpc_screenshot_url || '',
					content: template?.content?.raw || '',
				},
			} );
		}

		return stringifyUrl( {
			url:
				window.tiTpc.endpoint +
				'templates/' +
				templateData?._ti_tpc_template_id,
			query: {
				...omit( tiTpc.params, 'meta' ),
				meta: JSON.stringify( templateData ),
				template_name:
					template?.title?.raw ||
					__( 'FSE Template', 'templates-patterns-collection' ),
				content: template?.content?.raw || '',
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
	 * @param {string} id Setting ID.
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
		const {
			__experimentalGetDirtyEntityRecords,
			isSavingEntityRecord,
		} = select( coreStore );

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
				{ __( 'Templates Cloud' ) }
			</PluginSidebarMoreMenuItem>

			<PluginSidebar
				name="ti-tpc"
				title={ __( 'Templates Cloud' ) }
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
						onClick={ onSavePage }
					>
						{ __(
							'Save Page to Templates Cloud',
							'templates-patterns-collection'
						) }
					</Button>

					<ToggleControl
						label={ __( 'Automatically sync to the cloud' ) }
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
				{ canPredefine && (
					<TemplatePredefine
						templateData={ templateData }
						setTemplateData={ setTemplateData }
						canPredefine={ canPredefine }
						setLoading={ setLoading }
						createErrorNotice={ createErrorNotice }
						createSuccessNotice={ createSuccessNotice }
						isLoading={ isLoading }
						saveMeta={ () =>
							saveSettings( settingId, templateData )
						}
					/>
				) }
			</PluginSidebar>
		</Fragment>
	);
};

export default SiteEditorExporter;
