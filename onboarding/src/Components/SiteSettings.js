/* global tiobDash */
import { __ } from '@wordpress/i18n';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Button } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import PaletteControl from './CustomizeControls/PaletteControl';
import TypographyControl from './CustomizeControls/TypographyControl';
import SiteNameControl from './CustomizeControls/SiteNameControl';
import LogoControl from './CustomizeControls/LogoControl';
import ImportOptionsControl from './CustomizeControls/ImportOptionsControl';
import { trailingSlashIt } from '../utils/common';
import { get } from '../utils/rest';

export const SiteSettings = ( {
	handlePrevStepClick,
	isProUser,
	siteData,
} ) => {
	const [ settingsPage, setSettingsPage ] = useState( 1 );
	const { license, cleanupAllowed } = tiobDash;
	const [ error, setError ] = useState( null );
	const [ fetching, setFetching ] = useState( true );
	const [ importData, setImportData ] = useState( null );
	const [ pluginOptions, setPluginOptions ] = useState( {} );

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
		<div className="ob-site-settings">
			<Button
				className="ob-back"
				type="link"
				onClick={ () => {
					if ( settingsPage === 2 ) {
						setSettingsPage( 1 );
						return;
					}
					handlePrevStepClick();
				} }
			>
				{ __( 'Go back', 'templates-patterns-collection' ) }
			</Button>
			<div className="ob-settings-wrap">
				<div className="ob-settings-top">
					{ settingsPage === 1 && (
						<>
							<h2>
								{ __(
									'Customise design',
									'templates-patterns-collection'
								) }
							</h2>
							<p>
								{ __(
									'Customise the design of your site, such as color and typography.',
									'templates-patterns-collection'
								) }
							</p>
							<PaletteControl />
							<TypographyControl />
						</>
					) }

					{ settingsPage === 2 && isProUser && (
						<>
							<h2>
								{ __(
									'Site details',
									'templates-patterns-collection'
								) }
							</h2>
							<p>
								{ __(
									'Optionally add your business name and logo. You can change these later.',
									'templates-patterns-collection'
								) }
							</p>
							<SiteNameControl />
							<LogoControl />
							{ /*<ImportModal />*/ }
						</>
					) }
				</div>
				<div className="ob-settings-bottom">
					{ settingsPage === 1 && (
						<Button
							isPrimary
							className="ob-button full"
							onClick={ () => setSettingsPage( 2 ) }
						>
							{ __( 'Continue', 'neve' ) }
						</Button>
					) }
					{ settingsPage === 2 && (
						<ImportOptionsControl
							isCleanupAllowed={ cleanupAllowed }
							importData={ importData }
						/>
					) }
				</div>
			</div>
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getUserStatus, getCurrentSite } = select( 'ti-onboarding' );
		return {
			isProUser: getUserStatus(),
			siteData: getCurrentSite(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setOnboardingStep } = dispatch( 'ti-onboarding' );
		return {
			handlePrevStepClick: () => {
				setOnboardingStep( 2 );
			},
		};
	} )
)( SiteSettings );
