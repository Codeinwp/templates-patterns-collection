/* eslint-disable camelcase */
/* global elementor */
import classnames from 'classnames';
import { Button, ToggleControl } from '@wordpress/components';
import { withDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	getTemplate,
	exportTemplate,
	publishTemplate,
	updateTemplate,
} from './../data/templates-cloud/index.js';

const Export = ( { updateCurrentTab } ) => {
	useEffect( () => {
		const {
			_ti_tpc_template_sync,
			_ti_tpc_template_id,
			_ti_tpc_screenshot_url,
			_ti_tpc_site_slug,
			_ti_tpc_published,
		} = window.tiTpc.postModel.getMetas();

		setTemplateSync( Boolean( _ti_tpc_template_sync ) );
		setTemplateID( _ti_tpc_template_id );
		setScreenshotURL( _ti_tpc_screenshot_url );
		setSiteSlug( _ti_tpc_site_slug );
		setPublished( Boolean( _ti_tpc_published ) );
	}, [] );

	const title =
		elementor.config.initial_document.settings.settings.post_title || '';

	const [ isLoading, setLoading ] = useState( false );
	const [ templateSync, setTemplateSync ] = useState( false );
	const [ templateID, setTemplateID ] = useState( '' );
	const [ screenshotURL, setScreenshotURL ] = useState( '' );
	const [ siteSlug, setSiteSlug ] = useState( '' );
	const [ isPublished, setPublished ] = useState( '' );

	const exportPage = async () => {
		setLoading( true );

		const content = elementor.elements.toJSON( {
			remove: [ 'default', 'editSettings', 'defaultEditSettings' ],
		} );

		let doesExist = false;

		if ( templateID ) {
			doesExist = await getTemplate( templateID );
		}

		const meta = window.tiTpc.params.meta;

		const currentTemplate = elementor.documents
			.getCurrent()
			.container.settings.get( 'template' );

		if ( currentTemplate ) {
			meta._wp_page_template = currentTemplate;
		}

		if ( doesExist ) {
			await updateTemplate( {
				template_id: templateID,
				template_name: title,
				content,
				link: elementor.config.initial_document.urls.permalink,
				meta: JSON.stringify( meta ),
			} );
		} else {
			await exportTemplate( {
				title,
				type: 'page',
				content,
				link: elementor.config.initial_document.urls.permalink,
				callback: ( res ) => {
					setTemplateID( res.template_id );
					window.tiTpc.postModel.set( 'meta', {
						_ti_tpc_template_id: res.template_id,
						_ti_tpc_template_sync: templateSync,
					} );

					window.tiTpc.postModel.save();
				},
			} );
		}

		setLoading( false );
		updateCurrentTab( 'library' );
	};

	const refreshData = async () => {
		setLoading( true );
		try {
			await getTemplate( templateID ).then( ( results ) => {
				if ( templateID === results.template_id ) {
					setScreenshotURL( results.template_thumbnail );
					elementor.notifications.showToast( {
						message: __(
							'Template Data Refreshed.',
							'templates-patterns-collection'
						),
					} );
					window.tiTpc.postModel.set( 'meta', {
						_ti_tpc_template_id: templateID,
						_ti_tpc_template_sync: templateSync,
						_ti_tpc_screenshot_url: screenshotURL,
						_ti_tpc_site_slug: siteSlug,
						_ti_tpc_published: isPublished,
					} );

					window.tiTpc.postModel.save();
				}
			} );
		} catch ( error ) {
			elementor.notifications.showToast( {
				message:
					'Something happened when refreshing the template data.',
			} );
		}
		setLoading( false );
	};

	const publishPage = async () => {
		setLoading( true );
		try {
			await publishTemplate( {
				template_id: templateID,
				template_site_slug: siteSlug,
				template_thumbnail: screenshotURL,
				premade: ! isPublished ? 'yes' : 'no',
				link: elementor.config.initial_document.urls.permalink,
			} ).then( async ( r ) => {
				if ( r.success ) {
					await getTemplate( templateID ).then( ( results ) => {
						if ( templateID === results.template_id ) {
							setScreenshotURL( results.template_thumbnail );
							elementor.notifications.showToast( {
								message: ! isPublished
									? window.tiTpc.exporter.templatePublished
									: window.tiTpc.exporter.templateUnpublished,
							} );

							setPublished( ! isPublished );

							window.tiTpc.postModel.set( 'meta', {
								_ti_tpc_template_id: templateID,
								_ti_tpc_template_sync: templateSync,
								_ti_tpc_screenshot_url: screenshotURL,
								_ti_tpc_site_slug: siteSlug,
								_ti_tpc_published: ! isPublished,
							} );

							window.tiTpc.postModel.save();
						}
					} );
				}
			} );
		} catch ( error ) {
			elementor.notifications.showToast( {
				message: 'Something happened when publishing the template.',
			} );
		}

		setLoading( false );
	};

	const descriptionStyles = {
		width: '650px',
		margin: 'auto',
		marginTop: '8px',
		padding: '0 12px',
	};

	return (
		<div className="dialog-message dialog-lightbox-message">
			<div className="dialog-content dialog-lightbox-content">
				<div className="ti-tpc-template-library-export">
					<div className="ti-tpc-template-library-blank-icon">
						<i
							className="eicon-library-save"
							aria-hidden="true"
						></i>
						<span className="elementor-screen-only">
							{ window.tiTpc.library.export.save }
						</span>
					</div>

					<div className="ti-tpc-template-library-blank-title">
						{ window.tiTpc.library.export.title }
					</div>

					<div className="ti-tpc-template-library-blank-field">
						<input
							className="ti-tpc-template-library-blank-field-input"
							value={
								elementor.config.initial_document.settings
									.settings.post_title
							}
							disabled
						/>

						<Button
							className={ classnames(
								'elementor-button elementor-button-success',
								{ 'elementor-button-state': isLoading }
							) }
							onClick={ exportPage }
						>
							<span className="elementor-state-icon">
								<i
									className="eicon-loading eicon-animation-spin"
									aria-hidden="true"
								></i>
							</span>
							{ window.tiTpc.library.export.save }
						</Button>
					</div>

					<div className="ti-tpc-template-library-blank-field">
						<ToggleControl
							label={ window.tiTpc.exporter.toggleLabel }
							checked={ templateSync }
							onChange={ () => setTemplateSync( ! templateSync ) }
						/>
					</div>

					{ window.tiTpc.canPredefine && (
						<>
							<div className="ti-tpc-template-library-blank-field">
								<label
									htmlFor="ti-tpc-template-screenshot"
									className="ti-tpc-template-library-blank-field-input-label"
								>
									{
										window.tiTpc.library.export
											.labelScreenshot
									}
								</label>

								<input
									className="ti-tpc-template-library-blank-field-input"
									id="ti-tpc-template-screenshot"
									value={ screenshotURL }
									onChange={ ( e ) =>
										setScreenshotURL( e.target.value )
									}
								/>
							</div>
							<p style={ descriptionStyles }>
								{ __(
									'Use `{generate_ss}` to publish this and have a screenshot automatically generated. Otherwise use the url to point to an image location for the template preview.',
									'templates-patterns-collection'
								) }
							</p>

							<div className="ti-tpc-template-library-blank-field">
								<label
									htmlFor="ti-tpc-template-slug"
									className="ti-tpc-template-library-blank-field-input-label"
								>
									{ window.tiTpc.library.export.labelSlug }
								</label>

								<input
									className="ti-tpc-template-library-blank-field-input"
									id="ti-tpc-template-slug"
									value={ siteSlug }
									onChange={ ( e ) =>
										setSiteSlug( e.target.value )
									}
								/>
							</div>
							<p style={ descriptionStyles }>
								{ __(
									'Use `general` to publish this as a global template. Otherwise use the starter site slug to make it available as a single page for the starter site.',
									'templates-patterns-collection'
								) }
							</p>

							<div className="ti-tpc-template-library-blank-field">
								<Button
									className={ classnames(
										'elementor-button elementor-button-success',
										{ 'elementor-button-state': isLoading }
									) }
									onClick={ publishPage }
								>
									<span className="elementor-state-icon">
										<i
											className="eicon-loading eicon-animation-spin"
											aria-hidden="true"
										></i>
									</span>
									{ isPublished
										? window.tiTpc.library.export.unpublish
										: window.tiTpc.library.export.publish }
								</Button>

								{ isPublished && (
									<Button
										className={ classnames(
											'elementor-button elementor-button-success',
											{
												'elementor-button-state':
													isLoading,
											}
										) }
										onClick={ refreshData }
										style={ {
											backgroundColor: 'dimgray',
											marginLeft: '12px',
										} }
									>
										<span className="elementor-state-icon">
											<i
												className="eicon-loading eicon-animation-spin"
												aria-hidden="true"
											></i>
										</span>
										{ __(
											'Refresh',
											'templates-patterns-collection'
										) }
									</Button>
								) }
							</div>
						</>
					) }
				</div>
			</div>
		</div>
	);
};

export default withDispatch( ( dispatch ) => {
	const { updateCurrentTab } = dispatch( 'tpc/elementor' );

	return {
		updateCurrentTab,
	};
} )( Export );
