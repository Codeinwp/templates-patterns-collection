import { Icon } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import SVG from '../../utils/svg';

const Search = ( { onSearch, onSubmit, query } ) => {
	const handleSubmit = ( e ) => {
		e.preventDefault();
		if ( onSubmit ) {
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
