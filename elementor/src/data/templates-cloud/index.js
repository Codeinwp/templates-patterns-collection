/* global localStorage, tiTpc, elementor, lodash */
import { stringifyUrl } from 'query-string';
import { v4 as uuidv4 } from 'uuid';

import apiFetch from '@wordpress/api-fetch';
import { dispatch, select } from '@wordpress/data';
import { cleanTemplateContent } from '../../../../shared/utils';

const dispatchNotification = ( message ) =>
	elementor.notifications.showToast( { message } );

export const fetchTemplates = async ( additionalParams = {} ) => {
	const { meta, ...filteredParams } = tiTpc.params;
	const { isScroll, ...filteredAdditionalParams } = additionalParams;
	const params = {
		cache: localStorage.getItem( 'tpcCacheBuster' ),
		...filteredParams,
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
	const { meta, ...filteredParams } = tiTpc.params;
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
			...filteredParams,
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

export const getTemplate = async ( template ) => {
	const { meta, ...filteredParams } = tiTpc.params;

	const url = stringifyUrl( {
		url: `${ window.tiTpc.endpoint }templates/${ template }`,
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
			...filteredParams,
		},
	} );

	try {
		const response = await apiFetch( {
			url,
			method: 'GET',
			parse: false,
		} );

		if ( response.ok ) {
			const content = await response.json();

			if ( content.message ) {
				return false;
			}

			return content;
		}
	} catch ( error ) {
		return false;
	}
};

/**
 * Import a template from TPC server for Elementor.
 *
 * @param {string} template The template slug.
 * @return {any} The template content.
 */
export const importTemplate = async ( template ) => {
	const { meta, ...filteredParams } = tiTpc.params;

	const url = stringifyUrl( {
		url: `${ window.tiTpc.endpoint }templates/${ template }/import`,
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
			...filteredParams,
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

	cleanTemplateContent( content, ( element ) => {
		// Remove imported images ID since they are not available on the current site via Media Library.
		delete element?.settings?.image?.id;
		delete element?.settings?.background_image?.id;
		delete element?.settings?.background_overlay_image?.id;
	} );

	return content;
};

export const duplicateTemplate = async ( id ) => {
	const { meta, ...filteredParams } = tiTpc.params;
	const url = stringifyUrl( {
		url: `${ window.tiTpc.endpoint }templates/${ id }/clone`,
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
			...filteredParams,
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
	const { meta, ...filteredParams } = tiTpc.params;
	const { content, ...filteredAdditionalParams } = params;
	const url = stringifyUrl( {
		url: `${ window.tiTpc.endpoint }templates/${ params.template_id }`,
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
			...filteredParams,
			meta: JSON.stringify( tiTpc.params.meta ),
			...filteredAdditionalParams,
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
	const { meta, ...filteredParams } = tiTpc.params;
	const url = stringifyUrl( {
		url: `${ window.tiTpc.endpoint }templates/${ template }`,
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
			_method: 'DELETE',
			...filteredParams,
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
	link = '',
	callback = () => {},
} ) => {
	const data = {
		version: '0.4',
		title,
		type,
		content,
	};

	const { meta, ...filteredParams } = window.tiTpc.params;

	const currentTemplate = elementor.documents
		.getCurrent()
		.container.settings.get( 'template' );

	if ( currentTemplate ) {
		meta._wp_page_template = currentTemplate;
	}

	const url = stringifyUrl( {
		url: window.tiTpc.endpoint + 'templates',
		query: {
			...filteredParams,
			meta: 'page' === type ? JSON.stringify( meta ) : '',
			template_name: title || window.tiTpc.exporter.textPlaceholder,
			template_type: 'elementor',
			link,
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
	const { meta, ...filteredParams } = tiTpc.params;
	const { template_id, ...filteredAdditionalParams } = params;
	const url = stringifyUrl( {
		url: `${ window.tiTpc.endpoint }templates/${ params.template_id }/publish`,
		query: {
			cache: localStorage.getItem( 'tpcCacheBuster' ),
			method: 'POST',
			...filteredParams,
			...filteredAdditionalParams,
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
