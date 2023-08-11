import { __ } from '@wordpress/i18n';
import Filters from './Filters';
import Sites from './Sites';
import EditorSelector from './EditorSelector';
import { EDITOR_MAP } from '../../utils/common';

const StepTwo = () => {
	return (
		<div className="ob-container wide">
			<div className="ob-title-wrap">
				<h1>
					{ __( 'Choose a design', 'templates-patterns-collection' ) }
				</h1>
				<EditorSelector EDITOR_MAP={ EDITOR_MAP } />
			</div>
			<Filters />
			<Sites />
		</div>
	);
};

export default StepTwo;
