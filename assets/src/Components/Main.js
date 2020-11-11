import InstallModal from './InstallModal';
import Migration from './Migration';
import Library from './Library';
import Header from './Header';
import OnboardingContent from './OnboardingContent';

import { Fragment } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';

const Onboarding = ( { getSites, installModal, currentTab } ) => {
	const { migration } = getSites;

	return (
		<Fragment>
			<div className="ob">
				{ migration && <Migration data={ migration } /> }
				<Header />

				<div className="ob-body">
					{ 'starterSites' === currentTab && <OnboardingContent /> }
					{ 'library' === currentTab && <Library /> }
					{ 'pageTemplates' === currentTab && (
						<Library isGeneral={ true } />
					) }
				</div>
			</div>
			{ installModal && <InstallModal /> }
		</Fragment>
	);
};

export default compose(
	withDispatch( ( dispatch ) => {
		const {
			setOnboardingState,
			setCurrentCategory,
			setCurrentTab,
		} = dispatch( 'neve-onboarding' );
		return {
			cancelOnboarding: () => {
				setOnboardingState( false );
			},
			resetCategory: () => {
				setCurrentCategory( 'all' );
			},
			setCurrentTab,
		};
	} ),
	withSelect( ( select ) => {
		const {
			getCurrentEditor,
			getCurrentCategory,
			getPreviewStatus,
			getCurrentSite,
			getImportModalStatus,
			getOnboardingStatus,
			getSites,
			getInstallModalStatus,
			getCurrentTab,
		} = select( 'neve-onboarding' );
		return {
			editor: getCurrentEditor(),
			category: getCurrentCategory(),
			previewOpen: getPreviewStatus(),
			currentSiteData: getCurrentSite(),
			importModal: getImportModalStatus(),
			installModal: getInstallModalStatus(),
			isOnboarding: getOnboardingStatus(),
			getSites: getSites(),
			currentTab: getCurrentTab(),
		};
	} )
)( Onboarding );
