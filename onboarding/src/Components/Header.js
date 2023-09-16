/* global tiobDash */
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import SVG from '../utils/svg';
import { ajaxAction, track } from '../utils/rest';

const Header = ( { handleLogoClick, importing, step, trackingId } ) => {
	const { brandedTheme } = tiobDash;

	const handleExit = () => {
		const data = {
			slug: 'neve',
			license_id: tiobDash.license,
			site: tiobDash.onboarding.homeUrl || '',
			step_id: step,
			step_status: 'exit',
		};
		const site = tiobDash.onboarding.homeUrl || '';

		const trackingPromise = track( trackingId, data );

		let finishImportPromise;
		if ( step === 5 ) {
			finishImportPromise = ajaxAction(
				tiobDash.onboardingDone.ajaxURL,
				'mark_onboarding_done',
				tiobDash.onboardingDone.nonce
			);
		}

		Promise.all( [ trackingPromise, finishImportPromise ] )
			.catch( ( error ) => {
				// eslint-disable-next-line no-console
				console.error( error );
			} )
			.finally( () => {
				window.location.href = site + '/wp-admin';
			} );
	};

	return (
		<div className="ob-header">
			<Button
				onClick={ handleLogoClick }
				disabled={ importing }
				style={ { opacity: 1 } }
			>
				{ ! brandedTheme ? (
					SVG.logo
				) : (
					<h2 style={ { margin: 0 } }>
						{ __(
							'Import Templates',
							'templates-patterns-collection'
						) }
					</h2>
				) }
			</Button>
			<Button
				label={ __(
					'Exit to dashboard',
					'templates-patterns-collection'
				) }
				isLink
				disabled={ importing }
				onClick={ handleExit }
			>
				{ SVG.close }
			</Button>
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getCurrentStep, getTrackingId } = select( 'ti-onboarding' );
		return {
			step: getCurrentStep(),
			trackingId: getTrackingId(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setOnboardingStep } = dispatch( 'ti-onboarding' );
		return {
			handleLogoClick: () => {
				setOnboardingStep( 1 );
			},
		};
	} )
)( Header );
