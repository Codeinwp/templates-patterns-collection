import { EDITOR_MAP } from '../../utils/common';
import { __ } from '@wordpress/i18n';
import Filters from './Filters';
import Sites from './Sites';
import EditorSelector from './EditorSelector';

const StepTwo = () => {
	return (
		<div className="ob-container wide">
			<div className="ob-title-wrap">
				<h1>{ __( 'Choose a design', 'neve' ) }</h1>
				<EditorSelector EDITOR_MAP={ EDITOR_MAP } />
			</div>
			<Filters />
			<Sites />
		</div>
	);
};

export default StepTwo;
