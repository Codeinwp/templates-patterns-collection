/* eslint-disable no-unused-vars */
import { Button } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';

const Template = ( {
	title,
	thumbnail,
	link,
	togglePreview,
	setPreviewData,
} ) => {
	return (
		<div className="ti-tpc-template-library-template">
			<div className="ti-tpc-template-library-template-body">
				<div
					className="ti-tpc-template-library-template-screenshot"
					style={ {
						backgroundImage: `url( ${ thumbnail })`,
					} }
				></div>
				<Button
					className="ti-tpc-template-library-template-preview"
					onClick={ () => {
						togglePreview();
						setPreviewData( link );
					} }
				>
					<i className="eicon-zoom-in-bold" aria-hidden="true"></i>
				</Button>
			</div>

			<div className="ti-tpc-template-library-template-footer">
				<Button className="ti-tpc-template-library-template-action elementor-button">
					<i className="eicon-file-download" aria-hidden="true"></i>
					<span>{ window.tiTpc.library.actions.insert }</span>
				</Button>

				<div className="ti-tpc-template-library-template-name">
					{ title }
				</div>
			</div>
		</div>
	);
};

export default withDispatch( ( dispatch ) => {
	const { togglePreview, setPreviewData } = dispatch( 'tpc/elementor' );

	return {
		togglePreview,
		setPreviewData,
	};
} )( Template );