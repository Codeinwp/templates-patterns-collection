/* eslint-disable no-undef */
import { v4 as uuidv4 } from 'uuid';

import { Button, Icon, ToggleControl } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { cloudUpload, rotateRight } from '@wordpress/icons';

import { fetchLibrary } from './../data/templates-cloud/index';

const Export = () => {
	const { updateCurrentTab } = useDispatch( 'tpc/beaver' );

	const [ isLoading, setLoading ] = useState( false );

	const [ templateSync, setTemplateSync ] = useState(
		Boolean( window.tiTpc.postMeta._ti_tpc_template_sync )
	);

	const [ screenshotURL, setScreenshotURL ] = useState(
		window.tiTpc.postMeta._ti_tpc_screenshot_url
	);

	const [ siteSlug, setSiteSlug ] = useState(
		window.tiTpc.postMeta._ti_tpc_site_slug
	);

	const [ isPublished, setPublished ] = useState(
		'yes' === window.tiTpc.postMeta._ti_tpc_published ? true : false
	);

	useEffect( () => {
		window.tiTpc.postMeta._ti_tpc_template_sync = templateSync;
		window.tiTpc.postMeta._ti_tpc_screenshot_url = screenshotURL;
		window.tiTpc.postMeta._ti_tpc_site_slug = siteSlug;
		window.tiTpc.postMeta._ti_tpc_published = isPublished ? 'yes' : 'no';
	}, [ templateSync, screenshotURL, siteSlug, isPublished ] );

	const onSave = () => {
		setLoading( true );

		FLBuilder.ajax(
			{
				action: 'ti_export_page_template',
				is_sync: Number( templateSync ),
			},
			( response ) => {
				setLoading( false );

				if ( undefined !== response.success && ! response.success ) {
					return FLBuilder.alert(
						`<h1>${ window.tiTpc.exporter.exportFailed }</h1> ${ response.data }`
					);
				}

				localStorage.setItem( 'tpcCacheBuster', uuidv4() );
				fetchLibrary();
				updateCurrentTab( 'library' );
			}
		);
	};

	const publishPage = () => {
		setLoading( true );

		FLBuilder.ajax(
			{
				action: 'ti_publish_template',
				slug: siteSlug,
				screenshot: screenshotURL,
				premade: ! isPublished ? 'yes' : 'no',
			},
			( response ) => {
				setLoading( false );

				if ( undefined !== response.success && ! response.success ) {
					return FLBuilder.alert(
						`<h1>${ window.tiTpc.exporter.exportFailed }</h1> ${ response.data }`
					);
				}

				setPublished( ! isPublished );
				localStorage.setItem( 'tpcCacheBuster', uuidv4() );
			}
		);
	};

	return (
		<div className="tpc-modal-content">
			<div className="tpc-modal-content-export">
				<div className="tpc-modal-content-export-icon">
					<Icon icon={ cloudUpload } />
				</div>

				<div className="tpc-modal-content-export-title">
					{ window.tiTpc.library.export.title }
				</div>

				<div className="tpc-modal-content-export-field">
					<input
						className="tpc-modal-content-export-field-input"
						value={
							window.tiTpc.pageTitle ||
							window.tiTpc.exporter.textPlaceholder
						}
						disabled
					/>

					<Button
						className="tpc-modal-content-export-field-submit"
						disabled={ isLoading }
						icon={ isLoading ? rotateRight : '' }
						onClick={ onSave }
					>
						{ window.tiTpc.library.export.save }
					</Button>
				</div>

				<div className="tpc-modal-content-export-field">
					<ToggleControl
						label={ window.tiTpc.exporter.toggleLabel }
						checked={ templateSync }
						onChange={ () => setTemplateSync( ! templateSync ) }
					/>
				</div>

				{ window.tiTpc.canPredefine && (
					<>
						<div className="tpc-modal-content-export-field">
							<label
								htmlFor="tpc-template-screenshot"
								className="tpc-modal-content-export-field-input-label"
							>
								{ window.tiTpc.library.export.labelScreenshot }
							</label>

							<input
								className="tpc-modal-content-export-field-input"
								id="tpc-template-screenshot"
								value={ screenshotURL }
								onChange={ ( e ) =>
									setScreenshotURL( e.target.value )
								}
							/>
						</div>

						<div className="tpc-modal-content-export-field">
							<label
								htmlFor="tpc-template-slug"
								className="tpc-modal-content-export-field-input-label"
							>
								{ window.tiTpc.library.export.labelSlug }
							</label>

							<input
								className="tpc-modal-content-export-field-input"
								id="tpc-template-slug"
								value={ siteSlug }
								onChange={ ( e ) =>
									setSiteSlug( e.target.value )
								}
							/>
						</div>

						<div className="tpc-modal-content-export-field">
							<Button
								className="tpc-modal-content-export-field-submit"
								disabled={ isLoading }
								icon={ isLoading ? rotateRight : '' }
								onClick={ publishPage }
							>
								{ isPublished
									? window.tiTpc.library.export.unpublish
									: window.tiTpc.library.export.publish }
							</Button>
						</div>
					</>
				) }
			</div>
		</div>
	);
};

export default Export;
