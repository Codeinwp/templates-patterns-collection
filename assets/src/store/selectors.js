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
	getUserStatus: () => {
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
			window.tiobDash.license &&
			window.tiobDash.license.tier &&
			acceptedTiers.includes( window.tiobDash.license.tier )
		);
	},
};
