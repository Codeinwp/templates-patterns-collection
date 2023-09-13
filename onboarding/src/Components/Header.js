/* global tiobDash */
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import SVG from '../utils/svg';
import { track } from '../utils/rest';

const Header = ( { handleLogoClick, importing, step, trackingId } ) => {
	const { brandedTheme } = tiobDash;

	const handleExit = () => {
		const data = {
			step_id: step,
			step_status: 'exit',
		};
		const site = tiobDash.onboarding.homeUrl || '';
		track( trackingId, data )
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
