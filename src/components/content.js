/**
 * WordPress dependencies
 */
const {	useSelect } = wp.data;

const { useEffect } = wp.element;

/**
 * Internal dependencies
 */
import { fetchTemplates } from './../data/templates-cloud/index.js';

import Preview from './preview.js';

import Library from './library.js';

const Content = ({
	importBlocks
}) => {
	const isFetching = useSelect( select => select( 'tpc/block-editor' ).isFetching() );
	const isPreview = useSelect( select => select( 'tpc/block-editor' ).isPreview() );
	const currentTab = useSelect( select => select( 'tpc/block-editor' ).getCurrentTab() );

	useEffect( () => {
		fetchTemplates();
	}, []);

	if ( isPreview ) {
		return (
			<Preview
				isFetching={ isFetching }
				importBlocks={ importBlocks }
			/>
		);
	}

	return (
		<div className="wp-block-themeisle-blocks-templates-cloud__modal-content">
			{ ( 'library' === currentTab ) && (
				<Library
					isFetching={ isFetching }
					importBlocks={ importBlocks }
				/>
			) }
		</div>
	);
};

export default Content;
