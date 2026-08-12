import { isTemplatesCloudTier } from '../../../shared/utils';

export default {
	getThemeAction: ( state ) => state.themeAction,
	getCurrentStep: ( state ) => state.onboardingStep,
	getSites: ( state ) => state.sites,
	getCurrentEditor: ( state ) => state.editor,
	getCurrentCategory: ( state ) => state.category,
	getFetching: ( state ) => state.fetching,
	getSearchQuery: ( state ) => state.searchQuery,
	getCurrentSite: ( state ) => state.currentSite,
	getImportData: ( state ) => state.importData,
	getError: ( state ) => state.error,
	getPluginOptions: ( state ) => state.pluginOptions,
	getUserStatus: ( state ) => {
		return (
			state.license &&
			state.license.tier &&
			isTemplatesCloudTier( state.license.tier )
		);
	},
	getUserCustomSettings: ( state ) => state.userCustomSettings,
	getTrackingId: ( state ) => state.trackingId,
	getRefresh: ( state ) => state.refresh,
	getSortBy: ( state ) => state.sortBy,
	getRankedOrder: ( state ) => state.rankedOrder,
	getSearchOrder: ( state ) => state.searchOrder,
	getSearchFailed: ( state ) => state.searchFailed,
	getSelectedColors: ( state ) => state.selectedColors,
};
