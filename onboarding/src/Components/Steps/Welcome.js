/* global tiobDash */
import { __ } from '@wordpress/i18n';
import { withSelect, withDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import CategoryButtons from '../CategoryButtons';
import Search from '../Search';
import { ONBOARDING_CAT } from '../../utils/common';
import { track } from '../../utils/rest';
import WelcomeMock from '../WelcomeMock';

const Welcome = ( { trackingId, setTrackingId, fetching, setFetching } ) => {
	useEffect( () => {
		if ( trackingId ) {
			setFetching( false );
			return;
		}

		setFetching( true );
		const data = {
			slug: 'neve',
			license_id: tiobDash.license,
			site: tiobDash.onboarding.homeUrl || '',
		};
		track( trackingId, data )
			.then( ( id ) => {
				if ( id ) {
					setTrackingId( id );
				}
			} )
			.catch( ( error ) => {
				// eslint-disable-next-line no-console
				console.error( error );
			} )
			.finally( () => {
				setFetching( false );
			} );
	}, [] );

	return (
		<div className="ob-container narrow">
			{ ! fetching ? (
				<>
					<h1>
						{ __(
							'What type of website are you creating?',
							'templates-patterns-collection'
						) }
					</h1>
					<p>
						{ __(
							'Pick a category and we will provide you with relevant suggestions so you can find the starter site that works best for you.',
							'templates-patterns-collection'
						) }
					</p>
					<CategoryButtons
						categories={ ONBOARDING_CAT }
						style={ { margin: '26px 0' } }
					/>
					<div className="ob-search-container">
						<Search
							label={ __(
								'Or search for a site',
								'templates-patterns-collection'
							) }
						/>
					</div>
				</>
			) : (
				<WelcomeMock />
			) }
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getTrackingId, getFetching } = select( 'ti-onboarding' );
		return {
			trackingId: getTrackingId(),
			fetching: getFetching(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setTrackingId, setFetching } = dispatch( 'ti-onboarding' );
		return {
			setTrackingId,
			setFetching,
		};
	} )
)( Welcome );
