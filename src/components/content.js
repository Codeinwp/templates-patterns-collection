/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
	useDispatch,
	useSelect
} = wp.data;

const { useEffect } = wp.element;

/**
 * Internal dependencies
 */
import { fetchTemplates } from './../data/templates-cloud/index.js';
import Preview from './preview.js';
import Library from './library.js';
import Notices from './notices.js';

const Content = ({
	importBlocks
}) => {
	const { setFetching } = useDispatch( 'tpc/block-editor' );

	const isFetching = useSelect( select => select( 'tpc/block-editor' ).isFetching() );
	const isPreview = useSelect( select => select( 'tpc/block-editor' ).isPreview() );
	const currentTab = useSelect( select => select( 'tpc/block-editor' ).getCurrentTab() );

	useEffect( () => {
		init();
	}, []);

	const init = async() => {
		setFetching( true );
		await fetchTemplates();
		setFetching( false );
	};

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
			<Notices/>

			{ ( 'library' === currentTab ) ? (
				<Library
					isFetching={ isFetching }
					importBlocks={ importBlocks }
				/>
			) : (
				__( 'We\'re still working on this. Please check back later. Thank you!' )
			) }
		</div>
	);
};

export default Content;
