import { Icon } from '@wordpress/components';
import SVG from '../../utils/svg';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';

const Search = ( { onSearch, onSubmit, query } ) => {
	const handleSubmit = ( e ) => {
		if ( onSubmit ) {
			e.preventDefault(); // Prevent form submission
			onSubmit( e );
		}
	};

	return (
		<form onSubmit={ handleSubmit } className="search-form">
			<input
				type="text"
				value={ query }
				onChange={ ( e ) => {
					onSearch( e.target.value );
				} }
				className="search-input"
			/>
			<button type="submit" className="search-button">
				<Icon icon={ SVG.search } />
			</button>
		</form>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getSearchQuery } = select( 'neve-onboarding' );
		return {
			query: getSearchQuery(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setSearchQuery } = dispatch( 'neve-onboarding' );
		return {
			onSearch: ( query ) => setSearchQuery( query ),
		};
	} )
)( Search );
