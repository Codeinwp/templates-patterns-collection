import { parse } from '@wordpress/blocks';
import { Modal } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';

import Header from './components/header';
import Content from './components/content';

const Edit = ( { clientId } ) => {
	const { removeBlock, replaceBlocks } = useDispatch( 'core/block-editor' );

	const closeModal = () => removeBlock( clientId );

	const importBlocks = ( content ) =>
		replaceBlocks( clientId, parse( content ) );

	return (
		<Modal
			onRequestClose={ closeModal }
			shouldCloseOnEsc={ false }
			shouldCloseOnClickOutside={ false }
			isDismissible={ false }
			overlayClassName="tpc-template-cloud-modal"
		>
			<Header closeModal={ closeModal } />

			<Content importBlocks={ importBlocks } />
		</Modal>
	);
};

export default Edit;
