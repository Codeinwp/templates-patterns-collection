import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { TextControl } from '@wordpress/components';
import { sendPostMessage } from '../../utils/common';
import { useState, useEffect } from '@wordpress/element';

const SiteNameControl = ( { userCustomSettings, handleSiteNameChange } ) => {
	const { siteName } = userCustomSettings;
	const [ inputValue, setInputValue ] = useState( siteName );

	useEffect( () => {
		const timer = setTimeout( () => {
			handleSiteNameChange( inputValue );
		}, 500 );

		return () => clearTimeout( timer );
	}, [ inputValue ] );

	return (
		<div className="ob-ctrl">
			<div className="ob-ctrl-head small-gap">
				<h3>
					{ __( 'Bussiness Name', 'templates-patterns-collection' ) }
				</h3>
			</div>
			<div className="ob-ctrl-wrap input">
				<TextControl
					className="ob-site-name"
					value={ inputValue }
					onChange={ ( newValue ) => {
						setInputValue( newValue );
					} }
				/>
			</div>
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getUserCustomSettings, getImportData } = select(
			'ti-onboarding'
		);
		return {
			userCustomSettings: getUserCustomSettings(),
			importData: getImportData(),
		};
	} ),
	withDispatch( ( dispatch, { importData, userCustomSettings } ) => {
		const { setUserCustomSettings, setImportData } = dispatch(
			'ti-onboarding'
		);

		return {
			handleSiteNameChange: ( newSiteName ) => {
				const updatedSettings = {
					...userCustomSettings,
					siteName: newSiteName,
					updated: true,
				};
				setUserCustomSettings( updatedSettings );

				const newImportData = {
					...importData,
					wp_options: {
						...importData.wp_options,
						blogname: newSiteName,
					},
				};
				setImportData( newImportData );

				sendPostMessage( {
					type: 'updateSiteInfo',
					data: userCustomSettings,
				} );
			},
		};
	} )
)( SiteNameControl );
