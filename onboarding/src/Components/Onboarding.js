import { Fragment, useState } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import Header from './Header';
import Welcome from './Steps/Welcome';
import SiteList from './Steps/SiteList';
import CustomizeSite from './Steps/CustomizeSite';

import Import from './Steps/Import';

const Onboarding = ( { step, themeData } ) => {
	const [ general, setGeneral ] = useState( {
		content: true,
		customizer: true,
		widgets: true,
		cleanup: false,
		performanceAddon: true,
		theme_install: themeData !== false,
	} );
	const [ importing, setImporting ] = useState( false );
	const [ showToast, setShowToast ] = useState( false );

	return (
		<Fragment>
			<Header importing={ importing } />
			{ step === 1 && <Welcome /> }
			{ step === 2 && (
				<SiteList
					showToast={ showToast }
					setShowToast={ setShowToast }
				/>
			) }
			{ ( step === 3 || step === 4 ) && (
				<CustomizeSite general={ general } setGeneral={ setGeneral } />
			) }
			{ step === 5 && (
				<Import
					general={ general }
					importing={ importing }
					setImporting={ setImporting }
				/>
			) }
		</Fragment>
	);
};

export default withSelect( ( select ) => {
	const { getCurrentStep, getThemeAction } = select( 'ti-onboarding' );
	return {
		step: getCurrentStep(),
		themeData: getThemeAction(),
	};
} )( Onboarding );
