/* global tiobDash */
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import classnames from 'classnames';
import { track } from '../utils/rest';

const CategoryButtons = ( { category, categories, onClick, style } ) => {
	return (
		<div className="ob-cat-wrap" style={ style }>
			{ Object.keys( categories ).map( ( key, index ) => {
				const classes = classnames( {
					cat: true,
					[ key ]: true,
					active: key === category,
				} );

				return (
					<button
						className={ classes }
						key={ index }
						onClick={ () => onClick( key ) }
					>
						{ categories[ key ] }
					</button>
				);
			} ) }
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const {
			getCurrentCategory,
			getSearchQuery,
			getTrackingId,
			getCurrentStep,
		} = select( 'ti-onboarding' );
		return {
			category: getCurrentCategory(),
			query: getSearchQuery(),
			trackingId: getTrackingId(),
			step: getCurrentStep(),
		};
	} ),
	withDispatch( ( dispatch, { query, trackingId, category, step } ) => {
		const { setOnboardingStep, setCategory } = dispatch( 'ti-onboarding' );
		return {
			onClick: ( newCategory ) => {
				setCategory( newCategory );
				if ( step === 1 ) {
					setOnboardingStep( 2 );
					const data = {
						slug: 'neve',
						license_id: tiobDash.license,
						site: tiobDash.onboarding.homeUrl || '',
						search: query,
						cat: category,
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
)( CategoryButtons );
