import { useEffect, useState } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { sendPostMessage } from '../utils/common';

const SitePreview = ( { userCustomSettings, siteData, importData } ) => {
	const [ loading, setLoading ] = useState( true );

	const loadDefaultFonts = ( message ) => {
		// TODO: uncomment the following lines when demosites changes are merged on production
		// if ( message.origin !== siteData.url ) {
		// 	return;
		// }
		if ( message.origin !== 'https://staging.demosites.io' ) {
			return;
		}

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

		const logoDisplay = importData?.theme_mods?.logo_display;

		sendPostMessage( {
			type: 'updateSiteInfo',
			data: {
				...userCustomSettings,
				logoDisplay,
			},
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

	const siteUrl =
		siteData.url.replace( 'https://', 'https://staging.' ) +
		'?onboarding=true';

	return (
		<iframe
			id="ti-ss-preview"
			className="iframe"
			title="Your Iframe"
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
