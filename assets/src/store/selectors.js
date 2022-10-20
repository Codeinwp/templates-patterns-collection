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
		const acceptedTiers = [
			6,
			17,
			23,
			5,
			9,
			14,
			20,
			1,
			7,
			12,
			18,
			3,
			8,
			13,
			19,
		];

		return (
			state.license &&
			state.license.tier &&
			acceptedTiers.includes( state.license.tier )
		);
	},
	getLicense: ( state ) => {
		return state.license;
	},
};
