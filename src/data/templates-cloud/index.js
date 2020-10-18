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

const { updateLibrary } = dispatch( 'tpc/block-editor' );

const { createNotice } = dispatch( 'core/notices' );

const createErrorNotice = message => {
	createNotice(
		'warning',
		message,
		{
			context: 'themeisle-blocks/notices/templates-cloud',
			isDismissible: true
		}
	);
};

export const fetchTemplates = async( params = {
	'per_page': 10,
	page: 0
}) => {
	const url = stringifyUrl({
		url: tiTpc.endpoint,
		query: {
			cache: window.localStorage.getItem( 'tpcCacheBuster' ),
			...window.tiTpc.params,
			...params
		}
	});

	try {
		const response = await apiFetch({
			url,
			method: 'GET',
			parse: false
		});

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

export const updateTemplate = async( params ) => {
	const url = stringifyUrl({
		url: tiTpc.endpoint + params.template_id,
		query: {
			cache: window.localStorage.getItem( 'tpcCacheBuster' ),
			...window.tiTpc.params,
			...params
		}
	});

	try {
		const response = await apiFetch({
			url,
			method: 'POST',
			data: params,
			parse: false
		});

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

export const importTemplate = async template => {
	const url = stringifyUrl({
		url: tiTpc.endpoint + template + '/import',
		query: {
			cache: window.localStorage.getItem( 'tpcCacheBuster' ),
			...window.tiTpc.params
		}
	});

	let content = {};

	try {
		const response = await apiFetch({
			url,
			method: 'GET',
			parse: false
		});

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

export const duplicateTemplate = async template => {
	const url = stringifyUrl({
		url: tiTpc.endpoint + template + '/clone',
		query: {
			cache: window.localStorage.getItem( 'tpcCacheBuster' ),
			...window.tiTpc.params
		}
	});

	try {
		const response = await apiFetch({
			url,
			method: 'POST',
			parse: false
		});

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


export const deleteTemplate = async template => {
	const url = stringifyUrl({
		url: tiTpc.endpoint + template,
		query: {
			cache: window.localStorage.getItem( 'tpcCacheBuster' ),
			_method: 'DELETE',
			...window.tiTpc.params
		}
	});

	try {
		const response = await apiFetch({ url, method: 'POST' });

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
