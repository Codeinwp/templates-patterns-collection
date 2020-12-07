/* eslint-disable no-console */
/* global localStorage, */
import { stringifyUrl } from 'query-string';

import apiFetch from '@wordpress/api-fetch';
import { dispatch } from '@wordpress/data';

export const fetchTemplates = async ( additionalParams = {} ) => {
	const params = {
		cache: localStorage.getItem( 'tpcCacheBuster' ),
		...window.tiTpc.params,
		per_page: 12,
		page: 0,
		type: 'gutenberg', // Remove before commiting
		premade: true,
		template_site_slug: 'general',
		...additionalParams,
	};

	const url = stringifyUrl( {
		url: window.tiTpc.endpoint + 'page-templates',
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
				return console.log( templates.message );
			}
			const totalPages = response.headers.get( 'x-wp-totalpages' );
			const currentPage = params.page;
			dispatch( 'tpc/elementor' ).updateTemplates(
				templates,
				currentPage,
				totalPages
			);
		}
	} catch ( error ) {
		if ( error.message ) {
			console.log( error.message );
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
		url: window.tiTpc.endpoint + 'templates',
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
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
				return console.log( templates.message );
			}

			const totalPages = response.headers.get( 'x-wp-totalpages' );
			const currentPage = params.page;

			dispatch( 'tpc/elementor' ).updateLibrary(
				templates,
				currentPage,
				totalPages
			);
		}
	} catch ( error ) {
		if ( error.message ) {
			console.log( error.message );
		}
	}
};
