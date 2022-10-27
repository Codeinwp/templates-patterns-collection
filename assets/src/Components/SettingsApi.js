/*eslint import/no-unresolved: [2, { ignore: ['@wordpress/api'] }]*/
import { loadPromise, models } from '@wordpress/api';

export const fetchOptions = () => {
    let settings;
    return loadPromise.then(() => {
        settings = new models.Settings();
        return settings.fetch();
    });
};

export const fetchOption = ( option ) => {
    return fetchOptions().then((r) => {
        return r.hasOwnProperty(option) ? r[option] : null;
    });
}

export const changeOption = (option, value) => {
    const model = new models.Settings({
        [option]: value,
    });

    return new Promise((resolve) => {
        model.save().then((r) => {
            if (!r || !r[option] === value) {
                resolve({ success: false });
            }
            resolve({ success: true });
        });
    });
};

export const setImportType = async ( siteData ) => {
    const optionName = 'templates_patterns_collection_pro_import';
    if ( siteData.hasOwnProperty('upsell') ) {
        await changeOption( optionName, true );
        return await fetchOption( optionName );
    }
};

export const removeImportType = async () => {
    const optionName = 'templates_patterns_collection_pro_import';
    await changeOption( optionName, false );
    return await fetchOption( optionName );
};