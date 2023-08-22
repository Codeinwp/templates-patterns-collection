import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { TextControl } from '@wordpress/components';
import { sendPostMessage } from '../../utils/common';
import { useState, useEffect } from '@wordpress/element';

const SiteNameControl = ( { importSettings, handleSiteNameChange } ) => {
	const { siteName } = importSettings;
	const [ inputValue, setInputValue ] = useState( siteName );

	useEffect( () => {
		const timer = setTimeout( () => {
			handleSiteNameChange( inputValue );
		}, 500 );

		return () => clearTimeout( timer );
	}, [ inputValue ] );

	return (
		<div className="ob-control type-text">
			<h3>{ __( 'Bussiness Name', 'templates-patterns-collection' ) }</h3>
			<TextControl value={ inputValue } onChange={ setInputValue } />
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getCurrentSite, getImportSettings } = select( 'ti-onboarding' );
		return {
			siteData: getCurrentSite(),
			importSettings: getImportSettings(),
		};
	} ),
	withDispatch( ( dispatch, { importSettings } ) => {
		const { setImportSettings } = dispatch( 'ti-onboarding' );

		return {
			handleSiteNameChange: ( newSiteName ) => {
				const updatedSettings = {
					...importSettings,
					siteName: newSiteName,
				};
				setImportSettings( updatedSettings );
				sendPostMessage( {
					type: 'siteNameChange',
					data: updatedSettings,
				} );
			},
		};
	} )
)( SiteNameControl );
