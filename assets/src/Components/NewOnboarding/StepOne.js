import { __ } from '@wordpress/i18n';
import { withDispatch } from '@wordpress/data';

import CategoryButtons from './CategoryButtons';
import Search from './Search';
import { ONBOARDING_CAT } from '../../utils/common';

const StepOne = ( { handleNextStep } ) => {
	return (
		<div className="ob-container narrow">
			<h1>{ __( 'What type of website are you creating?', 'neve' ) }</h1>
			<p>
				{ __(
					'Pick a category and we will provide you with relevant suggestions so you can find the starter site that works best for you.',
					'neve'
				) }
			</p>
			<CategoryButtons
				categories={ ONBOARDING_CAT }
				onClick={ handleNextStep }
			/>
			<div className="search-container">
				<p> { __( 'Or search for a site', 'neve' ) }</p>
				<Search onSubmit={ handleNextStep } />
			</div>
		</div>
	);
};

export default withDispatch( ( dispatch ) => {
	const { setOnboardingStep } = dispatch( 'neve-onboarding' );
	return {
		handleNextStep: () => {
			setOnboardingStep( 2 );
		},
	};
} )( StepOne );
