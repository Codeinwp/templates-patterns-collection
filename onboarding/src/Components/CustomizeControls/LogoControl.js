import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { Button } from '@wordpress/components';
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
							<button
								className={ classnames(
									'ob-media',
									logo ? 'has-logo' : ''
								) }
								onClick={ open }
							>
								{ ! logo &&
									__(
										'Select or upload image',
										'templates-patterns-collection'
									) }
								{ logo && (
									<span className="ob-responsive-wrapper">
										<span
											style={ { paddingBottom: '150px' } }
										></span>
										<img
											src={ logo }
											alt={ __(
												'Uploaded image',
												'templates-patterns-collection'
											) }
										/>
									</span>
								) }
							</button>
							{ logo && (
								<div className="ob-media-actions">
									<Button
										isTertiary
										onClick={ () => {
											setLogo( '' );
											handleLogoChange( null );
										} }
									>
										{ __(
											'Remove',
											'templates-patterns-collection'
										) }
									</Button>
									<Button isTertiary onClick={ open }>
										{ __(
											'Change',
											'templates-patterns-collection'
										) }
									</Button>
								</div>
							) }
						</>
					) }
				/>
			</div>
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getUserCustomSettings, getImportData } =
			select( 'ti-onboarding' );
		return {
			userCustomSettings: getUserCustomSettings(),
			importData: getImportData(),
		};
	} ),
	withDispatch(
		( dispatch, { importData, userCustomSettings, importDataDefault } ) => {
			const { setUserCustomSettings, setImportData, setRefresh } =
				dispatch( 'ti-onboarding' );

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
					setRefresh( true );
				},
			};
		}
	)
)( LogoControl );
