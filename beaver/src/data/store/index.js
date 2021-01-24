import { registerStore } from '@wordpress/data';

const DEFAULT_STATE = {
	isFetching: true,
	isPreview: false,
	tab:
		parseInt( window.tiTpc ? window.tiTpc.tier : 0 ) === 3
			? 'library'
			: 'templates',
	templates: {
		items: [],
		currentPage: 0,
		totalPages: 0,
	},
	library: {
		items: [],
		currentPage: 0,
		totalPages: 0,
	},
	preview: {},
};

registerStore( 'tpc/beaver', {
	reducer( state = DEFAULT_STATE, action ) {
		if ( 'SET_FETCHING' === action.type ) {
			return {
				...state,
				isFetching: action.isFetching,
			};
		}

		if ( 'TOGGLE_PREVIEW' === action.type ) {
			return {
				...state,
				isPreview: ! state.isPreview,
			};
		}

		if ( 'UPDATE_CURRENT_TAB' === action.type ) {
			return {
				...state,
				tab: action.tab,
			};
		}

		if ( 'UPDATE_TEMPLATES' === action.type ) {
			return {
				...state,
				templates: {
					items: action.items,
					currentPage: Number( action.currentPage ),
					totalPages: Number( action.totalPages ),
				},
			};
		}

		if ( 'UPDATE_LIBRARY' === action.type ) {
			return {
				...state,
				library: {
					items: action.items,
					currentPage: Number( action.currentPage ),
					totalPages: Number( action.totalPages ),
				},
			};
		}

		if ( 'SET_PREVIEW_DATA' === action.type ) {
			return {
				...state,
				preview: action.preview,
			};
		}

		return state;
	},

	selectors: {
		isFetching( state ) {
			return state.isFetching;
		},

		isPreview( state ) {
			return state.isPreview;
		},

		getCurrentTab( state ) {
			return state.tab;
		},

		getTemplates( state ) {
			return state.templates;
		},

		getLibrary( state ) {
			return state.library;
		},

		getPreview( state ) {
			return state.preview;
		},
	},

	actions: {
		setFetching( isFetching ) {
			return {
				type: 'SET_FETCHING',
				isFetching,
			};
		},

		togglePreview( isPreview ) {
			return {
				type: 'TOGGLE_PREVIEW',
				isPreview,
			};
		},

		updateCurrentTab( tab ) {
			return {
				type: 'UPDATE_CURRENT_TAB',
				tab,
			};
		},

		updateTemplates( items, currentPage, totalPages ) {
			return {
				type: 'UPDATE_TEMPLATES',
				items,
				currentPage,
				totalPages,
			};
		},

		updateLibrary( items, currentPage, totalPages ) {
			return {
				type: 'UPDATE_LIBRARY',
				items,
				currentPage,
				totalPages,
			};
		},

		setPreviewData( preview ) {
			return {
				type: 'SET_PREVIEW_DATA',
				preview,
			};
		},
	},
} );
