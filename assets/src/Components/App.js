import { withSelect } from '@wordpress/data';
import classnames from 'classnames';

import Onboarding from './Main';
import NewComponent from './NewOnboarding/NewOnboarding';
import { useState } from '@wordpress/element';
import { LicensePanelContext } from './LicensePanelContext';

const App = ( { onboarding, userStatus } ) => {
	const wrapClasses = classnames( [
		'content-wrap',
		'starter-sites',
		{
			'is-onboarding': onboarding,
			'is-free': ! userStatus,
		},
	] );

	const [ isLicenseOpen, setLicenseOpen ] = useState( false );
	const contextValue = { isLicenseOpen, setLicenseOpen };
	const shouldShowNewOnboarding = true; // Define your condition here
	return (
		<LicensePanelContext.Provider value={ contextValue }>
			<div className="tiob-wrap">
				<div className={ wrapClasses }>
					{ shouldShowNewOnboarding ? (
						<NewComponent /> // Render the new component
					) : (
						<div className="container content">
							<div className="main">
								<div className="tab-content columns starter-sites">
									<Onboarding />
								</div>
							</div>
						</div>
					) }
				</div>
			</div>
		</LicensePanelContext.Provider>
	);
};

export default withSelect( ( select ) => {
	const { getOnboardingStatus, getUserStatus } = select( 'neve-onboarding' );
	return {
		onboarding: getOnboardingStatus(),
		userStatus: getUserStatus(),
	};
} )( App );
