/* eslint-disable no-undef */
/* eslint-disable camelcase */
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { serialize } from '@wordpress/blocks';
import {
	Button,
	Icon,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-site';
import { Fragment, useState, useEffect } from '@wordpress/element';

import { stringifyUrl } from 'query-string';
import { v4 as uuidv4 } from 'uuid';
import classnames from 'classnames';

import { iconBlack } from './icon';
import { getTemplate, publishTemplate } from './data/templates-cloud';
import Notices from './components/notices';

import { store as coreStore } from '@wordpress/core-data';
import {
	__experimentalUseNavigator as useNavigator,
	ExternalLink,
} from '@wordpress/components';

import api from '@wordpress/api';

const { omit } = lodash;

const SiteEditorExporter = () => {
	const { settingId, postType, template } = useSelect( ( select ) => {
		const editSite = select( 'core/edit-site' );
		const editedPostId = editSite.getEditedPostId();
		const editedPostType = editSite.getEditedPostType();

		return {
			settingId: editedPostId,
			postType: editedPostType,
			template: select( coreStore ).getEntityRecord(
				'postType',
				editedPostType,
				editedPostId
			),
		};
	} );

	const [ isLoading, setLoading ] = useState( false );
	const [ templateData, setTemplateData ] = useState( {} );
	const { createErrorNotice, createSuccessNotice } = useDispatch(
		'core/notices'
	);

	// This parameter is used internally to be able to publish a template.
	const { canPredefine } = window.tiTpc;

	/**
	 * Save the template.
	 *
	 * @return {Promise<void>}
	 */
	const onSavePage = async () => {
		setLoading( true );

		const data = {
			__file: 'wp_export',
			version: 2,
			content: template?.content?.raw || '',
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

		setLoading( false );
	};

	/**
	 * Get the request URL.
	 *
	 * @return {string} Request URL.
	 */
	const getRequestUrl = () => {
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
				},
			} );
		}

		return stringifyUrl( {
			url:
				window.tiTpc.endpoint +
				'templates/' +
				templateData._ti_tpc_template_id,
			query: {
				...omit( tiTpc.params, 'meta' ),
				meta: JSON.stringify( templateData ),
				template_name:
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
			if (
				response.templates_patterns_collection_fse_templates[
					settingId
				]
			) {
				setTemplateData(
					response.templates_patterns_collection_fse_templates[
						settingId
					]
				);
			}
		} );
	}, [ settingId ] );

	useEffect( () => {
		if ( isPostSaving && templateData._ti_tpc_template_sync ) {
			onSavePage();
		}
	}, [ isPostSaving, templateData ] );

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
						'Save this page as a template in your Templates Cloud library.'
					) }

					<Button
						isPrimary
						isBusy={ isLoading }
						disabled={ isLoading }
						// onClick={ onSavePage }
						onClick={ onSavePage }
					>
						{ __( 'Save Page to Templates Cloud' ) }
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
				{ /*{ canPredefine && (*/ }
				{ /*	<PanelBody>*/ }
				{ /*		<h4>{ __( 'Publish Settings' ) }</h4>*/ }
				{ /*		<TextControl*/ }
				{ /*			label={ __( 'Screenshot URL' ) }*/ }
				{ /*			value={ screenshotURL }*/ }
				{ /*			help={ __(*/ }
				{ /*				'Use `{generate_ss}` to publish this and have a screenshot automatically generated. Otherwise use the url to point to an image location for the template preview.',*/ }
				{ /*				'templates-patterns-collection'*/ }
				{ /*			) }*/ }
				{ /*			type="url"*/ }
				{ /*			onChange={ setScreenshotURL }*/ }
				{ /*		/>*/ }
				{ /*		<TextControl*/ }
				{ /*			label={ __( 'Site Slug' ) }*/ }
				{ /*			value={ siteSlug }*/ }
				{ /*			help={ __(*/ }
				{ /*				'Use `general` to publish this as a global template. Otherwise use the starter site slug to make it available as a single page for the starter site.',*/ }
				{ /*				'templates-patterns-collection'*/ }
				{ /*			) }*/ }
				{ /*			type="url"*/ }
				{ /*			onChange={ setSiteSlug }*/ }
				{ /*		/>*/ }
				{ /*		<PublishButton />*/ }
				{ /*		{ published && (*/ }
				{ /*			<Button*/ }
				{ /*				isLink*/ }
				{ /*				icon="image-rotate"*/ }
				{ /*				onClick={ refreshData }*/ }
				{ /*				disabled={ false !== isLoading }*/ }
				{ /*				className={ classnames( {*/ }
				{ /*					'is-loading': 'publishing' === isLoading,*/ }
				{ /*				} ) }*/ }
				{ /*				style={ {*/ }
				{ /*					marginLeft: '12px',*/ }
				{ /*					textDecoration: 'none',*/ }
				{ /*				} }*/ }
				{ /*			>*/ }
				{ /*				{ __(*/ }
				{ /*					'Refresh',*/ }
				{ /*					'templates-patterns-collection'*/ }
				{ /*				) }*/ }
				{ /*			</Button>*/ }
				{ /*		) }*/ }
				{ /*		<Notices />*/ }
				{ /*	</PanelBody>*/ }
				{ /*) }*/ }
			</PluginSidebar>
		</Fragment>
	);
};

export default SiteEditorExporter;
