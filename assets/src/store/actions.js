export default {
	refreshSites( sites ) {
		return {
			type: 'REFRESH_SITES',
			payload: { sites },
		};
	},
	setCurrentEditor( editor ) {
		return {
			type: 'SET_CURRENT_EDITOR',
			payload: { editor },
		};
	},
	setCurrentCategory( category ) {
		return {
			type: 'SET_CURRENT_CATEGORY',
			payload: { category },
		};
	},
	setCurrentSite( siteData ) {
		return {
			type: 'SET_FOCUSED_SITE',
			payload: { siteData },
		};
	},
	setPreviewStatus( previewStatus ) {
		if ( previewStatus ) {
			document.body.classList.add( 'ob-overflow-off' );
		} else {
			document.body.classList.remove( 'ob-overflow-off' );
		}
		return {
			type: 'SET_PREVIEW_STATUS',
			payload: { previewStatus },
		};
	},
	setImportModalStatus( importModalStatus ) {
		if ( importModalStatus ) {
			document.body.classList.add( 'ob-overflow-off' );
		} else {
			document.body.classList.remove( 'ob-overflow-off' );
		}
		return {
			type: 'SET_IMPORT_MODAL_STATUS',
			payload: { importModalStatus },
		};
	},
	setInstallModalStatus( installModalStatus ) {
		if ( installModalStatus ) {
			document.body.classList.add( 'ob-overflow-off' );
		} else {
			document.body.classList.remove( 'ob-overflow-off' );
		}
		return {
			type: 'SET_INSTALL_MODAL_STATUS',
			payload: { installModalStatus },
		};
	},
	setOnboardingState( state ) {
		return {
			type: 'SET_ONBOARDING',
			payload: { state },
		};
	},
	setThemeAction( themeActions ) {
		return {
			type: 'SET_THEME_ACTIONS',
			payload: { themeActions },
		};
	},
	setCurrentTab( currentTab ) {
		return {
			type: 'SET_CURRENT_TAB',
			payload: { currentTab },
		};
	},
	setFetching( fetching ) {
		return {
			type: 'SET_FETCHING',
			payload: { fetching },
		};
	},
	setSingleTemplateImport( slug ) {
		return {
			type: 'SET_SINGLE_TEMPLATE_IMPORT',
			payload: { slug },
		};
	},
	setTemplateModal( data ) {
		return {
			type: 'SET_TEMPLATE_MODAL',
			payload: { data },
		};
	},
	setSearchQuery( query ) {
		return {
			type: 'SET_SEARCH_QUERY',
			payload: { query },
		};
	},
};
