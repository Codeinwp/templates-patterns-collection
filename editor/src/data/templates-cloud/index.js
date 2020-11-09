import { stringifyUrl } from 'query-string';
import { v4 as uuidv4 } from 'uuid';

import apiFetch from '@wordpress/api-fetch';
import { dispatch } from '@wordpress/data';

const { updateLibrary, updateTemplates } = dispatch( 'tpc/block-editor' );
const { createNotice } = dispatch( 'core/notices' );

const createErrorNotice = ( message ) => {
	createNotice( 'warning', message, {
		context: 'themeisle-blocks/notices/templates-cloud',
		isDismissible: true,
	} );
};

export const fetchTemplates = async ( additionalParams = {} ) => {
	const params = {
		per_page: 12,
		page: 0,
		premade: true,
		template_site_slug: 'general',
		...additionalParams,
	};

	const url = stringifyUrl( {
		url: window.tiTpc.endpoint,
		query: {
			cache: window.localStorage.getItem( 'tpcCacheBuster' ),
			...window.tiTpc.params,
			...params,
		},
	} );

	try {
		const response = await apiFetch( {
			url,
			method: 'GET',
			parse: false,
		} );

		if ( response.ok ) {
			const templates = await response.json();

			if ( templates.message ) {
				return createErrorNotice( templates.message );
			}
			const totalPages = response.headers.get( 'x-wp-totalpages' );
			const currentPage = params.page;
			updateTemplates( templates, currentPage, totalPages );
		}
	} catch ( error ) {
		if ( error.message ) {
			createErrorNotice( error.message );
		}
	}
};

export const fetchLibrary = async ( additionalParams = {} ) => {
	const params = {
		per_page: 12,
		page: 0,
		...additionalParams,
	};

	const url = stringifyUrl( {
		url: window.tiTpc.endpoint,
		query: {
			cache: window.localStorage.getItem( 'tpcCacheBuster' ),
			...window.tiTpc.params,
			...params,
		},
	} );

	try {
		const response = await apiFetch( {
			url,
			method: 'GET',
			parse: false,
		} );

		if ( response.ok ) {
			const templates = await response.json();

			if ( templates.message ) {
				return createErrorNotice( templates.message );
			}

			const totalPages = response.headers.get( 'x-wp-totalpages' );
			const currentPage = params.page;

			updateLibrary( templates, currentPage, totalPages );
		}
	} catch ( error ) {
		if ( error.message ) {
			createErrorNotice( error.message );
		}
	}
};

export const updateTemplate = async ( params ) => {
	const url = stringifyUrl( {
		url: window.tiTpc.endpoint + params.template_id,
		query: {
			cache: window.localStorage.getItem( 'tpcCacheBuster' ),
			...window.tiTpc.params,
			...params,
		},
	} );

	try {
		const response = await apiFetch( {
			url,
			method: 'POST',
			data: params,
			parse: false,
		} );

		if ( response.ok ) {
			const content = await response.json();

			if ( content.message ) {
				return createErrorNotice( content.message );
			}
		}

		window.localStorage.setItem( 'tpcCacheBuster', uuidv4() );

		await fetchTemplates();
	} catch ( error ) {
		if ( error.message ) {
			createErrorNotice( error.message );
		}
	}
};

export const importTemplate = async ( template ) => {
	const url = stringifyUrl( {
		url: window.tiTpc.endpoint + template + '/import',
		query: {
			cache: window.localStorage.getItem( 'tpcCacheBuster' ),
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
				return createErrorNotice( content.message );
			}
		}
	} catch ( error ) {
		if ( error.message ) {
			createErrorNotice( error.message );
		}
	}

	return content;
};

export const duplicateTemplate = async ( template ) => {
	const url = stringifyUrl( {
		url: window.tiTpc.endpoint + template + '/clone',
		query: {
			cache: window.localStorage.getItem( 'tpcCacheBuster' ),
			...window.tiTpc.params,
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
				return createErrorNotice( content.message );
			}
		}

		window.localStorage.setItem( 'tpcCacheBuster', uuidv4() );

		await fetchTemplates();
	} catch ( error ) {
		if ( error.message ) {
			createErrorNotice( error.message );
		}
	}
};

export const deleteTemplate = async ( template ) => {
	const url = stringifyUrl( {
		url: window.tiTpc.endpoint + template,
		query: {
			cache: window.localStorage.getItem( 'tpcCacheBuster' ),
			_method: 'DELETE',
			...window.tiTpc.params,
		},
	} );

	try {
		const response = await apiFetch( { url, method: 'POST' } );

		if ( response.ok ) {
			const content = await response.json();

			if ( content.message ) {
				return createErrorNotice( content.message );
			}
		}

		window.localStorage.setItem( 'tpcCacheBuster', uuidv4() );

		await fetchTemplates();
	} catch ( error ) {
		if ( error.message ) {
			createErrorNotice( error.message );
		}
	}
};

export const publishTemplate = async (
	template,
	siteSlug,
	featuredImageURL,
	publishStatus
) => {
	const url = stringifyUrl( {
		url: window.tiTpc.endpoint + template + '/publish',
		query: {
			cache: window.localStorage.getItem( 'tpcCacheBuster' ),
			method: 'POST',
			template_site_slug: siteSlug,
			template_thumbnail: featuredImageURL,
			premade: publishStatus ? 'yes' : 'no',
			...window.tiTpc.params,
		},
	} );

	try {
		const response = await apiFetch( { url, method: 'POST' } );
		if ( response.ok ) {
			const content = await response.json();
			if ( content.message ) {
				createErrorNotice( content.message );
				return { success: false };
			}
		} else if ( response.message ) {
			createErrorNotice( response.message );
			return { success: false };
		}

		window.localStorage.setItem( 'tpcCacheBuster', uuidv4() );

		await fetchTemplates();
		await fetchLibrary();

		return { success: true };
	} catch ( error ) {
		if ( error.message ) {
			createErrorNotice( error.message );
			return { success: false };
		}
	}
};
