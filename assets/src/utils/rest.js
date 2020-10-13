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
