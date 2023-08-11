import { withDispatch } from '@wordpress/data';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const StarterSiteCard = ( { data, setSite, handleNextStep } ) => {
	const { upsell, screenshot, title } = data;

	const launchPreview = () => {
		setSite();
		handleNextStep();
	};

	return (
		<div className="ss-card-wrap">
			<div className="ss-card">
				{ upsell && (
					<span className="ss-badge">
						<span>
							{ __( 'PRO', 'templates-patterns-collection' ) }
						</span>
					</span>
				) }

				<div className="ss-actions">
					<Button
						isPrimary
						className="ob-button"
						onClick={ launchPreview }
					>
						{ __( 'Select', 'templates-patterns-collection' ) }
					</Button>
				</div>

				{ screenshot && (
					<div
						className="ss-image"
						style={ {
							backgroundImage: `url("${ screenshot }")`,
						} }
					/>
				) }
			</div>
			<p className="ss-title">{ title }</p>
		</div>
	);
};

export default withDispatch( ( dispatch, { data } ) => {
	const { setCurrentSite, setOnboardingStep } = dispatch( 'neve-onboarding' );
	return {
		setSite: () => setCurrentSite( data ),
		handleNextStep: () => setOnboardingStep( 3 ),
	};
} )( StarterSiteCard );
