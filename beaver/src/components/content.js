import { useSelect } from '@wordpress/data';

import Preview from './preview';
import Export from './export';
import TemplatesContent from './templates-content';

const Content = ( {
	importTemplate,
	getOrder,
	setQuery,
	getSearchQuery,
	setSorting,
	isSearch,
	setSearch,
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
				importTemplate={ importTemplate }
			/>
		);
	}

	if ( 'export' === currentTab ) {
		return <Export />;
	}

	return (
		<div className="tpc-modal-content">
			<TemplatesContent
				isFetching={ isFetching }
				isGeneral={ currentTab === 'templates' }
				importTemplate={ importTemplate }
				getOrder={ getOrder }
				setQuery={ setQuery }
				getSearchQuery={ getSearchQuery }
				setSorting={ setSorting }
				isSearch={ isSearch }
				setSearch={ setSearch }
			/>
		</div>
	);
};

export default Content;
