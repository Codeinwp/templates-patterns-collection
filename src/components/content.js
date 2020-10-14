/**
 * WordPress dependencies
 */
const {
	Placeholder,
	Spinner
} = wp.components;

const {	useSelect } = wp.data;

const { useEffect } = wp.element;

/**
 * Internal dependencies
 */
import { fetchTemplates } from './../data/templates-cloud/index.js';

import ListItem from './list-item.js';

const Content = ({
	importBlocks
}) => {
	const templates = useSelect( select => select( 'tpc/block-editor' ).getTemplates() ) || [];
	const isFetching = useSelect( select => select( 'tpc/block-editor' ).isFetching() );

	useEffect( async() => await fetchTemplates(), []);

	if ( isFetching ) {
		return (
			<div className="wp-block-themeisle-blocks-templates-cloud__modal-content">
				<Placeholder><Spinner/></Placeholder>
			</div>
		);
	}

	return (
		<div className="wp-block-themeisle-blocks-templates-cloud__modal-content">
			{ Boolean( templates.length ) && (
				<div className="wp-block-themeisle-blocks-templates-cloud__modal-content__table">
					{ templates.map( template => (
						<ListItem
							template={ template }
							importBlocks={ importBlocks }
						/>
					) ) }
				</div>
			) }
		</div>
	);
};

export default Content;
