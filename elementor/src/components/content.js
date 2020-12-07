/* eslint-disable jsx-a11y/iframe-has-title */
import { withSelect } from '@wordpress/data';
import TemplatesContent from './templates-content.js';

const Content = ( { isFetching, isPreview, currentTab, preview } ) => {
	if ( isPreview ) {
		return (
			<div className="dialog-message dialog-lightbox-message">
				<div className="dialog-content dialog-lightbox-content">
					<div className="ti-tpc-template-library-preview">
						<iframe src={ preview }></iframe>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="dialog-message dialog-lightbox-message">
			<div className="dialog-content dialog-lightbox-content">
				<div className="ti-tpc-template-library-templates">
					<div className="ti-tpc-template-library-templates-container">
						{ [ 'templates', 'library' ].includes( currentTab ) && (
							<TemplatesContent
								isFetching={ isFetching }
								isGeneral={ currentTab === 'templates' }
							/>
						) }
					</div>
				</div>
			</div>
		</div>
	);
};

export default withSelect( ( select ) => {
	const { isFetching, isPreview, getCurrentTab, getPreview } = select(
		'tpc/elementor'
	);

	return {
		isFetching: isFetching(),
		isPreview: isPreview(),
		currentTab: getCurrentTab(),
		preview: getPreview(),
	};
} )( Content );
