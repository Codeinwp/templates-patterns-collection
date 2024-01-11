/* global tiobDash  */
const { onboarding, themeAction, licenseTIOB } = tiobDash;

const firstEditor =
	'undefined' !== typeof onboarding.sites &&
	'undefined' !== typeof onboarding.sites.sites
		? Object.keys( onboarding.sites.sites )[ 0 ]
		: 'gutenberg';
const selectedEditor =
	localStorage.getItem( 'neve-onboarding-editor' ) || firstEditor;

const initialLicense = licenseTIOB || {
	key: 'free',
	valid: 'invalid',
	expiration: '',
	tier: 0,
};

const initialState = {
	sites: onboarding.sites || {},
	editor: selectedEditor,
	category: 'all',
	previewStatus: false,
	importModalStatus: false,
	installModalStatus: false,
	currentSite: null,
	importing: false,
	isOnboarding: onboarding.onboarding || false,
	migrationData: null,
	themeAction,
	currentTab: tiobDash.hideStarterSites ? ( tiobDash.hideMyLibrary ? 'settings' : 'library' ) : 'starterSites',
	fetching: false,
	singleTemplateImport: null,
	templateModal: null,
	searchQuery: '',
	license: initialLicense,
};
export default ( state = initialState, action ) => {
	switch ( action.type ) {
		case 'REFRESH_SITES':
			const { sites } = action.payload;
			return {
				...state,
				sites,
			};
		case 'SET_CURRENT_EDITOR':
			const { editor } = action.payload;
			localStorage.setItem( 'neve-onboarding-editor', editor );
			return {
				...state,
				editor,
			};
		case 'SET_CURRENT_CATEGORY':
			const { category } = action.payload;
			return {
				...state,
				category,
			};
		case 'SET_FOCUSED_SITE':
			const { siteData } = action.payload;
			return {
				...state,
				currentSite: siteData,
			};
		case 'SET_PREVIEW_STATUS':
		const { previewStatus } = action.payload;
			return {
				...state,
				previewStatus,
			};
		case 'SET_IMPORT_MODAL_STATUS':
			const { importModalStatus } = action.payload;
			return {
				...state,
				importModalStatus,
			};
		case 'SET_INSTALL_MODAL_STATUS':
			const { installModalStatus } = action.payload;
			return {
				...state,
				installModalStatus,
			};
		case 'SET_ONBOARDING':
			const { status } = action.payload;
			return {
				...state,
				isOnboarding: status,
			};
		case 'SET_THEME_ACTIONS':
			const { themeActions } = action.payload;
			return {
				...state,
				themeAction: themeActions,
			};
		case 'SET_CURRENT_TAB':
			const { currentTab } = action.payload;
			return {
				...state,
				singleTemplateImport: null,
				currentTab,
			};
		case 'SET_FETCHING':
			const { fetching } = action.payload;
			return {
				...state,
				fetching,
			};
		case 'SET_SINGLE_TEMPLATE_IMPORT':
			const { slug } = action.payload;
			return {
				...state,
				singleTemplateImport: slug,
			};
		case 'SET_TEMPLATE_MODAL':
			const { data } = action.payload;
			return {
				...state,
				templateModal: data,
			};
		case 'SET_SEARCH_QUERY':
			const { query } = action.payload;
			return {
				...state,
				searchQuery: query,
			};
		case 'SET_LICENSE':
			const { license } = action.payload;
			return {
				...state,
				license,
			};
	}
	return state;
};
