/**
 * External dependencies
 */
import { stringifyUrl } from 'query-string';

import { v4 as uuidv4 } from 'uuid';

/**
 * WordPress dependencies
 */
const { apiFetch } = wp;

const { dispatch } = wp.data;

const {
	setFetching,
	updateLibrary
} = dispatch( 'tpc/block-editor' );

export const fetchTemplates = async( params = {
	'per_page': 10,
	page: 0
}) => {
	setFetching( true );

	const url = stringifyUrl({
		url: tiTpc.endpoint,
		query: {
			cache: window.localStorage.getItem( 'tpcCacheBuster' ),
			...window.tiTpc.params,
			...params
		}
	});

	let response;
	let templates = [];

	try {
		response = await apiFetch({
			url,
			method: 'GET',
			parse: false
		});

		if ( response.ok ) {
			templates = await response.json();
			const totalPages = response.headers.get( 'x-wp-totalpages' );
			const currentPage = params.page;
			updateLibrary( templates, currentPage, totalPages );
		}
	} catch ( error ) {
		throw new Error( error.message );
	}

	setFetching( false );
};

export const importTemplate = async template => {
	const url = stringifyUrl({
		url: tiTpc.endpoint + template + '/import',
		query: {
			cache: window.localStorage.getItem( 'tpcCacheBuster' ),
			...window.tiTpc.params
		}
	});

	let content;

	try {
		content = await apiFetch({ url, method: 'GET' });
	} catch ( error ) {
		throw new Error( error.message );
	}

	return content;
};

export const duplicateTemplate = async template => {
	setFetching( true );

	const url = stringifyUrl({
		url: tiTpc.endpoint + template + '/clone',
		query: {
			cache: window.localStorage.getItem( 'tpcCacheBuster' ),
			...window.tiTpc.params
		}
	});

	let content;

	try {
		setFetching( true );
		content = await apiFetch({ url, method: 'POST' });
		window.localStorage.setItem( 'tpcCacheBuster', uuidv4() );
		await fetchTemplates();
	} catch ( error ) {
		throw new Error( error.message );
	}

	setFetching( false );

	return content;
};


export const deleteTemplate = async template => {
	setFetching( true );

	const url = stringifyUrl({
		url: tiTpc.endpoint + template,
		query: {
			cache: window.localStorage.getItem( 'tpcCacheBuster' ),
			_method: 'DELETE',
			...window.tiTpc.params
		}
	});

	let content;

	try {
		setFetching( true );
		content = await apiFetch({ url, method: 'POST' });
		window.localStorage.setItem( 'tpcCacheBuster', uuidv4() );
		await fetchTemplates();
	} catch ( error ) {
		throw new Error( error.message );
	}

	setFetching( false );

	return content;
};
