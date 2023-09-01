/* global tiobDash */
const { onboarding } = tiobDash;
import { get, send } from './rest';

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
