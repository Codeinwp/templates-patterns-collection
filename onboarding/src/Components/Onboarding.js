import { Fragment } from '@wordpress/element';

import Header from './Header';
import Welcome from './Steps/Welcome';
import SiteList from './Steps/SiteList';
import CustomizeSite from './Steps/CustomizeSite';

import { withSelect } from '@wordpress/data';

const Onboarding = ( { step } ) => {
	return (
		<Fragment>
			<Header />
			{ step === 1 && <Welcome /> }
			{ step === 2 && <SiteList /> }
			{ step === 3 && <CustomizeSite /> }
		</Fragment>
	);
};

// export default Onboarding;

export default withSelect( ( select ) => {
	const { getCurrentStep } = select( 'ti-onboarding' );
	return {
		step: getCurrentStep(),
	};
} )( Onboarding );
