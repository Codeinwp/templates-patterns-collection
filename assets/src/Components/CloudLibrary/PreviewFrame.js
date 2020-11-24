import { Dashicon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { stringifyUrl } from 'query-string';

const PreviewFrame = ( {
	title,
	leftButtons,
	rightButtons,
	heading,
	previewUrl,
} ) => {
	const url = stringifyUrl( {
		url: previewUrl,
		query: { tpcpreview: 'yes' },
	} );

	const iframeTitle = title || __( 'Preview' );
	return (
		<div className="ob-preview single-templates">
			<div className="preview">
				<iframe title={ iframeTitle } src={ url } frameBorder="0" />
				<div className="loading">
					<Dashicon icon="update" size={ 50 } />
				</div>
			</div>
			<div className="bottom-bar">
				{ leftButtons && (
					<div className="navigator">{ leftButtons }</div>
				) }
				{ heading && <h2 className="heading">{ heading }</h2> }
				{ rightButtons && (
					<div className="actions">{ rightButtons }</div>
				) }
			</div>
		</div>
	);
};

export default PreviewFrame;
