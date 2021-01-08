/* global tiobDash, localStorage */
import apiFetch from '@wordpress/api-fetch';

import { stringifyUrl } from 'query-string';
import { v4 as uuidv4 } from 'uuid';

export const fetchLibrary = async (
	premade = false,
	additionalParams = {}
) => {
	const url = stringifyUrl( {
		url: tiobDash.endpoint + ( premade ? 'page-templates' : 'templates' ),
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
			...tiobDash.params,
			...additionalParams,
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
				return { success: false, message: templates.message };
			}

			const total = response.headers.get( 'x-wp-totalpages' );
			return {
				success: true,
				total,
				templates,
			};
		}
	} catch ( error ) {
		if ( error.message ) {
			return { success: false, message: error.message };
		}
	}
};

export const updateTemplate = async ( id, name ) => {
	const url = stringifyUrl( {
		url: tiobDash.endpoint + 'templates/' + id,
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
			...tiobDash.params,
			template_id: id,
			template_name: name,
		},
	} );

	try {
		await apiFetch( {
			url,
			method: 'POST',
		} );
		localStorage.setItem( 'tpcCacheBuster', uuidv4() );

		return { success: true };
	} catch ( error ) {
		if ( error.message ) {
			return { success: false, message: error.message };
		}
	}
};

export const duplicateTemplate = async ( id ) => {
	const url = stringifyUrl( {
		url: `${ tiobDash.endpoint }templates/${ id }/clone`,
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
			...tiobDash.params,
		},
	} );

	try {
		await apiFetch( {
			url,
			method: 'POST',
		} );
		localStorage.setItem( 'tpcCacheBuster', uuidv4() );

		return { success: true };
	} catch ( error ) {
		if ( error.message ) {
			return { successs: false, message: error.message };
		}
	}
};

export const deleteTemplate = async ( id ) => {
	const url = stringifyUrl( {
		url: `${ tiobDash.endpoint }templates/${ id }`,
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
			_method: 'DELETE',
			...tiobDash.params,
		},
	} );

	try {
		await apiFetch( { url, method: 'POST' } );
		localStorage.setItem( 'tpcCacheBuster', uuidv4() );

		return { success: true };
	} catch ( error ) {
		if ( error.message ) {
			return { success: false, message: error.message };
		}
	}
};

export const fetchBulkData = async ( templates ) => {
	const url = stringifyUrl( {
		url: `${ tiobDash.endpoint }templates/bulk-import`,
		query: {
			templates,
			cache: localStorage.getItem( 'tpcCacheBuster' ),
			...tiobDash.params,
		},
	} );

	try {
		const response = await apiFetch( { url, method: 'GET', parse: false } );

		if ( response.ok ) {
			if ( response.message ) {
				return { success: false, message: response.message };
			}
			const data = await response.json();

			if ( data.message ) {
				return { success: false, message: data.message };
			}

			return { success: true, templates: data };
		}
	} catch ( error ) {
		if ( error.message ) {
			return { success: false, message: error.message };
		}
	}
};

export const getUserTemplateData = async ( template ) => {
	const url = stringifyUrl( {
		url: `${ tiobDash.endpoint }templates/${ template }/import`,
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
			...tiobDash.params,
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
				return { success: false, message: content.message };
			}
		}
	} catch ( error ) {
		if ( error.message ) {
			return { success: false, message: error.message };
		}
	}

	return { success: true, templates: [ content ] };
};
