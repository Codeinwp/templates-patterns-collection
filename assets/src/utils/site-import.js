/* global tiobDash */
const { onboarding } = tiobDash;
import { send } from './rest';

export const importWidgets = ( data ) => {
	return send( onboarding.root + '/import_widgets', data );
};

export const importMods = ( data ) => {
	return send( onboarding.root + '/import_theme_mods', data );
};

export const installPlugins = ( pluginArray ) => {
	return send( onboarding.root + '/install_plugins', pluginArray );
};

export const importContent = ( data ) => {
	return send( onboarding.root + '/import_content', data );
};

export const importTemplates = async ( data ) => {
	let plugins = {};

	data.forEach( template => {
		if ( 'elementor' === template.template_type ) {
			plugins.elementor = true;
		} else if ( 'beaver' === template.template_type ) {
			plugins['beaver-builder-lite-version'] = true;
		}
	} );

	if ( Object.keys( plugins ).length > 0 ) {
		try {
			await installPlugins( plugins );
		} catch ( e ) {
			return error;
		}
	}

	return send( onboarding.root + '/import_single_templates', data );
};
