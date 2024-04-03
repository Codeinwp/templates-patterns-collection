/* global localStorage, lodash, FLBuilder */
import { stringifyUrl } from 'query-string';
import { v4 as uuidv4 } from 'uuid';

import apiFetch from '@wordpress/api-fetch';
import { dispatch, select } from '@wordpress/data';

const dispatchNotification = ( message ) => FLBuilder.alert( message );

const { setFetching } = dispatch( 'tpc/beaver' );

export const fetchTemplates = async ( additionalParams = {} ) => {
	const { isScroll, ...filteredAdditionalParams } = additionalParams;
	const params = {
		cache: localStorage.getItem( 'tpcCacheBuster' ),
		...window.tiTpc.params,
		per_page: 20,
		page: 0,
		premade: true,
		template_site_slug: 'general',
		...filteredAdditionalParams,
	};

	const url = stringifyUrl( {
		url: window.tiTpc.endpoint + 'page-templates',
		query: params,
	} );

	try {
		setFetching( true );
		const response = await apiFetch( {
			url,
			method: 'GET',
			parse: false,
		} );
		setFetching( false );

		if ( response.ok ) {
			const templates = await response.json();

			if ( templates.message ) {
				return dispatchNotification( templates.message );
			}

			let items = templates;

			if ( additionalParams.isScroll ) {
				const library = select( 'tpc/beaver' ).getTemplates();
				items = [ ...library.items, ...templates ];
			}

			const totalPages = response.headers.get( 'x-wp-totalpages' );
			const currentPage = params.page;

			dispatch( 'tpc/beaver' ).updateTemplates(
				items,
				currentPage,
				totalPages
			);
		}
	} catch ( error ) {
		if ( error.message ) {
			dispatchNotification( error.message );
		}
	}
};

export const fetchLibrary = async ( additionalParams = {} ) => {
	const { isScroll, ...filteredAdditionalParams } = additionalParams;
	const params = {
		per_page: 20,
		page: 0,
		...filteredAdditionalParams,
	};

	const url = stringifyUrl( {
		url: window.tiTpc.endpoint + 'templates',
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
			...window.tiTpc.params,
			...params,
		},
	} );

	try {
		setFetching( true );
		const response = await apiFetch( {
			url,
			method: 'GET',
			parse: false,
		} );
		setFetching( false );

		if ( response.ok ) {
			const templates = await response.json();

			if ( templates.message ) {
				return dispatchNotification( templates.message );
			}

			let items = templates;

			if ( additionalParams.isScroll ) {
				const library = select( 'tpc/beaver' ).getLibrary();
				items = [ ...library.items, ...templates ];
			}

			const totalPages = response.headers.get( 'x-wp-totalpages' );
			const currentPage = params.page;

			dispatch( 'tpc/beaver' ).updateLibrary(
				items,
				currentPage,
				totalPages
			);
		}
	} catch ( error ) {
		if ( error.message ) {
			dispatchNotification( error.message );
		}
	}
};

export const importTemplate = async ( template ) => {
	const url = stringifyUrl( {
		url: `${ window.tiTpc.endpoint }templates/${ template }/import`,
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
			...window.tiTpc.params,
		},
	} );

	let content = {};

	try {
		const response = await apiFetch( {
			url,
			method: 'GET',
			parse: false,
		} );

		if ( response.ok ) {
			content = await response.json();

			if ( content.message ) {
				return dispatchNotification( content.message );
			}
		}
	} catch ( error ) {
		if ( error.message ) {
			dispatchNotification( error.message );
		}
	}

	return content;
};

export const updateTemplate = async ( params ) => {
	const url = stringifyUrl( {
		url: `${ window.tiTpc.endpoint }templates/${ params.template_id }`,
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
			...window.tiTpc.params,
			...params,
		},
	} );

	try {
		const response = await apiFetch( {
			url,
			method: 'POST',
			parse: false,
		} );

		if ( response.ok ) {
			const content = await response.json();

			if ( content.message ) {
				return dispatchNotification( content.message );
			}
		}

		localStorage.setItem( 'tpcCacheBuster', uuidv4() );

		await fetchLibrary();
	} catch ( error ) {
		if ( error.message ) {
			dispatchNotification( error.message );
		}
	}
};

export const deleteTemplate = async ( template ) => {
	const url = stringifyUrl( {
		url: `${ window.tiTpc.endpoint }templates/${ template }`,
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
			_method: 'DELETE',
			...window.tiTpc.params,
		},
	} );

	try {
		const response = await apiFetch( { url, method: 'POST' } );

		if ( response.ok ) {
			const content = await response.json();

			if ( content.message ) {
				return dispatchNotification( content.message );
			}
		}

		localStorage.setItem( 'tpcCacheBuster', uuidv4() );

		await fetchLibrary();
	} catch ( error ) {
		if ( error.message ) {
			dispatchNotification( error.message );
		}
	}
};
