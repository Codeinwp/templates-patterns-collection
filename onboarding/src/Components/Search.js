/* global tiobDash, fetch */
import { Icon } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import classnames from 'classnames';
import SVG from '../utils/svg';

const Search = ( {
	onSearch,
	query,
	handleSubmit,
	step,
	deleteQuery,
	label,
} ) => {
	return (
		<form onSubmit={ handleSubmit } className="ob-search-form">
			{ label && <label htmlFor="ob-search-ss">{ label }</label> }
			<div className="ob-search-wrap">
				<Icon className="search-icon" icon={ SVG.search } />
				<input
					id="ob-search-ss"
					type="text"
					value={ query }
					onChange={ ( e ) => {
						onSearch( e.target.value );
					} }
					className="search-input"
				/>
				{ step === 1 ? (
					<button
						type="submit"
						className={ classnames(
							'search-button',
							query ? 'active' : ''
						) }
					>
						<Icon icon={ SVG.arrow } width={ 17 } height={ 12 } />
					</button>
				) : (
					<Icon
						className={ classnames(
							'remove-button',
							query ? 'active' : ''
						) }
						onClick={ deleteQuery }
						icon={ SVG.delete }
						width={ 16 }
						height={ 16 }
					/>
				) }
			</div>
		</form>
	);
};

export default compose(
	withSelect( ( select ) => {
		const {
			getSearchQuery,
			getCurrentStep,
			getCurrentCategory,
			getTrackingId,
		} = select( 'ti-onboarding' );
		return {
			category: getCurrentCategory(),
			query: getSearchQuery(),
			step: getCurrentStep(),
			trackingId: getTrackingId(),
		};
	} ),
	withDispatch( ( dispatch, { step, query, trackingId, category } ) => {
		const {
			setSearchQuery,
			setCategory,
			setOnboardingStep,
			setTrackingId,
		} = dispatch( 'ti-onboarding' );
		return {
			onSearch: ( searchQuery ) => setSearchQuery( searchQuery ),
			deleteQuery: () => setSearchQuery( '' ),
			handleSubmit: ( e ) => {
				e.preventDefault();
				setCategory( 'all' );
				if ( step === 1 ) {
					setOnboardingStep( 2 );
					fetch( 'https://api.themeisle.com/tracking/onboarding', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify( {
							_id: trackingId,
							data: {
								slug: 'templates-patterns-collection',
								license_id: tiobDash.license,
								site: tiobDash.onboarding.homeUrl || '',
								search: query,
								cat: category,
							},
						} ),
					} )
						.then( ( r ) => r.json() )
						.then( ( response ) => {
							if ( 'success' === response.code ) {
								const id = response.id;
								if ( id ) {
									setTrackingId( id );
								}
							}
						} )
						.catch( ( error ) => {
							console.error( error );
						} );
				}
			},
		};
	} )
)( Search );
