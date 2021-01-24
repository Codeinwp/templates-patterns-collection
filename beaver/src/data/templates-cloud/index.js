/* global localStorage, lodash */
import { stringifyUrl } from 'query-string';
import { v4 as uuidv4 } from 'uuid';

import apiFetch from '@wordpress/api-fetch';
import { dispatch, select } from '@wordpress/data';

const { omit } = lodash;

const dispatchNotification = ( message ) => console.log( message );

const { setFetching } = dispatch( 'tpc/beaver' );

export const fetchTemplates = async ( additionalParams = {} ) => {
	const params = {
		cache: localStorage.getItem( 'tpcCacheBuster' ),
		...window.tiTpc.params,
		per_page: 20,
		page: 0,
		premade: true,
		template_site_slug: 'general',
		...omit( additionalParams, 'isScroll' ),
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
	const params = {
		per_page: 20,
		page: 0,
		...omit( additionalParams, 'isScroll' ),
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

export const duplicateTemplate = async ( id ) => {
	const url = stringifyUrl( {
		url: `${ window.tiTpc.endpoint }templates/${ id }/clone`,
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
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

export const exportTemplate = async ( { title, type, content } ) => {
	const data = {
		version: '0.4',
		title,
		type,
		content,
	};

	const url = stringifyUrl( {
		url: window.tiTpc.endpoint + 'templates',
		query: {
			...window.tiTpc.params,
			template_name: title || window.tiTpc.exporter.textPlaceholder,
			template_type: 'elementor',
		},
	} );

	try {
		const response = await apiFetch( {
			url,
			method: 'POST',
			data,
			parse: false,
		} );

		if ( response.ok ) {
			const res = await response.json();

			if ( res.message ) {
				dispatchNotification( res.message );
			} else {
				window.localStorage.setItem( 'tpcCacheBuster', uuidv4() );

				dispatchNotification( window.tiTpc.exporter.templateSaved );
			}
		}
	} catch ( error ) {
		if ( error.message ) {
			dispatchNotification( error.message );
		}
	}
};
