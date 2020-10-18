/**
 * WordPress dependencies
 */
const { parse } = wp.blocks;

const { Modal } = wp.components;

const { useDispatch } = wp.data;

/**
 * Internal dependencies
 */
import Header from './components/header.js';
import Content from './components/content.js';

const Edit = ({
	clientId
}) => {
	const {
		removeBlock,
		replaceBlocks
	} = useDispatch( 'core/block-editor' );

	const closeModal = () => removeBlock( clientId );

	const importBlocks = content => replaceBlocks( clientId, parse( content ) );

	return (
		<Modal
			onRequestClose={ closeModal }
			shouldCloseOnEsc={ false }
			shouldCloseOnClickOutside={ false }
			isDismissible={ false }
			overlayClassName="wp-block-themeisle-blocks-templates-cloud__modal"
		>
			<Header
				closeModal={ closeModal }
			/>

			<Content
				importBlocks={ importBlocks }
			/>
		</Modal>
	);
};

export default Edit;
