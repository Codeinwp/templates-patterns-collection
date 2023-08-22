import { __ } from '@wordpress/i18n';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import PaletteControl from './CustomizeControls/PaletteControl';
import TypographyControl from './CustomizeControls/TypographyControl';
import SiteNameControl from './CustomizeControls/SiteNameControl';
import LogoControl from "./CustomizeControls/LogoControl";

export const PreviewSettings = ( { handlePrevStepClick, isProUser } ) => {
	const [ settingsPage, setSettingsPage ] = useState( 1 );

	return (
		<div className="ob-preview-settings">
			<Button
				className="back"
				type="link"
				onClick={ () => {
					if ( settingsPage === 2 ) {
						setSettingsPage( 1 );
					} else {
						handlePrevStepClick();
					}
				} }
			>
				{ __( 'Go back', 'templates-patterns-collection' ) }
			</Button>
			{ settingsPage === 1 && (
				<>
					<h2>
						{ __(
							'Customise design',
							'templates-patterns-collection'
						) }
					</h2>
					<p>
						{ __(
							'Customise the design of your site, such as color and typography.',
							'templates-patterns-collection'
						) }
					</p>
					<PaletteControl />
					<TypographyControl />
					<Button
						isPrimary
						className="ob-button full"
						onClick={ () => setSettingsPage( 2 ) }
					>
						{ __( 'Continue', 'neve' ) }
					</Button>
				</>
			) }

			{ settingsPage === 2 && isProUser && (
				<>
					<h2>
						{ __(
							'Site details',
							'templates-patterns-collection'
						) }
					</h2>
					<p>
						{ __(
							'Optionally add your business name and logo. You can change these later.',
							'templates-patterns-collection'
						) }
					</p>
					<SiteNameControl />
					<LogoControl />
				</>
			) }
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getUserStatus } = select( 'ti-onboarding' );
		return {
			isProUser: getUserStatus(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setOnboardingStep } = dispatch( 'ti-onboarding' );
		return {
			handlePrevStepClick: () => {
				setOnboardingStep( 2 );
			},
		};
	} )
)( PreviewSettings );
