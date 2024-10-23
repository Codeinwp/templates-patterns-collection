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
		const acceptedTiers = [
			6, 17, 23, 5, 9, 14, 20, 1, 7, 12, 18, 3, 8, 13, 19,
		];

		return (
			state.license &&
			state.license.tier &&
			acceptedTiers.includes( state.license.tier )
		);
	},
	getUserCustomSettings: ( state ) => state.userCustomSettings,
	getTrackingId: ( state ) => state.trackingId,
	getRefresh: ( state ) => state.refresh,
};
