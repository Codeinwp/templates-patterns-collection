/* global tiobDash, jQuery, ajaxurl */
/* eslint-disable no-console */

export const send = ( route, data, simple = false ) => {
	return requestData( route, simple, data );
};

export const get = ( route, simple = false, useNonce = true ) => {
	return requestData( route, simple, {}, 'GET', useNonce );
};

const requestData = async (
	route,
	simple = false,
	data = {},
	method = 'POST',
	useNonce = true
) => {
	const options = {
		method,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	};

	if ( tiobDash.params.site_url ) {
		const url = new URL( route );
		url.searchParams.append(
			'site_url',
			encodeURIComponent( tiobDash.params.site_url )
		);
		route = url;
	}

	if ( useNonce ) {
		options.headers[ 'x-wp-nonce' ] = tiobDash.nonce;
	}

	if ( 'POST' === method ) {
		options.body = JSON.stringify( data );
	}

	return await fetch( route, options ).then( ( response ) => {
		return simple ? response : response.json();
	} );
};

export const ajaxAction = async (
	route,
	action = '',
	useNonce = '',
	data = {}
) => {
	const formData = new FormData();
	formData.append( 'nonce', useNonce );
	formData.append( 'action', action );
	if ( Object.keys( data ).length > 0 ) {
		for ( const [ key, value ] of Object.entries( data ) ) {
			formData.append( key, value );
		}
	}
	const options = {
		method: 'POST',
		headers: {
			Accept: 'application/json',
		},
		body: formData,
	};

	return await fetch( route, options ).then( () => {
		return true;
	} );
};

export const track = async ( trackingId = '', data ) => {
	try {
		const response = await fetch(
			'https://api.themeisle.com/tracking/onboarding',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( {
					_id: trackingId,
					data,
				} ),
			}
		);

		if ( ! response.ok ) {
			console.error( `HTTP error! Status: ${ response.status }` );
			return false;
		}

		const jsonResponse = await response.json();

		const validCodes = [ 'success', 'invalid' ]; // Add valid codes to this array
		if ( ! validCodes.includes( jsonResponse.code ) ) {
			return false;
		}

		if ( jsonResponse.code === 'invalid' ) {
			console.error( jsonResponse.message );
			return false;
		}
		const responseData = jsonResponse.data;

		return responseData.id || false;
	} catch ( error ) {
		console.error( error );
		return false;
	}
};

/**
 * Get logs from server using ajax.
 *
 * @param {Object} args - ajax arguments
 */
export const getLogsFromServer = ( args ) => {
	jQuery.ajax( {
		type: 'post',
		url: ajaxurl,
		data: {
			action: 'tpc_get_logs',
			nonce: tiobDash.nonce,
		},
		...args,
	} );
};
