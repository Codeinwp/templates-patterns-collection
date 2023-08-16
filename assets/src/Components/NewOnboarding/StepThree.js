import { withSelect, withDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { Button, Dashicon } from '@wordpress/components';
import PreviewSettings from './PreviewSettings';

const StepThree = ( { siteData } ) => {
	const [ showPanel, setShowPanel ] = useState( true );

	const togglePanel = () => {
		setShowPanel( ( prevShowPanel ) => ! prevShowPanel );
	};

	return (
		<div className="ob-container row">
			<PreviewSettings />
			<div
				className={ `iframe-container ${
					showPanel ? '' : 'expanded'
				}` }
			>
				<iframe
					id="iframe-id"
					className="iframe"
					title="Your Iframe"
					src={ siteData.url }
				></iframe>
			</div>
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getCurrentSite } = select( 'neve-onboarding' );
		return {
			siteData: getCurrentSite(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setCurrentSite,
			setPreviewStatus,
			setImportModalStatus,
		} = dispatch( 'neve-onboarding' );
		return {
			setSite: ( data ) => setCurrentSite( data ),
			setPreview: ( status ) => setPreviewStatus( status ),
			setModal: ( status ) => setImportModalStatus( status ),
		};
	} )
)( StepThree );
