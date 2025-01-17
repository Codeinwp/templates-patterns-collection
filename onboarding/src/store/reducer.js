/* global tiobDash, localStorage  */
const { onboarding, licenseTIOB } = tiobDash;

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
	category: '',
	currentSite: null,
	fetching: false,
	searchQuery: '',
	license: initialLicense,
	onboardingStep: window.location.search.includes('show=welcome') ? 1 : 2,
	userCustomSettings: {
		siteName: null,
		siteLogo: null,
	},
	importData: null,
	pluginOptions: {},
	error: null,
	trackingId: '',
	refresh: false,
};

export default ( state = initialState, action ) => {
	switch ( action.type ) {
		case 'SET_CATEGORY':
			const { category } = action.payload;
			return {
				...state,
				category,
			};
		case 'SET_ONBOARDING_STEP':
			const { step } = action.payload;
			return {
				...state,
				onboardingStep: step,
			};
		case 'SET_SEARCH_QUERY':
			const { query } = action.payload;
			return {
				...state,
				searchQuery: query,
			};
		case 'SET_FOCUSED_SITE':
			const { siteData } = action.payload;
			return {
				...state,
				currentSite: siteData,
			};
		case 'SET_IMPORT_DATA':
			const { importData } = action.payload;
			return {
				...state,
				importData,
			};
		case 'SET_PLUGIN_OPTIONS':
			const { pluginOptions } = action.payload;
			return {
				...state,
				pluginOptions,
			};
		case 'SET_ERROR':
			const { error } = action.payload;
			return {
				...state,
				error,
			};
		case 'SET_FETCHING':
			const { fetching } = action.payload;
			return {
				...state,
				fetching,
			};
		case 'SET_USER_CUSTOM_SETTINGS':
			const { userCustomSettings } = action.payload;
			return {
				...state,
				userCustomSettings,
			};
		case 'SET_CURRENT_EDITOR':
			const { editor } = action.payload;
			localStorage.setItem( 'neve-onboarding-editor', editor );
			return {
				...state,
				editor,
			};
		case 'SET_TRACKING_ID':
			const { trackingId } = action.payload;
			return {
				...state,
				trackingId,
			};
		case 'SET_REFRESH':
			const { refresh } = action.payload;
			return {
				...state,
				refresh,
			};
	}
	return state;
};
