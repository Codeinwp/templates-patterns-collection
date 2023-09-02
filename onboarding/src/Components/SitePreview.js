import { useEffect, useState } from '@wordpress/element';
import { sendPostMessage } from '../utils/common';
import { withSelect } from '@wordpress/data';

const SitePreview = ( { userCustomSettings } ) => {
	const [ loading, setLoading ] = useState( true );

	useEffect( () => {
		if ( loading !== false ) {
			return;
		}

		sendPostMessage( {
			type: 'updateAll',
			data: userCustomSettings,
		} );
	}, [ loading ] );

	const handleIframeLoading = () => {
		setLoading( false );
	};

	return (
		<iframe
			id="ti-ss-preview"
			className="iframe"
			title="Your Iframe"
			// src={ siteData.url }
			src="https://neve.test"
			onLoad={ handleIframeLoading }
		></iframe>
	);
};

export default withSelect( ( select ) => {
	const { getUserCustomSettings } = select( 'ti-onboarding' );
	return {
		userCustomSettings: getUserCustomSettings(),
	};
} )( SitePreview );
