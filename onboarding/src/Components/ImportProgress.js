import { __ } from '@wordpress/i18n';
import ProgressBar from './ProgressBar';

const ImportProgress = ( { currentStep, actionsNb, actionsDone } ) => {
	const stepsMap = {
		cleanup: __(
			'Cleanup previous Import',
			'templates-patterns-collection'
		),
		theme_install: __(
			'Installing and Activating the Theme',
			'templates-patterns-collection'
		),
		plugins: __( 'Installing Plugins', 'templates-patterns-collection' ),
		content: __( 'Importing Content', 'templates-patterns-collection' ),
		customizer: __(
			'Importing Customizer Settings',
			'templates-patterns-collection'
		),
		widgets: __( 'Importing Widgets', 'templates-patterns-collection' ),
		performanceAddon: __(
			'Installing Performance Features',
			'templates-patterns-collection'
		),
	};

	const increaseAmount = 100 / ( actionsNb + 1 );
	const completed =
		actionsNb === actionsDone ? 100 : increaseAmount * actionsDone;

	return (
		<div className="ob-progress">
			<ProgressBar completed={ completed } />
			{ actionsNb !== actionsDone && stepsMap[ currentStep ] && (
				<p>{ stepsMap[ currentStep ] }...</p>
			) }
		</div>
	);
};

export default ImportProgress;
