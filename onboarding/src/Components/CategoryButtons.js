/* global fetch, tiobDash */
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import classnames from 'classnames';

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
		const { getCurrentCategory, getSearchQuery, getTrackingId } = select(
			'ti-onboarding'
		);
		return {
			category: getCurrentCategory(),
			query: getSearchQuery(),
			trackingId: getTrackingId(),
		};
	} ),
	withDispatch( ( dispatch, { query, trackingId, category } ) => {
		const { setOnboardingStep, setCategory, setTrackingId } = dispatch(
			'ti-onboarding'
		);
		return {
			onClick: ( newCategory ) => {
				setCategory( newCategory );
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
						// eslint-disable-next-line no-console
						console.error( error );
					} );
			},
		};
	} )
)( CategoryButtons );
