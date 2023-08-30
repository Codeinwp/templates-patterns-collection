import { Fragment, useState } from '@wordpress/element';

import Header from './Header';
import Welcome from './Steps/Welcome';
import SiteList from './Steps/SiteList';
import CustomizeSite from './Steps/CustomizeSite';
import Import from './Steps/Import';

import { withSelect } from '@wordpress/data';

const Onboarding = ( { step, themeData } ) => {
	const [ general, setGeneral ] = useState( {
		content: true,
		customizer: true,
		widgets: true,
		cleanup: false,
		performanceAddon: true,
		theme_install: themeData !== false,
	} );
	const [ error, setError ] = useState( null );
	const [ fetching, setFetching ] = useState( true );
	const [ importData, setImportData ] = useState( null );
	const [ pluginOptions, setPluginOptions ] = useState( {} );

	return (
		<Fragment>
			<Header />
			{ step === 1 && <Welcome /> }
			{ step === 2 && <SiteList /> }
			{ step === 3 && (
				<CustomizeSite
					general={ general }
					setGeneral={ setGeneral }
					setError={ setError }
					setFetching={ setFetching }
					setImportData={ setImportData }
					setPluginOptions={ setPluginOptions }
				/>
			) }
			{ step === 4 && (
				<Import
					general={ general }
					error={ error }
					pluginOptions={ pluginOptions }
					setError={ setError }
					importData={ importData }
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
