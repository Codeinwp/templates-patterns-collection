/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	fetchTemplates,
	fetchLibrary,
} from './../data/templates-cloud/index.js';
import Preview from './preview.js';
import Library from './library.js';
import Notices from './notices.js';

const Content = ( { importBlocks } ) => {
	const { setFetching } = useDispatch( 'tpc/block-editor' );

	const isFetching = useSelect( ( select ) =>
		select( 'tpc/block-editor' ).isFetching()
	);
	const isPreview = useSelect( ( select ) =>
		select( 'tpc/block-editor' ).isPreview()
	);
	const currentTab = useSelect( ( select ) =>
		select( 'tpc/block-editor' ).getCurrentTab()
	);

	useEffect( () => {
		init();
	}, [] );

	const init = async () => {
		setFetching( true );
		await fetchTemplates();
		await fetchLibrary();
		setFetching( false );
	};

	const { items = [], currentPage, totalPages } = useSelect( ( select ) => {
		if ( currentTab === 'library' ) {
			return select( 'tpc/block-editor' ).getLibrary() || {};
		}

		if ( currentTab === 'templates' ) {
			return select( 'tpc/block-editor' ).getTemplates() || {};
		}
	} );

	if ( isPreview ) {
		return (
			<Preview isFetching={ isFetching } importBlocks={ importBlocks } />
		);
	}

	return (
		<div className="wp-block-ti-tpc-templates-cloud__modal-content">
			<Notices />
			{ [ 'templates', 'library' ].includes( currentTab ) ? (
				<Library
					items={ items }
					currentPage={ currentPage }
					totalPages={ totalPages }
					isFetching={ isFetching }
					importBlocks={ importBlocks }
				/>
			) : (
				__(
					'We are still working on this. Please check back later. Thank you!'
				)
			) }
		</div>
	);
};

export default Content;
