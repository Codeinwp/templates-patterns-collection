import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';

import Preview from './preview';
import TemplatesContent from './templates-content';
import Notices from './notices';

const Content = ( { importBlocks, isPreview, currentTab, isFetching } ) => {
	if ( isPreview && currentTab === 'library' ) {
		return (
			<Preview isFetching={ isFetching } importBlocks={ importBlocks } />
		);
	}

	return (
		<div className="tpc-modal-content">
			<Notices />
			{ [ 'templates', 'library' ].includes( currentTab ) && (
				<TemplatesContent
					isFetching={ isFetching }
					isGeneral={ currentTab === 'templates' }
					importBlocks={ importBlocks }
				/>
			) }
			{ currentTab === 'patterns' &&
				__(
					'We are still working on this. Please check back later. Thank you!'
				) }
		</div>
	);
};

export default withSelect( ( select ) => {
	const { isPreview, isFetching, getCurrentTab } = select(
		'tpc/block-editor'
	);
	return {
		isPreview: isPreview(),
		isFetching: isFetching(),
		currentTab: getCurrentTab(),
	};
} )( Content );
