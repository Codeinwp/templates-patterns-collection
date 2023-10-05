export default {
	setCategory( category ) {
		return {
			type: 'SET_CATEGORY',
			payload: { category },
		};
	},
	setOnboardingStep( step ) {
		return {
			type: 'SET_ONBOARDING_STEP',
			payload: { step },
		};
	},
	setSearchQuery( query ) {
		return {
			type: 'SET_SEARCH_QUERY',
			payload: { query },
		};
	},
	setFetching( fetching ) {
		return {
			type: 'SET_FETCHING',
			payload: { fetching },
		};
	},
	setCurrentSite( siteData ) {
		return {
			type: 'SET_FOCUSED_SITE',
			payload: { siteData },
		};
	},
	setImportData( importData ) {
		return {
			type: 'SET_IMPORT_DATA',
			payload: { importData },
		};
	},
	setPluginOptions( pluginOptions ) {
		return {
			type: 'SET_PLUGIN_OPTIONS',
			payload: { pluginOptions },
		};
	},
	setError( error ) {
		return {
			type: 'SET_ERROR',
			payload: { error },
		};
	},
	setUserCustomSettings( userCustomSettings ) {
		return {
			type: 'SET_USER_CUSTOM_SETTINGS',
			payload: { userCustomSettings },
		};
	},
	setCurrentEditor( editor ) {
		return {
			type: 'SET_CURRENT_EDITOR',
			payload: { editor },
		};
	},
	setTrackingId( trackingId ) {
		return {
			type: 'SET_TRACKING_ID',
			payload: { trackingId },
		};
	},
	setRefresh( refresh ) {
		return {
			type: 'SET_REFRESH',
			payload: { refresh },
		};
	},
};
