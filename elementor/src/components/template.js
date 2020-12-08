/* global $e, elementorCommon */
import { Button } from '@wordpress/components';
import { withDispatch } from '@wordpress/data';

import { importTemplate } from './../data/templates-cloud/index.js';

const Template = ( {
	id,
	title,
	thumbnail,
	link,
	togglePreview,
	setPreviewData,
} ) => {
	const onImport = async () => {
		const data = await importTemplate( id );

		if ( data ) {
			const history = window.$e.internal( 'document/history/start-log', {
				type: 'add',
				title: `Add Template from Templates Cloud: ${ title }`,
			} );

			let index = Number( window.tiTpc.placeholder );

			const content = data.content;

			for ( let i = 0; i < content.length; i++ ) {
				content[ i ].id = elementorCommon.helpers.getUniqueId();
				window.$e.run( 'document/elements/create', {
					container: window.elementor.getPreviewContainer(),
					model: content[ i ],
					options: index >= 0 ? { at: index++ } : {},
				} );
			}

			$e.internal( 'document/history/end-log', {
				id: history,
			} );

			window.tiTpcModal.hide();
		}
	};

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
				<Button
					className="ti-tpc-template-library-template-action elementor-button"
					onClick={ onImport }
				>
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
