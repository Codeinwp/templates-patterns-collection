import { useEffect, useState } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { sendPostMessage } from '../utils/common';

const SitePreview = ( { userCustomSettings, siteData } ) => {
	const [ loading, setLoading ] = useState( true );

	const loadDefaultFonts = ( message ) => {
		// TODO: change to demosites.io
		// if ( message.origin !== siteData.url ) {
		// 	return;
		// }

		const { data } = message;
		const { call, value } = data;
		if ( call !== 'demoDefaultFonts' ) {
			return;
		}

		const scriptsToLoad = JSON.parse( value );
		scriptsToLoad.forEach( ( element ) => {
			const { id, href } = element;
			const node = document.createElement( 'link' );
			node.id = id;
			node.setAttribute( 'rel', 'stylesheet' );
			node.setAttribute( 'href', href );
			document.head.appendChild( node );
		} );
	};

	useEffect( () => {
		window.addEventListener( 'message', loadDefaultFonts );

		sendPostMessage( {
			type: 'updateAll',
			data: userCustomSettings,
		} );

		if ( loading !== false ) {
			return;
		}
		return () => {
			window.removeEventListener( 'message', loadDefaultFonts );
		};
	}, [ loading, loadDefaultFonts ] );

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
	const { getUserCustomSettings, getCurrentSite } = select( 'ti-onboarding' );
	return {
		userCustomSettings: getUserCustomSettings(),
		siteData: getCurrentSite(),
	};
} )( SitePreview );
