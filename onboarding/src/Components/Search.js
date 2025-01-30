/* global tiobDash */
import { Icon } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import classnames from 'classnames';
import SVG from '../utils/svg';
import { track } from '../utils/rest';

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
	withDispatch( ( dispatch, { step, query, trackingId } ) => {
		const { setSearchQuery, setCategory, setOnboardingStep } =
			dispatch( 'ti-onboarding' );
		return {
			onSearch: ( searchQuery ) => setSearchQuery( searchQuery ),
			deleteQuery: () => setSearchQuery( '' ),
			handleSubmit: ( e ) => {
				e.preventDefault();
				if ( step === 1 ) {
					setOnboardingStep( 2 );
					const data = {
						slug: 'neve',
						license_id: tiobDash.license,
						site: tiobDash.onboarding.homeUrl || '',
						search: query,
						cat: 'all',
						step_id: 1,
						step_status: 'completed',
					};
					track( trackingId, data ).catch( ( error ) => {
						// eslint-disable-next-line no-console
						console.error( error );
					} );
				}
			},
		};
	} )
)( Search );
