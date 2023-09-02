import { __ } from '@wordpress/i18n';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import PaletteControl from './CustomizeControls/PaletteControl';
import TypographyControl from './CustomizeControls/TypographyControl';
import SiteNameControl from './CustomizeControls/SiteNameControl';
import LogoControl from './CustomizeControls/LogoControl';
import ImportOptionsControl from './CustomizeControls/ImportOptionsControl';
import ImportMock from './ImportMock';
import classnames from 'classnames';

export const SiteSettings = ( {
	handlePrevStepClick,
	handleNextStepClick,
	isProUser,
	general,
	setGeneral,
	fetching,
} ) => {
	const [ settingsPage, setSettingsPage ] = useState( 1 );
	const [ siteStyle, setSiteStyle ] = useState( {
		palette: 'base',
		font: 'default',
	} );

	return (
		<div
			className={ classnames(
				'ob-site-settings',
				fetching ? 'fetching' : ''
			) }
		>
			{ ! fetching ? (
				<>
					<Button
						className="ob-back"
						type="link"
						onClick={ () => {
							if ( settingsPage === 2 ) {
								setSettingsPage( 1 );
								return;
							}
							handlePrevStepClick();
						} }
					>
						{ __( 'Go back', 'templates-patterns-collection' ) }
					</Button>
					<div className="ob-settings-wrap">
						<div className="ob-settings-top">
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
									<PaletteControl
										siteStyle={ siteStyle }
										setSiteStyle={ setSiteStyle }
									/>
									<TypographyControl
										siteStyle={ siteStyle }
										setSiteStyle={ setSiteStyle }
									/>
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
						<div className="ob-settings-bottom">
							{ settingsPage === 1 && (
								<Button
									disabled={ fetching }
									isPrimary
									className="ob-button full"
									onClick={ () => setSettingsPage( 2 ) }
								>
									{ __( 'Continue', 'neve' ) }
								</Button>
							) }
							{ settingsPage === 2 && (
								<>
									<ImportOptionsControl
										general={ general }
										setGeneral={ setGeneral }
									/>
									<Button
										disabled={ fetching }
										className="ob-button full"
										isPrimary
										onClick={ handleNextStepClick }
									>
										{ __(
											'Import Website',
											'templates-patterns-collection'
										) }
									</Button>
								</>
							) }
						</div>
					</div>
				</>
			) : (
				<ImportMock />
			) }
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getUserStatus, getFetching } = select( 'ti-onboarding' );
		return {
			isProUser: getUserStatus(),
			fetching: getFetching(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setOnboardingStep } = dispatch( 'ti-onboarding' );
		return {
			handlePrevStepClick: () => setOnboardingStep( 2 ),
			handleNextStepClick: () => setOnboardingStep( 4 ),
		};
	} )
)( SiteSettings );
