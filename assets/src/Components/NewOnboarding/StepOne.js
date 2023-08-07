import { __ } from '@wordpress/i18n';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';

import CategoryButtons from './CategoryButtons';
import Search from './Search';
import { CATEGORIES } from '../../utils/common';

const StepOne = ( { handleNextStep } ) => {
	// const handleCategorySelect = ( category ) => {
	// 	onCategorySelect( category );
	// 	onNextStep();
	// };
	//
	// const handleSearchUpdate = ( e ) => {
	// 	const newSearchText = e.target.value;
	// 	onSearchUpdate( newSearchText );
	// };

	return (
		<>
			<h1>{ __( 'What type of website are you creating?', 'neve' ) }</h1>
			<p>
				{ __(
					'Pick a category and we will provide you with relevant suggestions so you can find the starter site that works best for you.',
					'neve'
				) }
			</p>
			<CategoryButtons
				categories={ CATEGORIES }
				onClick={ handleNextStep }
			/>
			<div className="search-container">
				<p> { __( 'Or search for a site', 'neve' ) }</p>
				<Search onSubmit={ handleNextStep } />
			</div>
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
)( StepOne );
