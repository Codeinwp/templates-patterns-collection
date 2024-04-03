/* global tiobDash */
const { onboarding } = tiobDash;
import { get, send } from './rest';
import { __ } from '@wordpress/i18n';

export const importWidgets = ( data ) => {
	return send( onboarding.root + '/import_widgets', data );
};

export const importMods = ( data ) => {
	return send( onboarding.root + '/import_theme_mods', data );
};

export const cleanupImport = ( data ) => {
	return send( onboarding.root + '/cleanup', data );
};

export const installPlugins = ( pluginArray ) => {
	return send( onboarding.root + '/install_plugins', pluginArray );
};

export const importContent = ( data ) => {
	return send( onboarding.root + '/import_content', data );
};

export const importTemplates = async ( data ) => {
	const plugins = {};

	data.forEach( ( template ) => {
		if ( 'elementor' === template.template_type ) {
			plugins.elementor = true;
		} else if ( 'beaver' === template.template_type ) {
			plugins[ 'beaver-builder-lite-version' ] = true;
		}
	} );

	if ( Object.keys( plugins ).length > 0 ) {
		try {
			await installPlugins( plugins );
		} catch ( e ) {
			return e;
		}
	}

	return send( onboarding.root + '/import_single_templates', data );
};

/**
 * Import FSE templates.
 *
 * @param {Object[]} data Array of templates to import.
 *
 * @return {Promise} Promise resolving to the import results.
 */
export const importFseTemplate = async ( data ) => {
	const url = tiobDash.siteUrl + 'wp-json/wp/v2/templates';
	const requests = data.map( async ( template ) => {
		const requestData = {
			slug: 'wp-custom-template-' + template.template_id,
			status: 'publish',
			title: template.template_name,
			content: template.content,
		};

		try {
			const response = await send( url, requestData, true );
			return {
				success: true,
				message: __(
					'Import successful',
					'templates-patterns-collection'
				),
				response,
			};
		} catch ( fseError ) {
			return {
				success: false,
				message: fseError.message,
				error: fseError,
			};
		}
	} );

	try {
		// Wait for all requests to complete before moving on
		const results = await Promise.all( requests );

		// Check if any request failed
		const failedRequest = results.find( ( result ) => ! result.success );

		if ( failedRequest ) {
			// If any request failed, return the first failure
			return failedRequest;
		}

		// If all requests succeeded, return success
		return {
			success: true,
			message: __(
				'All imports are successful',
				'templates-patterns-collection'
			),
			results,
		};
	} catch ( error ) {
		throw error;
	}
};

export const installTheme = (
	slug = 'neve',
	callbackSuccess,
	callbackError
) => {
	wp.updates.installTheme( {
		slug,
		success: callbackSuccess,
		error: callbackError,
	} );
};

export const activateTheme = ( themeData, callbackSuccess, callbackError ) => {
	const { themesURL } = tiobDash;
	const url = `${ themesURL }?action=activate&stylesheet=${ themeData.slug }&_wpnonce=${ themeData.nonce }`;
	get( url, true ).then( ( response ) => {
		if ( response.status !== 200 ) {
			callbackError( response );
			return false;
		}
		callbackSuccess();
	} );
};
