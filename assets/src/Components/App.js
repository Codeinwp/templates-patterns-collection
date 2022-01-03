import { withSelect } from '@wordpress/data';
import classnames from 'classnames';

import Onboarding from './Main';

const App = ( { onboarding, userStatus } ) => {
	const wrapClasses = classnames( [
		'content-wrap',
		'starter-sites',
		{
			'is-onboarding': onboarding,
			'is-free': ! userStatus,
		},
	] );
	return (
		<div className="tiob-wrap">
			<div className={ wrapClasses }>
				<div className="container content">
					<div className="main">
						<div className="tab-content columns starter-sites">
							<Onboarding />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withSelect( ( select ) => {
	const { getOnboardingStatus, getUserStatus } = select( 'neve-onboarding' );
	return {
		onboarding: getOnboardingStatus(),
		userStatus: getUserStatus(),
	};
} )( App );
