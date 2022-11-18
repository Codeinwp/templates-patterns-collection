import {createContext, useState} from '@wordpress/element';

export const LicensePanelContext = createContext( { isLicenseOpen: false, setLicenseOpen: () => {} } );