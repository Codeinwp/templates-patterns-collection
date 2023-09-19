import { useEffect, useState } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { sendPostMessage } from '../utils/common';

const SitePreview = ( { userCustomSettings, siteData, importData } ) => {
	const [ loading, setLoading ] = useState( true );

	useEffect( () => {
		if ( ! loading ) {
			const logoDisplay = importData?.theme_mods?.logo_display;
			sendPostMessage( {
				type: 'updateSiteInfo',
				data: {
					...userCustomSettings,
					logoDisplay,
				},
			} );
		}
	}, [ loading ] );

	const handleIframeLoading = () => {
		setLoading( false );
	};

	const siteUrl = siteData.url + '?onboarding=true';

	return (
		<iframe
			id="ti-ss-preview"
			className="iframe"
			title="Website Preview"
			src={ siteUrl }
			onLoad={ handleIframeLoading }
		></iframe>
	);
};

export default withSelect( ( select ) => {
	const { getUserCustomSettings, getCurrentSite, getImportData } = select(
		'ti-onboarding'
	);
	return {
		userCustomSettings: getUserCustomSettings(),
		siteData: getCurrentSite(),
		importData: getImportData(),
	};
} )( SitePreview );
