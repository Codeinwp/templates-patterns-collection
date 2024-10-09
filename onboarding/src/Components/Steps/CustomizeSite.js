/* global tiobDash */
import SiteSettings from '../SiteSettings';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { trailingSlashIt } from '../../utils/common';
import { get } from '../../utils/rest';
import SitePreview from '../SitePreview';
import ImportError from '../ImportError';

const CustomizeSite = ( {
	siteData,
	setFetching,
	setImportData,
	setError,
	setPluginOptions,
	general,
	setGeneral,
	error,
} ) => {
	const [ siteStyle, setSiteStyle ] = useState( {
		palette: 'base',
		font: 'default',
	} );
	const [ importDataDefault, setImportDataDefault ] = useState( null );

	const { license } = tiobDash;

	useEffect( () => {
		const fetchAddress = siteData.remote_url || siteData.url;
		// Use the line below if testing in a staging env:
		// const fetchAddress = siteData.url || siteData.remote_url;
		const url = new URL(
			`${ trailingSlashIt( fetchAddress ) }wp-json/ti-demo-data/data`
		);
		url.searchParams.append( 'license', license ? license.key : 'free' );
		url.searchParams.append( 'ti_downloads', 'yes' );

		get( url, true, false )
			.then( ( response ) => {
				if ( ! response.ok ) {
					setError( {
						message: __(
							'Something went wrong while loading the site data. Please refresh the page and try again.',
							'templates-patterns-collection'
						),
						code: 'ti__ob_failed_fetch_response',
					} );
					setFetching( false );
				}
				response.json().then( ( result ) => {
					setImportData( { ...result, ...siteData } );
					setImportDataDefault( { ...result, ...siteData } );
					const mandatory = {
						...( result.mandatory_plugins || {} ),
					};
					const optional = {
						...( result.recommended_plugins || {} ),
					};
					const defaultOff =
						result.default_off_recommended_plugins || [];

					const tiDownloads = {
						...( result.ti_downloads || {} ),
					};

					Object.keys( mandatory ).forEach( ( key ) => {
						mandatory[ key ] = true;
					} );
					Object.keys( optional ).forEach( ( key ) => {
						optional[ key ] = ! defaultOff.includes( key );
					} );

					setPluginOptions( {
						...optional,
						...mandatory,
						...tiDownloads,
					} );

					setFetching( false );
				} );
			} )
			.catch( () => {
				setError( {
					message: __(
						'Something went wrong while loading the site data. Please refresh the page and try again.',
						'templates-patterns-collection'
					),
					code: 'ti__ob_failed_fetch_catch',
				} );
				setFetching( false );
			} );
	}, [] );

	if ( error ) {
		return (
			<div className="ob-container narrow center">
				<ImportError
					message={ error.message || null }
					code={ error.code || null }
				/>
				<hr />
			</div>
		);
	}

	return (
		<div className="ob-container row ovf-initial">
			<SiteSettings
				importDataDefault={ importDataDefault }
				siteStyle={ siteStyle }
				setSiteStyle={ setSiteStyle }
				general={ general }
				setGeneral={ setGeneral }
			/>
			<SitePreview siteStyle={ siteStyle } />
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getCurrentEditor, getCurrentSite, getThemeAction, getError } =
			select( 'ti-onboarding' );
		return {
			error: getError(),
			editor: getCurrentEditor(),
			siteData: getCurrentSite(),
			themeData: getThemeAction() || false,
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setFetching, setImportData, setPluginOptions, setError } =
			dispatch( 'ti-onboarding' );
		return {
			setFetching,
			setImportData,
			setPluginOptions,
			setError,
		};
	} )
)( CustomizeSite );
