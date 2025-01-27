import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { TextControl } from '@wordpress/components';
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
					{ __( 'Business Name', 'templates-patterns-collection' ) }
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
		const { getUserCustomSettings, getImportData, getPluginOptions } =
			select( 'ti-onboarding' );
		return {
			userCustomSettings: getUserCustomSettings(),
			importData: getImportData(),
			pluginOptions: getPluginOptions(),
		};
	} ),
	withDispatch(
		( dispatch, { importData, userCustomSettings, importDataDefault } ) => {
			const { setUserCustomSettings, setImportData, setRefresh } =
				dispatch( 'ti-onboarding' );

			return {
				handleSiteNameChange: ( newSiteName ) => {
					const updatedSettings = {
						...userCustomSettings,
						siteName: newSiteName,
					};
					setUserCustomSettings( updatedSettings );

					const newImportData = {
						...importData,
						wp_options: {
							...importData.wp_options,
							blogname:
								newSiteName ||
								importDataDefault.wp_options.blogname,
						},
					};
					setImportData( newImportData );
					setRefresh( true );
				}
			};
		}
	)
)( SiteNameControl );
