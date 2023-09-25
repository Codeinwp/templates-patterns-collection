/* global tiobDash */
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { track } from '../utils/rest';

const StarterSiteCard = ( {
	data,
	setSite,
	handleNextStep,
	trackingId,
	editor,
} ) => {
	const { upsell, screenshot, title, category, query } = data;

	const launchPreview = () => {
		setSite();
		handleNextStep();
		const trackData = {
			slug: 'neve',
			license_id: tiobDash.license,
			site: tiobDash.onboarding.homeUrl || '',
			step_id: 2,
			step_status: 'completed',
			selected_template: title,
			editor,
			search: query,
			cat: category,
		};
		track( trackingId, trackData ).catch( ( error ) => {
			// eslint-disable-next-line no-console
			console.error( error );
		} );
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

export default compose(
	withSelect( ( select ) => {
		const {
			getTrackingId,
			getCurrentEditor,
			getCurrentCategory,
			getSearchQuery,
		} = select( 'ti-onboarding' );
		return {
			trackingId: getTrackingId(),
			editor: getCurrentEditor(),
			category: getCurrentCategory(),
			query: getSearchQuery(),
		};
	} ),
	withDispatch( ( dispatch, { data } ) => {
		const { setCurrentSite, setOnboardingStep } = dispatch(
			'ti-onboarding'
		);
		return {
			setSite: () => setCurrentSite( data ),
			handleNextStep: () => setOnboardingStep( 3 ),
		};
	} )
)( StarterSiteCard );
