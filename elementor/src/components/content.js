/* eslint-disable jsx-a11y/iframe-has-title */
import { Spinner } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import TemplatesContent from './templates-content.js';

import {
	fetchTemplates,
	fetchLibrary,
} from './../data/templates-cloud/index.js';

const Content = ( {
	onImport,
	isFetching,
	isPreview,
	currentTab,
	preview,
	setFetching,
} ) => {
	const init = async () => {
		setFetching( true );
		if ( currentTab === 'templates' ) {
			await fetchTemplates();
		} else {
			await fetchLibrary();
		}
		setFetching( false );
	};

	useEffect( () => {
		init();
	}, [ currentTab ] );

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

	if ( isFetching ) {
		return (
			<div className="dialog-message dialog-lightbox-message">
				<div className="dialog-content dialog-lightbox-content is-loading">
					<Spinner />
				</div>
			</div>
		);
	}

	return (
		<div className="dialog-message dialog-lightbox-message">
			<div className="dialog-content dialog-lightbox-content">
				<div className="ti-tpc-template-library-templates">
					{ [ 'templates', 'library' ].includes( currentTab ) && (
						<TemplatesContent
							onImport={ onImport }
							isFetching={ isFetching }
							isGeneral={ currentTab === 'templates' }
						/>
					) }
				</div>
			</div>
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { isFetching, isPreview, getCurrentTab, getPreview } = select(
			'tpc/elementor'
		);

		return {
			isFetching: isFetching(),
			isPreview: isPreview(),
			currentTab: getCurrentTab(),
			preview: getPreview(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setFetching } = dispatch( 'tpc/elementor' );

		return {
			setFetching,
		};
	} )
)( Content );
