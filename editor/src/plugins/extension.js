/* eslint-disable no-undef */
/* eslint-disable camelcase */
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { serialize } from '@wordpress/blocks';
import {
	Button,
	Icon,
	Modal,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	PluginBlockSettingsMenuItem,
	PluginSidebar,
	PluginSidebarMoreMenuItem,
} from '@wordpress/edit-post';
import { Fragment, useState, useEffect } from '@wordpress/element';

import { stringifyUrl } from 'query-string';
import { v4 as uuidv4 } from 'uuid';
import classnames from 'classnames';

import { iconBlack } from '../icon';
import { getTemplate } from '../data/templates-cloud';
import PublishButton from '../components/publish-button';
import Notices from '../components/notices';

const Exporter = () => {
	const [ isOpen, setOpen ] = useState( false );
	const [ isLoading, setLoading ] = useState( false );
	const [ title, setTitle ] = useState( '' );
	const { canPredefine } = window.tiTpc;

	const { createErrorNotice, createSuccessNotice } =
		useDispatch( 'core/notices' );

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

	const getMetaFields = useSelect( ( select ) => {
		const { getEditedPostAttribute } = select( 'core/editor' );
		return getEditedPostAttribute( 'meta' );
	}, [] );

	const pageTemplate = useSelect( ( select ) => {
		const { getEditedPostAttribute } = select( 'core/editor' );
		return getEditedPostAttribute( 'template' );
	}, [] );

	useEffect( () => {
		const metaKeys = window.tiTpc.metaKeys;
		window.tiTpc.params.meta = Object.fromEntries(
			Object.entries( getMetaFields || {} ).filter( ( [ key ] ) =>
				metaKeys.includes( key )
			)
		);

		if ( pageTemplate ) {
			window.tiTpc.params.meta._wp_page_template = pageTemplate;
		} else if (
			'' === pageTemplate &&
			window.tiTpc.params.meta._wp_page_template
		) {
			delete window.tiTpc.params.meta._wp_page_template;
		}
	}, [ getMetaFields, pageTemplate ] );

	const {
		meta,
		postTitle,
		postId,
		type,
		link,
		meta: {
			_ti_tpc_template_sync,
			_ti_tpc_template_id,
			_ti_tpc_screenshot_url,
			_ti_tpc_site_slug,
			_ti_tpc_published,
		},
	} = useSelect( ( select ) => ( {
		meta: select( 'core/editor' ).getEditedPostAttribute( 'meta' ) || {},
		postId: select( 'core/editor' ).getEditedPostAttribute( 'id' ),
		type: select( 'core/editor' ).getEditedPostAttribute( 'type' ),
		link: select( 'core/editor' ).getEditedPostAttribute( 'link' ),
		postTitle:
			select( 'core/editor' ).getEditedPostAttribute( 'title' ) ||
			__( 'Template', 'templates-patterns-collection' ),
	} ) );

	const isPostSaving = useSelect( ( select, { forceIsSaving } ) => {
		const { isSavingPost, isPublishingPost, isAutosavingPost } =
			select( 'core/editor' );

		const isSaving = forceIsSaving || isSavingPost();
		const isAutoSaving = isAutosavingPost();
		const isPublishing = isPublishingPost();

		return ( isPublishing || isSaving ) && ! isAutoSaving;
	} );

	const [ templateSync, setTemplateSync ] = useState( _ti_tpc_template_sync );
	const [ templateID, setTemplateID ] = useState( _ti_tpc_template_id );
	const [ siteSlug, setSiteSlug ] = useState( _ti_tpc_site_slug );
	const [ published, setPublished ] = useState( _ti_tpc_published );
	const [ screenshotURL, setScreenshotURL ] = useState(
		_ti_tpc_screenshot_url
	);

	useEffect( () => {
		editPost( {
			meta: {
				...meta,
				_ti_tpc_template_sync: templateSync,
				_ti_tpc_template_id: templateID,
				_ti_tpc_screenshot_url: screenshotURL,
				_ti_tpc_site_slug: siteSlug,
				_ti_tpc_published: published,
			},
		} );
	}, [ templateSync, templateID, screenshotURL, siteSlug, published ] );

	useEffect( () => {
		if ( isPostSaving && templateSync ) {
			onSavePage();
		}
	}, [ isPostSaving, templateSync ] );

	const refreshData = async () => {
		setLoading( 'publishing' );
		try {
			await getTemplate( _ti_tpc_template_id ).then( ( results ) => {
				if ( _ti_tpc_template_id === results.template_id ) {
					setScreenshotURL( results.template_thumbnail );
					saveMeta( templateID, false );
					createSuccessNotice(
						__(
							'Template Data Refreshed.',
							'templates-patterns-collection'
						),
						{
							type: 'snackbar',
						}
					);
				}
			} );
		} catch ( error ) {
			createErrorNotice(
				__(
					'Something happened when refreshing the template data.',
					'templates-patterns-collection'
				)
			);
		}
		setLoading( false );
	};

	const onSave = async () => {
		setLoading( true );

		const data = {
			__file: 'wp_export',
			version: 2,
			content,
		};

		const { meta, ...filteredParams } = window.tiTpc.params;

		const url = stringifyUrl( {
			url: window.tiTpc.endpoint + 'templates',
			query: {
				...filteredParams,
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
					let message = res.message;
					if (
						message === 'Sorry, you are not allowed to do that.'
					) {
						message = __(
							'Could not save template, check that the template is not empty.',
							'templates-patterns-collection'
						);
					}
					createErrorNotice( message, {
						type: 'snackbar',
					} );
				} else {
					window.localStorage.setItem( 'tpcCacheBuster', uuidv4() );

					createSuccessNotice(
						__(
							'Template saved.',
							'templates-patterns-collection'
						),
						{
							type: 'snackbar',
						}
					);
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

		let doesExist = false;

		if ( templateID ) {
			doesExist = await getTemplate( templateID );
		}

		if ( false !== doesExist && doesExist.template_type !== 'gutenberg' ) {
			return;
		}

		let { meta, ...filteredParams } = window.tiTpc.params;
		// For Custom Layouts attach additional meta to check on import.
		if ( type === 'neve_custom_layouts' ) {
			meta = { ...tiTpc.params.meta, postType: type };
		}
		if ( ! doesExist ) {
			url = stringifyUrl( {
				url: window.tiTpc.endpoint + 'templates',
				query: {
					...filteredParams,
					meta: JSON.stringify( meta ),
					template_name: postTitle,
					template_type: 'gutenberg',
					template_site_slug: _ti_tpc_site_slug || '',
					template_thumbnail: _ti_tpc_screenshot_url || '',
					link,
				},
			} );
		} else {
			url = stringifyUrl( {
				url: window.tiTpc.endpoint + 'templates/' + templateID,
				query: {
					...filteredParams,
					meta: JSON.stringify( meta ),
					template_name: postTitle,
					link,
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
					let message = res.message;
					if (
						message === 'Sorry, you are not allowed to do that.'
					) {
						message = __(
							'Could not save template, check that the template is not empty.',
							'templates-patterns-collection'
						);
					}
					createErrorNotice( message, {
						type: 'snackbar',
					} );
				} else {
					window.localStorage.setItem( 'tpcCacheBuster', uuidv4() );

					createSuccessNotice(
						__(
							'Template saved.',
							'templates-patterns-collection'
						),
						{
							type: 'snackbar',
						}
					);

					if ( res.template_id ) {
						setTemplateID( res.template_id );
						saveMeta( res.template_id );
					} else {
						saveMeta();
					}
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

	const saveMeta = ( ID = templateID, togglePublish = true ) => {
		let post = null;

		if ( type === 'post' ) {
			post = new wp.api.models.Post( { id: postId } );
		} else if ( type === 'page' ) {
			post = new wp.api.models.Page( { id: postId } );
		} else if ( type === 'neve_custom_layouts' ) {
			post = new wp.api.models.Neve_custom_layouts( { id: postId } );
		}

		if ( ! post ) {
			return;
		}

		post.set( 'meta', {
			_ti_tpc_template_id: ID,
			_ti_tpc_template_sync: templateSync,
			_ti_tpc_screenshot_url: screenshotURL,
			_ti_tpc_site_slug: siteSlug,
			_ti_tpc_published: togglePublish ? ! published : published,
		} );
		return post.save();
	};

	const { allowed_post } = window.tiTpc;
	if ( ! allowed_post.includes( type ) ) {
		return null;
	}

	return (
		<Fragment>
			<PluginBlockSettingsMenuItem
				label={ __(
					'Save to Templates Cloud',
					'templates-patterns-collection'
				) }
				icon={ 'none' } // We don't want an icon, as new UI of Gutenberg does't have icons for Menu Items, but the component doesn't allow that so we pass an icon which doesn't exist.
				onClick={ () => setOpen( true ) }
			/>

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
						onClick={ onSavePage }
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
						checked={ templateSync }
						onChange={ () => setTemplateSync( ! templateSync ) }
					/>
				</PanelBody>
				{ canPredefine && (
					<PanelBody>
						<h4>
							{ __(
								'Publish Settings',
								'templates-patterns-collection'
							) }
						</h4>

						<TextControl
							label={ __(
								'Screenshot URL',
								'templates-patterns-collection'
							) }
							value={ screenshotURL }
							help={ __(
								'Use `{generate_ss}` to publish this and have a screenshot automatically generated. Otherwise use the url to point to an image location for the template preview.',
								'templates-patterns-collection'
							) }
							type="url"
							onChange={ setScreenshotURL }
						/>
						<TextControl
							label={ __(
								'Site Slug',
								'templates-patterns-collection'
							) }
							value={ siteSlug }
							help={ __(
								'Use `general` to publish this as a global template. Otherwise use the starter site slug to make it available as a single page for the starter site.',
								'templates-patterns-collection'
							) }
							type="url"
							onChange={ setSiteSlug }
						/>
						<PublishButton
							canPredefine={ canPredefine }
							setLoading={ setLoading }
							templateData={ { ...meta, link } }
							setScreenshotURL={ setScreenshotURL }
							setPublished={ setPublished }
							saveMeta={ saveMeta }
							creteErrorNotice={ createErrorNotice }
							createSuccessNotice={ createSuccessNotice }
							published={ published }
							isLoading={ isLoading }
						/>
						{ published && (
							<Button
								isLink
								icon="image-rotate"
								onClick={ refreshData }
								disabled={ false !== isLoading }
								className={ classnames( {
									'is-loading': 'publishing' === isLoading,
								} ) }
								style={ {
									marginLeft: '12px',
									textDecoration: 'none',
								} }
							>
								{ __(
									'Refresh',
									'templates-patterns-collection'
								) }
							</Button>
						) }
						<Notices />
					</PanelBody>
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
						value={ title }
						onChange={ setTitle }
					/>

					<Button
						isPrimary
						isBusy={ isLoading }
						disabled={ isLoading }
						onClick={ onSave }
					>
						{ __( 'Save', 'templates-patterns-collection' ) }
					</Button>
				</Modal>
			) }
		</Fragment>
	);
};

export default Exporter;
