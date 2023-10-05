import { useEffect } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { sendPostMessage } from '../utils/common';

const SitePreview = ( {
	userCustomSettings,
	siteData,
	importData,
	siteStyle,
	refresh,
	setRefresh,
} ) => {
	useEffect( () => {
		if ( refresh ) {
			sendPostMessage( {
				type: 'styleChange',
				data: siteStyle,
			} );

			const logoDisplay = importData?.theme_mods?.logo_display;
			sendPostMessage( {
				type: 'updateSiteInfo',
				data: {
					...userCustomSettings,
					logoDisplay,
				},
			} );
		}
		setRefresh( false );
	}, [ refresh ] );

	const handleIframeLoading = () => {
		setRefresh( true );
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

export default compose(
	withSelect( ( select ) => {
		const {
			getUserCustomSettings,
			getCurrentSite,
			getImportData,
			getRefresh,
		} = select( 'ti-onboarding' );
		return {
			userCustomSettings: getUserCustomSettings(),
			siteData: getCurrentSite(),
			importData: getImportData(),
			refresh: getRefresh(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setRefresh } = dispatch( 'ti-onboarding' );

		return {
			setRefresh,
		};
	} )
)( SitePreview );
