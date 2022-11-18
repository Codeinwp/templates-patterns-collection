import { withSelect } from '@wordpress/data';
import classnames from 'classnames';

import Onboarding from './Main';
import {useState} from "@wordpress/element";
import {LicensePanelContext} from "./LicensePanelContext";

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

	return (
		<LicensePanelContext.Provider value={ contextValue }>
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
