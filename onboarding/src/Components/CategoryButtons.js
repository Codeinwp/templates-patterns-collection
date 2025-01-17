/* global tiobDash */
import { useSelect, useDispatch } from '@wordpress/data';
import classnames from 'classnames';
import { track } from '../utils/rest';
import { useMemo } from '@wordpress/element';

const CategoryButtons = ( { categories, style } ) => {
	const data = useSelect( ( select ) => ( {
		category: select( 'ti-onboarding' ).getCurrentCategory(),
		query: select( 'ti-onboarding' ).getSearchQuery(),
		trackingId: select( 'ti-onboarding' ).getTrackingId(),
		step: select( 'ti-onboarding' ).getCurrentStep(),
	} ) );

	const { setOnboardingStep, setCategory } = useDispatch( 'ti-onboarding' );

	// Show "All" and "Free" categories after user selection.
	const availableCategories = useMemo(() => {
		return Object.keys(categories).filter((key) => 
			data.category || (key !== 'all' && key !== 'free')
		);
	}, [categories, data.category]);

	const onClick = ( newCategory ) => {
		setCategory( newCategory );

		if ( data.step === 1 ) {
			setOnboardingStep( 2 );

			const trackData = {
				slug: 'neve',
				license_id: tiobDash.license,
				site: tiobDash.onboarding.homeUrl || '',
				search: data.query,
				cat: newCategory,
				step_id: 1,
				step_status: 'completed',
			};

			track( data.trackingId, trackData ).catch( ( error ) => {
				// eslint-disable-next-line no-console
				console.error( error );
			} );
		}
	};

	return (
		<div className="ob-cat-wrap" style={ style }>
			{ availableCategories.map( ( catSlug ) => {
				const classes = classnames( {
					cat: true,
					[ catSlug ]: true,
					active: catSlug === data.category,
				} );

				return (
					<button
						className={ classes }
						key={ catSlug }
						onClick={ () => onClick( catSlug ) }
					>
						{ categories[ catSlug ] }
					</button>
				);
			} ) }
		</div>
	);
};

export default CategoryButtons;
