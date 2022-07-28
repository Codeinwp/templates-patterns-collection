import { Fragment } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';

import InstallModal from './InstallModal';
import Migration from './Migration';
import Library from './CloudLibrary/Library';
import ImportModal from './ImportModal';
import DemoSiteTemplatesImport from './CloudLibrary/DemoSiteTemplatesImport';
import Header from './Header';
import OnboardingContent from './OnboardingContent';

const Onboarding = ( {
	getSites,
	installModal,
	currentTab,
	singleImport,
	importModal,
	currentSiteData,
	isOnboarding,
} ) => {
	const { migration } = getSites;

	return (
		<Fragment>
			<div className="ob">
				<Header />
				<div className="ob-body">
					<div className="content-container">
						{ migration && <Migration data={ migration } /> }

						{ 'starterSites' === currentTab &&
							( singleImport ? (
								<DemoSiteTemplatesImport
									slug={ singleImport }
								/>
							) : (
								<OnboardingContent />
							) ) }
						{ 'library' === currentTab && <Library /> }
						{ 'pageTemplates' === currentTab && (
							<Library isGeneral={ true } />
						) }
					</div>
				</div>
			</div>
			{ importModal && currentSiteData && <ImportModal /> }
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
			getSingleImport,
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
			singleImport: getSingleImport(),
		};
	} )
)( Onboarding );
