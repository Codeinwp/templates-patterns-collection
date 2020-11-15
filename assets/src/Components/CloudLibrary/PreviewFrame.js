import { Dashicon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const PreviewFrame = ( { title, leftButtons, rightButtons, previewUrl } ) => {
	const iframeTitle = title || __( 'Preview' );
	return (
		<div className="ob-preview single-templates">
			<div className="preview">
				<iframe
					title={ iframeTitle }
					src={ previewUrl }
					frameBorder="0"
				/>
				<div className="loading">
					<Dashicon icon="update" size={ 50 } />
				</div>
			</div>
			<div className="bottom-bar">
				<div className="navigator">{ leftButtons }</div>
				<div className="actions">{ rightButtons }</div>
			</div>
		</div>
	);
};

export default PreviewFrame;
