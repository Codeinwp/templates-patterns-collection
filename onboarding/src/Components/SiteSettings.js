import { __ } from '@wordpress/i18n';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Button } from '@wordpress/components';
import { useState, createInterpolateElement } from '@wordpress/element';
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
	general,
	setGeneral,
	fetching,
	siteData,
	siteStyle,
	setSiteStyle,
	importDataDefault,
} ) => {
	const [ settingsPage, setSettingsPage ] = useState( 1 );
	const canImport = ! siteData.upsell;

	let heading =
		settingsPage === 1
			? __( 'Customise design', 'templates-patterns-collection' )
			: __( 'Site details', 'templates-patterns-collection' );

	let description =
		settingsPage === 1
			? __(
				'Customise the design of your site, such as color and typography.',
				'templates-patterns-collection'
			  )
			: __(
				'Optionally add your business name and logo. You can change these later.',
				'templates-patterns-collection'
			  );
	if ( ! canImport ) {
		heading = __( 'This is a Premium Starter Site!', 'neve' );
		description = __(
			'Upgrade to Neve Pro to enjoy unlimited access to all templates in the library.',
			'neve'
		);
	}

	const secondUpsell = createInterpolateElement(
		__(
			'You can download this from your <link1></link1>. If you have any questions, feel free to <link2></link2>.',
			'templates-patterns-collection'
		),
		{
			link1: (
				<a
					href="https://store.themeisle.com/"
					target="_blank"
					rel="external noreferrer noopener"
				>
					{ __( 'dashboard', 'templates-patterns-collection' ) }
				</a>
			),
			link2: (
				<a
					href="https://themeisle.com/contact/"
					target="_blank"
					rel="external noreferrer noopener"
				>
					{ __( 'contact us', 'templates-patterns-collection' ) }
				</a>
			),
		}
	);

	return (
		<div
			className={ classnames(
				'ob-site-settings',
				fetching ? 'fetching' : ''
			) }
		>
			{ ! fetching ? (
				<>
					<div className="ob-settings-description">
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
						<h2>{ heading }</h2>
						<p>{ description }</p>
					</div>
					<div className="ob-settings-wrap">
						<div className="ob-settings-top">
							{ settingsPage === 1 && (
								<>
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

							{ settingsPage === 2 &&
								( canImport ? (
									<>
										<SiteNameControl
											importDataDefault={
												importDataDefault
											}
										/>
										<LogoControl
											importDataDefault={
												importDataDefault
											}
										/>
									</>
								) : (
									<Button
										isPrimary
										className="ob-button full"
										href="https://themeisle.com/themes/neve/upgrade/"
										rel="external noreferrer noopener"
										target="_blank"
									>
										{ __(
											'Unlock Access',
											'templates-patterns-collection'
										) }
									</Button>
								) ) }
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
							{ settingsPage === 2 &&
								( canImport ? (
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
								) : (
									<div className="ob-pro-info">
										<h4>
											{ __(
												'Already a customer',
												'templates-patterns-collection'
											) }
										</h4>
										<p>
											{ __(
												'If you are an existing Neve Pro customer, please install the premium version of the plugin.',
												'templates-patterns-collection'
											) }
										</p>
										<p>{ secondUpsell }</p>
									</div>
								) ) }
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
		const { getFetching, getCurrentSite } = select( 'ti-onboarding' );
		return {
			fetching: getFetching(),
			siteData: getCurrentSite(),
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
