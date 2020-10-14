/**
 * WordPress dependencies
 */
const { registerStore } = wp.data;

const DEFAULT_STATE = {
	isFetching: true,
	tab: 'templates',
	templates: [],
	patterns: [],
	library: []
};

registerStore( 'tpc/block-editor', {
	reducer( state = DEFAULT_STATE, action ) {
		if ( 'SET_FETCHING' === action.type ) {
			return {
				...state,
				isFetching: action.isFetching
			};
		}

		if ( 'UPDATE_CURRENT_TAB' === action.type ) {
			return {
				...state,
				tab: action.tab
			};
		}

		if ( 'UPDATE_LIBRARY' === action.type ) {
			return {
				...state,
				library: action.library
			};
		}

		return state;
	},

	selectors: {
		isFetching( state ) {
			return state.isFetching;
		},

		getCurrentTab( state ) {
			return state.tab;
		},

		getTemplates( state ) {
			if ( 'templates' === state.tab ) {
				return state.templates;
			}

			if ( 'patterns' === state.tab ) {
				return state.patterns;
			}

			if ( 'library' === state.tab ) {
				return state.library;
			}
		}
	},

	actions: {
		setFetching( isFetching ) {
			return {
				type: 'SET_FETCHING',
				isFetching
			};
		},

		updateCurrentTab( tab ) {
			return {
				type: 'UPDATE_CURRENT_TAB',
				tab
			};
		},

		updateLibrary( library ) {
			return {
				type: 'UPDATE_LIBRARY',
				library
			};
		}
	}
});
