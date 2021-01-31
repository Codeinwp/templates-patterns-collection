import { useSelect } from '@wordpress/data';

import Preview from './preview';
import TemplatesContent from './templates-content';

const Content = ( {
	nodeID,
	closeModal,
	importTemplate,
	getOrder,
	setQuery,
	getSearchQuery,
	setSorting,
} ) => {
	const isFetching = useSelect( ( select ) =>
		select( 'tpc/beaver' ).isFetching()
	);

	const isPreview = useSelect( ( select ) =>
		select( 'tpc/beaver' ).isPreview()
	);

	const currentTab = useSelect( ( select ) =>
		select( 'tpc/beaver' ).getCurrentTab()
	);

	if ( isPreview ) {
		return (
			<Preview
				isFetching={ isFetching }
				importBlocks={ importTemplate }
			/>
		);
	}

	return (
		<div className="tpc-modal-content">
			<TemplatesContent
				nodeID={ nodeID }
				closeModal={ closeModal }
				isFetching={ isFetching }
				isGeneral={ currentTab === 'templates' }
				importTemplate={ importTemplate }
				getOrder={ getOrder }
				setQuery={ setQuery }
				getSearchQuery={ getSearchQuery }
				setSorting={ setSorting }
			/>
		</div>
	);
};

export default Content;
