import { Fragment, useState } from '@wordpress/element';

import Header from './Header';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';

import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';

import Migration from './../Migration';
import Library from './../CloudLibrary/Library';
import ImportModal from './../ImportModal';
import DemoSiteTemplatesImport from './../CloudLibrary/DemoSiteTemplatesImport';

import OnboardingContent from './../OnboardingContent';

const NewOnboarding = ( {
	step,
	handleNextStep,
	getSites,
	singleImport,
	importModal,
	currentSiteData,
} ) => {
	const { migration } = getSites;

	return (
		<Fragment>
			<Header />
				{ step === 1 && <StepOne /> }
				{ step === 2 && <StepTwo /> }
				{ step === 3 && <StepThree /> }
		</Fragment>
	);
};

export default compose(
	withDispatch( ( dispatch ) => {
		const {
			setOnboardingState,
			setCurrentCategory,
			setOnboardingStep,
		} = dispatch( 'neve-onboarding' );
		return {
			cancelOnboarding: () => {
				setOnboardingState( false );
			},
			resetCategory: () => {
				setCurrentCategory( 'all' );
			},
			handleNextStep: ( step ) => {
				setOnboardingStep( step + 1 );
			},
		};
	} ),
	withSelect( ( select ) => {
		const {
			getCurrentEditor,
			getCurrentCategory,
			getPreviewStatus,
			getCurrentSite,
			getImportModalStatus,
			getOnboardingStatus,
			getSites,
			getInstallModalStatus,
			getSingleImport,
			getCurrentStep,
		} = select( 'neve-onboarding' );
		return {
			editor: getCurrentEditor(),
			category: getCurrentCategory(),
			previewOpen: getPreviewStatus(),
			currentSiteData: getCurrentSite(),
			importModal: getImportModalStatus(),
			installModal: getInstallModalStatus(),
			isOnboarding: getOnboardingStatus(),
			getSites: getSites(),
			singleImport: getSingleImport(),
			step: getCurrentStep(),
		};
	} )
)( NewOnboarding );
