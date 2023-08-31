import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { Button, TextControl, Icon } from '@wordpress/components';
import { sendPostMessage } from '../../utils/common';
import { MediaUpload } from '@wordpress/media-utils';
import { addFilter } from '@wordpress/hooks';
import classnames from 'classnames';
import {useState} from "@wordpress/element";

const LogoControl = ( { importSettings, handleLogoChange, setImportData } ) => {
	const { siteLogo } = importSettings;
	const [ logo, setLogo ] = useState( siteLogo.url );

	const replaceMediaUpload = () => MediaUpload;

	addFilter(
		'editor.MediaUpload',
		'core/edit-post/components/media-upload/replace-media-upload',
		replaceMediaUpload()
	);

	return (
		<div className="ob-ctrl">
			<div className="ob-ctrl-head">
				<h3>
					{ __( 'Upload a logo', 'templates-patterns-collection' ) }
				</h3>
			</div>
			<div className="ob-ctrl-wrap media">
				<MediaUpload
					onSelect={ ( newLogo ) => {
						handleLogoChange( newLogo );
						setImportData( ( prevData ) => ( {
							...prevData,
							theme_mods: {
								...prevData.theme_mods,
								custom_logo: newLogo.id,
							},
						} ) );
						setLogo( newLogo.url );
					} }
					allowedTypes={ [ 'image' ] }
					value={ siteLogo.id }
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
													handleLogoChange( {} );
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
		const { getImportSettings } = select( 'ti-onboarding' );
		return {
			importSettings: getImportSettings(),
		};
	} ),
	withDispatch( ( dispatch, { importSettings } ) => {
		const { setImportSettings } = dispatch( 'ti-onboarding' );

		return {
			handleLogoChange: ( newLogo ) => {
				console.log( newLogo );
				const updatedSettings = {
					...importSettings,
					siteLogo: newLogo,
				};
				setImportSettings( updatedSettings );
				sendPostMessage( {
					type: 'logoChange',
					data: newLogo,
				} );
			},
		};
	} )
)( LogoControl );
