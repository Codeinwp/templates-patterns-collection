import { isTemplatesCloudTier } from '../../../shared/utils';

export default {
	getSites: ( state ) => state.sites,
	getMigrationData: ( state ) => state.migrationData,
	getCurrentEditor: ( state ) => state.editor,
	getCurrentCategory: ( state ) => state.category,
	getCurrentSite: ( state ) => state.currentSite,
	getPreviewStatus: ( state ) => state.previewStatus,
	getImportModalStatus: ( state ) => state.importModalStatus,
	getOnboardingStatus: ( state ) => state.isOnboarding,
	getThemeAction: ( state ) => state.themeAction,
	getInstallModalStatus: ( state ) => state.installModalStatus,
	getCurrentTab: ( state ) => state.currentTab,
	getFetching: ( state ) => state.fetching,
	getSingleImport: ( state ) => state.singleTemplateImport,
	getTemplateModal: ( state ) => state.templateModal,
	getSearchQuery: ( state ) => state.searchQuery,
	getUserStatus: ( state ) => {
		return (
			state.license &&
			state.license.tier &&
			isTemplatesCloudTier( state.license.tier )
		);
	},
	getLicense: ( state ) => {
		return state.license;
	},
};
