import { CATEGORIES } from '../../utils/common';
import CategoryButtons from './CategoryButtons';
import Search from './Search';
import { __ } from '@wordpress/i18n';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import OnboardingContent from '../OnboardingContent';

const StepTwo = ( { handleNextStep } ) => {

	return (
		<>
			<h1>{ __( 'Choose a design', 'neve' ) }</h1>
			<Search onSubmit={ handleNextStep } />
			<CategoryButtons categories={ CATEGORIES } />
			<OnboardingContent />
		</>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getCurrentStep } = select( 'neve-onboarding' );
		return {
			step: getCurrentStep(),
		};
	} ),
	withDispatch( ( dispatch, { step } ) => {
		const { setOnboardingStep } = dispatch( 'neve-onboarding' );
		return {
			handleNextStep: () => {
				setOnboardingStep( step + 1 );
			},
		};
	} )
)( StepTwo );
