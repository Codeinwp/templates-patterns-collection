import { __ } from '@wordpress/i18n';
import Filters from '../Filters';
import Sites from '../Sites';
import EditorSelector from '../EditorSelector';
import { useEffect } from '@wordpress/element';
import { withDispatch } from '@wordpress/data';

const SiteList = ( { setFetching } ) => {
	useEffect( () => {
		setFetching( true );
	}, [] );

	return (
		<div className="ob-container wide">
			<div className="ob-title-wrap">
				<h1>
					{ __( 'Choose a design', 'templates-patterns-collection' ) }
				</h1>
				<EditorSelector />
			</div>
			<Filters />
			<Sites />
		</div>
	);
};

export default withDispatch( ( dispatch ) => {
	const { setFetching } = dispatch( 'ti-onboarding' );
	return {
		setFetching,
	};
} )( SiteList );
