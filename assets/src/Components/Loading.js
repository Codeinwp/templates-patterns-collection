import { withSelect } from '@wordpress/data';
import classnames from "classnames";

const Loading = ( { isOnboarding } ) => {
	return (
		<div className="table">
			{ [ 1, 2, 3, 4, 5, 6, 7, 8 ].map( ( i ) => {
				return (
					<div key={ i } className="table-grid">
						<div className="grid-preview image is-loading">
						</div>
						<div className="card-footer">
							<p className="title loading" style={ {
								height: 14,
								'background-color': '#f3f3f3',
							} } />
						</div>
					</div>
				);
			} ) }
			<div className="fade-out"></div>
		</div>
	);
};

export default withSelect( ( select ) => {
	const { getOnboardingStatus } = select( 'neve-onboarding' );
	return { isOnboarding: getOnboardingStatus() };
} )( Loading );
