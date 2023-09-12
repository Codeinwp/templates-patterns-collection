/* global fetch */
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
	currentCustomizations,
	trackingId,
	editor,
} ) => {
	const [ settingsPage, setSettingsPage ] = useState( 1 );
	const canImport = ! siteData.upsell;
	const { siteName, siteLogo } = currentCustomizations;

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
		heading = __(
			'This is a Premium Starter Site!',
			'templates-patterns-collection'
		);
		description = __(
			'Upgrade to Neve Pro to enjoy unlimited access to all templates in the library.',
			'templates-patterns-collection'
		);
	}

	const firstUpsell = createInterpolateElement(
		__(
			'If you are an existing Neve Pro customer, please install the premium version of the plugin from your Themeisle <a></a>.',
			'templates-patterns-collection'
		),
		{
			a: (
				<a
					href="https://store.themeisle.com/"
					target="_blank"
					rel="external noreferrer noopener"
				>
					{ __(
						'account dashboard',
						'templates-patterns-collection'
					) }
				</a>
			),
		}
	);
	const secondUpsell = createInterpolateElement(
		__(
			'If you have any questions, feel free to <a></a>.',
			'templates-patterns-collection'
		),
		{
			a: (
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

	const designChocicesSubmit = () => {
		setSettingsPage( 2 );
		if ( ! trackingId ) {
			return;
		}
		fetch( 'https://api.themeisle.com/tracking/onboarding', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( {
				_id: trackingId,
				data: {
					designChoices: {
						palette: siteStyle.palette,
						typography: siteStyle.font,
					},
					selectedTemplate: siteData.title,
					type: editor,
				},
			} ),
		} ).catch( ( error ) => {
			// eslint-disable-next-line no-console
			console.error( error );
		} );
	};

	const identityChoicesSubmit = () => {
		handleNextStepClick();
		fetch( 'https://api.themeisle.com/tracking/onboarding', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( {
				_id: trackingId,
				data: {
					siteIdentityFilled: siteName || siteLogo,
					importedItems: general,
				},
			} ),
		} ).catch( ( error ) => {
			// eslint-disable-next-line no-console
			console.error( error );
		} );
	};

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
									onClick={ designChocicesSubmit }
								>
									{ __(
										'Continue',
										'templates-patterns-collection'
									) }
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
											isPrimary
											className="ob-button full"
											onClick={ identityChoicesSubmit }
											disabled={
												fetching ||
												( ! siteName && ! siteLogo )
											}
										>
											{ __(
												'Import Website',
												'templates-patterns-collection'
											) }
										</Button>
										<Button
											isLink
											className="ob-link"
											onClick={ identityChoicesSubmit }
											disabled={ fetching }
										>
											{ __(
												'Skip and import website',
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
										<p>{ firstUpsell }</p>
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
		const {
			getFetching,
			getCurrentSite,
			getUserCustomSettings,
			getTrackingId,
			getCurrentEditor,
		} = select( 'ti-onboarding' );
		return {
			fetching: getFetching(),
			siteData: getCurrentSite(),
			currentCustomizations: getUserCustomSettings(),
			trackingId: getTrackingId(),
			editor: getCurrentEditor(),
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
