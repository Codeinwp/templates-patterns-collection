/* global localStorage, tiTpc */
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
		cache: localStorage.getItem( 'tpcCacheBuster' ),
		...tiTpc.params,
		per_page: 12,
		page: 0,
		premade: true,
		template_site_slug: 'general',
		...additionalParams,
	};

	const url = stringifyUrl( {
		url: tiTpc.endpoint + 'page-templates',
		query: params,
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
		url: tiTpc.endpoint + 'templates',
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
			...tiTpc.params,
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
		url: `${ tiTpc.endpoint }templates/${ params.template_id }`,
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
			...tiTpc.params,
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
				return createErrorNotice( content.message );
			}
		}

		localStorage.setItem( 'tpcCacheBuster', uuidv4() );

		await fetchTemplates();
	} catch ( error ) {
		if ( error.message ) {
			createErrorNotice( error.message );
		}
	}
};

export const importTemplate = async ( template ) => {
	const url = stringifyUrl( {
		url: `${ tiTpc.endpoint }templates/${ template }/import`,
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
			...tiTpc.params,
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
		url: `${ tiTpc.endpoint }templates/${ template }/clone`,
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
			...tiTpc.params,
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

		localStorage.setItem( 'tpcCacheBuster', uuidv4() );

		await fetchTemplates();
		await fetchLibrary();
	} catch ( error ) {
		if ( error.message ) {
			createErrorNotice( error.message );
		}
	}
};

export const deleteTemplate = async ( template, sortingOrder ) => {
	const url = stringifyUrl( {
		url: `${ tiTpc.endpoint }templates/${ template }`,
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
			_method: 'DELETE',
			...tiTpc.params,
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

		localStorage.setItem( 'tpcCacheBuster', uuidv4() );

		await fetchLibrary( sortingOrder );
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
	publishStatus,
	link
) => {
	const url = stringifyUrl( {
		url: `${ tiTpc.endpoint }templates/${ template }/publish`,
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
			method: 'POST',
			template_site_slug: siteSlug,
			template_thumbnail: featuredImageURL,
			premade: publishStatus ? 'yes' : 'no',
			link,
			...tiTpc.params,
		},
	} );

	try {
		const response = await apiFetch( {
			url,
			method: 'POST',
			headers: {
				Authorization: `Bearer  ${ tiTpc.bearer || '' } `,
			},
		} );
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

		localStorage.setItem( 'tpcCacheBuster', uuidv4() );

		return { success: true };
	} catch ( error ) {
		if ( error.message ) {
			createErrorNotice( error.message );
			return { success: false };
		}
	}
};
