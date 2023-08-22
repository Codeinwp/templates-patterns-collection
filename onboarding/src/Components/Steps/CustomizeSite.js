import PreviewSettings from '../PreviewSettings';

const CustomizeSite = () => {
	return (
		<div className="ob-container row ovf-initial">
			<PreviewSettings />
			<div className="iframe-container">
				<iframe
					id="ti-ss-preview"
					className="iframe"
					title="Your Iframe"
					// src={ siteData.url }
					src="https://neve.test"
				></iframe>
			</div>
		</div>
	);
};

export default CustomizeSite;
