import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { Button, TextControl, Icon } from '@wordpress/components';
import { sendPostMessage } from '../../utils/common';
import { MediaUpload } from '@wordpress/media-utils';
import { addFilter } from '@wordpress/hooks';
import classnames from 'classnames';
import { useState } from '@wordpress/element';

const LogoControl = ( { userCustomSettings, handleLogoChange } ) => {
	const { siteLogo } = userCustomSettings;
	const [ logo, setLogo ] = useState( siteLogo?.url || '' );

	const replaceMediaUpload = () => MediaUpload;

	addFilter(
		'editor.MediaUpload',
		'tpc/onboarding/replace-media-upload',
		replaceMediaUpload()
	);

	return (
		<div className="ob-ctrl">
			<div className="ob-ctrl-head small-gap">
				<h3>
					{ __( 'Upload a logo', 'templates-patterns-collection' ) }
				</h3>
			</div>
			<div className="ob-ctrl-wrap media">
				<MediaUpload
					onSelect={ ( newLogo ) => {
						handleLogoChange( newLogo );
						setLogo( newLogo.url );
					} }
					allowedTypes={ [ 'image' ] }
					value={ siteLogo?.id || '' }
					render={ ( { open } ) => (
						<>
							<div className="ob-media-controls">
								<TextControl
									value={ logo }
									onChange={ () => {} }
								/>
								<Button isLink onClick={ open }>
									{ __(
										'Browse',
										'templates-patterns-collection'
									) }
								</Button>
							</div>
							<div
								className={ classnames(
									'ob-media-preview',
									logo ? 'active' : ''
								) }
							>
								{ logo && (
									<>
										<img
											src={ logo }
											alt={ __(
												'Uploaded image',
												'templates-patterns-collection'
											) }
										/>
										<div className="ob-preview-overlay">
											<Button
												isTertiary
												onClick={ () => {
													setLogo( '' );
													handleLogoChange( null );
												} }
											>
												<Icon icon="no" />
												{ __(
													'Remove image',
													'templates-patterns-collection'
												) }
											</Button>
										</div>
									</>
								) }
							</div>
						</>
					) }
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
	withDispatch(
		( dispatch, { importData, userCustomSettings, importDataDefault } ) => {
			const { setUserCustomSettings, setImportData } = dispatch(
				'ti-onboarding'
			);

			return {
				handleLogoChange: ( newLogo ) => {
					const updatedSettings = {
						...userCustomSettings,
						siteLogo: newLogo,
					};
					setUserCustomSettings( updatedSettings );

					const newImportData = {
						...importData,
						theme_mods: {
							...importData.theme_mods,
							custom_logo: newLogo
								? newLogo.id
								: importDataDefault.theme_mods.custom_logo,
							logo_logo: newLogo
								? JSON.stringify( {
										dark: newLogo.id,
										light: newLogo.id,
										same: true,
								  } )
								: JSON.stringify( {
										...importDataDefault.theme_mods
											.logo_logo,
								  } ),
						},
					};
					setImportData( newImportData );

					const logoDisplay = newImportData?.theme_mods?.logo_display;

					sendPostMessage( {
						type: 'updateSiteInfo',
						data: {
							...updatedSettings,
							logoDisplay,
						},
					} );
				},
			};
		}
	)
)( LogoControl );
