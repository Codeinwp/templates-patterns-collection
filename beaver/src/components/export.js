/* eslint-disable no-undef */
import { v4 as uuidv4 } from 'uuid';

import { Button, Icon } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { cloudUpload, rotateRight } from '@wordpress/icons';

import { fetchLibrary } from './../data/templates-cloud/index';

const Export = () => {
	const { updateCurrentTab } = useDispatch( 'tpc/beaver' );

	const [ isLoading, setLoading ] = useState( false );

	// const [ templateSync, setTemplateSync ] = useState(
	// 	Boolean( window.tiTpc.postMeta._ti_tpc_template_sync )
	// );

	// const [ templateID, setTemplateID ] = useState(
	// 	window.tiTpc.postMeta._ti_tpc_template_id
	// );

	// const [ screenshotURL, setScreenshotURL ] = useState(
	// 	window.tiTpc.postMeta._ti_tpc_screenshot_url
	// );

	// const [ siteSlug, setSiteSlug ] = useState(
	// 	window.tiTpc.postMeta._ti_tpc_site_slug
	// );

	// const [ isPublished, setPublished ] = useState(
	// 	Boolean( window.tiTpc.postMeta._ti_tpc_published )
	// );

	const onSave = () => {
		setLoading( true );

		FLBuilder.ajax(
			{
				action: 'ti_export_page_template',
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
			</div>
		</div>
	);
};

export default Export;
