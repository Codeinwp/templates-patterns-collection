/* global tiobDash */
import SiteSettings from '../SiteSettings';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { trailingSlashIt } from '../../utils/common';
import { get } from '../../utils/rest';

const CustomizeSite = ( {
	siteData,
	setError,
	general,
	setGeneral,
	fetching,
	setFetching,
	importData,
	setImportData,
	setPluginOptions,
	isCleanupAllowed,
} ) => {
	const { license } = tiobDash;

	useEffect( () => {
		// const fetchAddress = siteData.remote_url || siteData.url;
		// Use the line below if testing in a staging env:
		const fetchAddress = siteData.url || siteData.remote_url;
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

	return (
		<div className="ob-container row ovf-initial">
			<SiteSettings
				setImportData={ setImportData }
				general={ general }
				setGeneral={ setGeneral }
				isCleanupAllowed={ isCleanupAllowed }
				fetching={ fetching }
				importData={ importData }
			/>
			<div className="iframe-container">
				<iframe
					id="ti-ss-preview"
					className="iframe"
					title="Your Iframe"
					// src={ siteData.url }
					src="https://neve.test"
				></iframe>
			</div>
		</div>
	);
};

export default withSelect( ( select ) => {
	const { getCurrentEditor, getCurrentSite, getThemeAction } = select(
		'ti-onboarding'
	);
	return {
		editor: getCurrentEditor(),
		siteData: getCurrentSite(),
		themeData: getThemeAction() || false,
	};
} )( CustomizeSite );
