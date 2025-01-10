/* global tiobDash */
import { __ } from '@wordpress/i18n';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
import { Button, __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';
import { createInterpolateElement, useState } from '@wordpress/element';
import PaletteControl from './CustomizeControls/PaletteControl';
import TypographyControl from './CustomizeControls/TypographyControl';
import SiteNameControl from './CustomizeControls/SiteNameControl';
import LogoControl from './CustomizeControls/LogoControl';
import ImportMock from './ImportMock';
import classnames from 'classnames';
import { track } from '../utils/rest';
import FeaturesControl from './CustomizeControls/FeaturesControl';

export const SiteSettings = ( {
	general,
	fetching,
	siteData,
	siteStyle,
	setSiteStyle,
	importDataDefault,
	currentCustomizations,
	trackingId,
	setOnboardingStep,
	step,
} ) => {
	const canImport = ! siteData.upsell;
	const { siteName, siteLogo } = currentCustomizations;
	const [ settingsChanged, setSettingsChanged ] = useState( false );
	const dashboardLink = tiobDash.onboardingUpsell?.dashboard;
	const contactLink = tiobDash.onboardingUpsell?.contact;

	const [ openConfirmationModal, setOpenConfirmationModal ] = useState( false );
	const [ skipSuggestions, setSkipSuggestions ] = useState( false );

	let heading =
		step === 3
			? __( 'Customize design', 'templates-patterns-collection' )
			: __( 'Select features', 'templates-patterns-collection' );

	let description = __(
		'Enhance your website with powerful plugins to fulfil your needs.',
		'templates-patterns-collection'
	);
	if ( step === 3 ) {
		description = __(
			'Customize the design of your site, such as color and typography.',
			'templates-patterns-collection'
		);
	}
	if ( ! canImport && step === 4 ) {
		heading = __(
			'This is a Premium Starter Site!',
			'templates-patterns-collection'
		);
		description = __(
			'Upgrade to Neve Business plan to enjoy unlimited access to all templates in the library.',
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
					href={ dashboardLink }
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
					href={ contactLink }
					target="_blank"
					rel="external noreferrer noopener"
				>
					{ __( 'contact us', 'templates-patterns-collection' ) }
				</a>
			),
		}
	);

	const designChoicesSubmit = () => {
		setOnboardingStep( 4 );
		const trackData = {
			slug: 'neve',
			license_id: tiobDash.license,
			site: tiobDash.onboarding.homeUrl || '',
			design_choices: {
				palette: siteStyle.palette,
				typography: siteStyle.font,
			},
			step_id: 3,
			step_status: 'completed',
		};
		track( trackingId, trackData ).catch( ( error ) => {
			// eslint-disable-next-line no-console
			console.error( error );
		} );
	};

	const identityChoicesSubmit = ( skip = false ) => {
		const fieldsFilled = [];
		if ( siteName ) {
			fieldsFilled.push( 'siteName' );
		}
		if ( siteLogo ) {
			fieldsFilled.push( 'siteLogo' );
		}
		setOnboardingStep( 5 );
		const trackData = {
			slug: 'neve',
			license_id: tiobDash.license,
			site: tiobDash.onboarding.homeUrl || '',
			imported_items: general,
			fields_filled: fieldsFilled,
			step_id: 4,
			step_status: skip ? 'skip' : 'completed',
		};
		track( trackingId, trackData ).catch( ( error ) => {
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
					<div className="ob-site-settings-container">
						<div className="ob-settings-header">
							<div className="ob-settings-info">
								<p>{ __( 'Selected Template', 'templates-patterns-collection' ) }</p>
								<h3>{ siteData.title }</h3>
							</div>
							<div className="ob-settings-actions">
								<Button
									className="ob-link"
									variant="link"
									onClick={ () => {
										setOnboardingStep( 2 );
									} }
								>
									<span className="dashicons dashicons-no-alt" />
								</Button>	
							</div>
						</div>
						<div className="ob-settings-description">
							<h2>{ heading }</h2>
							<p>{ description }</p>
						</div>
						<div className="ob-settings-wrap">
							<div className="ob-settings-top">
								{ step === 3 && (
									<>
										<LogoControl
											importDataDefault={
												importDataDefault
											}
										/>
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

								{ step === 4 &&
									( canImport ? (
										<>
											<FeaturesControl />
										</>
									) : (
										<Button
											isPrimary
											className="ob-button full"
											href={
												tiobDash.onboardingUpsell
													.upgrade
											}
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
						</div>
					</div>
					<div className="ob-settings-bottom">
						{ step === 3 && (
							<Button
								disabled={ fetching }
								isPrimary
								className="ob-button full"
								onClick={ designChoicesSubmit }
							>
								{ __(
									'Continue',
									'templates-patterns-collection'
								) }
							</Button>
						) }
						{ step === 4 &&
							( canImport ? (
								<>
									<Button
										isPrimary
										className="ob-button full"
										onClick={ () =>{
												setSkipSuggestions( false );
												setOpenConfirmationModal( true );
											}
										}
										disabled={ fetching }
									>
										{ __(
											'Import Website',
											'templates-patterns-collection'
										) }
									</Button>
									<ConfirmDialog
										isOpen={openConfirmationModal}
										onConfirm={() => {
											identityChoicesSubmit( skipSuggestions );
										}}
										onCancel={() => {
											setOpenConfirmationModal(false);
										}}
										confirmButtonText={__('Start Import', 'templates-patterns-collection')}
										cancelButtonText={__('Cancel', 'templates-patterns-collection')}
									>
										<h2 className="ob-modal-confirm-title">{ __( 'Start Import?', 'templates-patterns-collection' ) }</h2>
										<p>{ __( 'This will override theme settings and add content to your current site.', 'templates-patterns-collection' ) }</p>
									</ConfirmDialog>
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
							) ) 
						}
						<Button
							className="ob-link"
							variant="link"
							onClick={ () => {
								if ( step === 4 ) {
									setOnboardingStep( 3 );
									return;
								}
								setOnboardingStep( 2 );
							} }
						>
							{ __(
								'Go back',
								'templates-patterns-collection'
							) }
						</Button>
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
			getCurrentStep,
		} = select( 'ti-onboarding' );
		return {
			fetching: getFetching(),
			siteData: getCurrentSite(),
			currentCustomizations: getUserCustomSettings(),
			trackingId: getTrackingId(),
			step: getCurrentStep(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setOnboardingStep } = dispatch( 'ti-onboarding' );
		return {
			setOnboardingStep,
		};
	} )
)( SiteSettings );
