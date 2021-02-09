/* global localStorage, elementor, lodash */
import { stringifyUrl } from 'query-string';
import { v4 as uuidv4 } from 'uuid';

import apiFetch from '@wordpress/api-fetch';
import { dispatch, select } from '@wordpress/data';

const { omit } = lodash;

const dispatchNotification = ( message ) =>
	elementor.notifications.showToast( { message } );

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
		const response = await apiFetch( {
			url,
			method: 'GET',
			parse: false,
		} );

		if ( response.ok ) {
			const templates = await response.json();

			if ( templates.message ) {
				return dispatchNotification( templates.message );
			}

			let items = templates;

			if ( additionalParams.isScroll ) {
				const library = select( 'tpc/elementor' ).getTemplates();
				items = [ ...library.items, ...templates ];
			}

			const totalPages = response.headers.get( 'x-wp-totalpages' );
			const currentPage = params.page;

			dispatch( 'tpc/elementor' ).updateTemplates(
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
		const response = await apiFetch( {
			url,
			method: 'GET',
			parse: false,
		} );

		if ( response.ok ) {
			const templates = await response.json();

			if ( templates.message ) {
				return dispatchNotification( templates.message );
			}

			let items = templates;

			if ( additionalParams.isScroll ) {
				const library = select( 'tpc/elementor' ).getLibrary();
				items = [ ...library.items, ...templates ];
			}

			const totalPages = response.headers.get( 'x-wp-totalpages' );
			const currentPage = params.page;

			dispatch( 'tpc/elementor' ).updateLibrary(
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
			...omit( params, 'content' ),
		},
	} );

	try {
		const obj = {
			url,
			method: 'POST',
			parse: false,
		};

		if ( params.content ) {
			const data = {
				title:
					elementor.config.initial_document.settings.settings
						.post_title || '',
				version: '0.4',
				type: 'page',
				content: params.content,
			};

			obj.data = data;
		}

		const response = await apiFetch( { ...obj } );

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

export const exportTemplate = async ( {
	title,
	type,
	content,
	callback = () => {},
} ) => {
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
				callback( res );
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

export const publishTemplate = async ( params ) => {
	const url = stringifyUrl( {
		url: `${ window.tiTpc.endpoint }templates/${ params.template_id }/publish`,
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
			method: 'POST',
			...window.tiTpc.params,
			...omit( params, 'template_id' ),
		},
	} );

	try {
		const response = await apiFetch( {
			url,
			method: 'POST',
			headers: {
				Authorization: `Bearer  ${ window.tiTpc.bearer || '' } `,
			},
		} );
		if ( response.ok ) {
			const content = await response.json();
			if ( content.message ) {
				dispatchNotification( content.message );
				return { success: false };
			}
		} else if ( response.message ) {
			dispatchNotification( response.message );
			return { success: false };
		}

		localStorage.setItem( 'tpcCacheBuster', uuidv4() );

		return { success: true };
	} catch ( error ) {
		if ( error.message ) {
			dispatchNotification( error.message );
			return { success: false };
		}
	}
};
