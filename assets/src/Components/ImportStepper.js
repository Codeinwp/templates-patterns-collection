import classnames from 'classnames';

import { __ } from '@wordpress/i18n';
import { Dashicon } from '@wordpress/components';

const ImportStepper = ( { currentStep, progress, willDo } ) => {
	const stepsMap = {
		cleanup: {
			label: __(
				'Cleanup previous Import',
				'templates-patterns-collection'
			),
			status: progress.cleanup,
			willDo: willDo.cleanup,
		},
		theme_install: {
			label: __(
				'Installing and Activating the Theme',
				'templates-patterns-collection'
			),
			status: progress.theme_install,
			willDo: willDo.theme_install,
		},
		plugins: {
			label: __( 'Installing Plugins', 'templates-patterns-collection' ),
			status: progress.plugins,
			willDo: true,
		},
		content: {
			label: __( 'Importing Content', 'templates-patterns-collection' ),
			status: progress.content,
			willDo: willDo.content,
		},
		customizer: {
			label: __(
				'Importing Customizer Settings',
				'templates-patterns-collection'
			),
			status: progress.customizer,
			willDo: willDo.customizer,
		},
		widgets: {
			label: __( 'Importing Widgets', 'templates-patterns-collection' ),
			status: progress.widgets,
			willDo: willDo.widgets,
		},
		performanceAddon: {
			label: __(
				'Installing Performance Features',
				'templates-patterns-collection'
			),
			status: progress.performanceAddon,
			willDo: willDo.performanceAddon,
		},
	};

	return (
		<ul className="stepper">
			{ Object.keys( stepsMap ).map( ( key, index ) => {
				const { label, status, willDo } = stepsMap[ key ];

				if ( ! willDo ) {
					return null;
				}

				const classes = classnames( [
					'icon',
					{
						loading: currentStep === key,
						warning: currentStep === key,
						success: 'done' === status,
						error: 'error' === status,
						skip: 'skip' === status,
					},
				] );

				let icon = 'clock';
				if ( currentStep === key ) {
					icon = 'update';
				}

				if ( 'done' === status ) {
					icon = 'yes';
				}

				if ( 'error' === status ) {
					icon = 'no-alt';
				}

				return (
					<li key={ index }>
						<span className={ classes }>
							<Dashicon
								icon={ icon }
								className={
									currentStep === key ? 'loading' : ''
								}
							/>
						</span>
						<span>{ label }</span>
					</li>
				);
			} ) }
		</ul>
	);
};

export default ImportStepper;
