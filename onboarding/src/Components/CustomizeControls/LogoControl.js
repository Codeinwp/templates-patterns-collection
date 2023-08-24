import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { Button } from '@wordpress/components';
import { sendPostMessage } from '../../utils/common';
import { MediaUpload } from '@wordpress/media-utils';
import { addFilter } from '@wordpress/hooks';
import classnames from 'classnames';

const LogoControl = ( { importSettings, handleLogoChange } ) => {
	const { siteLogo } = importSettings;

	const replaceMediaUpload = () => MediaUpload;

	addFilter(
		'editor.MediaUpload',
		'core/edit-post/components/media-upload/replace-media-upload',
		replaceMediaUpload()
	);

	return (
		<div className="ob-ctrl">
			<div className="ob-ctrl-head">
				<h3>{ __( 'Upload a logo', 'templates-patterns-collection' ) }</h3>
			</div>
			<div className="ob-ctrl-wrap media">
				<MediaUpload
					onSelect={ handleLogoChange }
					allowedTypes={ [ 'image' ] }
					value={ siteLogo.id }
					render={ ( { open } ) => (
						<>
							<div className="ob-media-controls">
								<input type="text" value={ siteLogo.url } />
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
									siteLogo.url ? 'active' : ''
								) }
							>
								{ siteLogo.url && (
									<img
										src={ siteLogo.url }
										alt={ __(
											'Uploaded image',
											'templates-patterns-collection'
										) }
									/>
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
