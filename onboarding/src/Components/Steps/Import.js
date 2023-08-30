/* global tiobDash */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

import {
	activateTheme,
	cleanupImport,
	importContent,
	importMods,
	importWidgets,
	installPlugins,
	installTheme,
} from '../../utils/site-import';

import ImportProgress from "../ImportProgress";
import ImportModalError from "../ImportModalError";

const Import = ( {
	general,
	themeData,
	pluginOptions,
	error,
	setError,
	importData,
	editor,
	setThemeAction,
} ) => {
	const { cleanupAllowed } = tiobDash;
	const [ currentStep, setCurrentStep ] = useState( null );
	const [ actionsDone, setActionsDone ] = useState( 0 );
	const [ importing, setImporting ] = useState( false );
	const [ cleanupProgress, setCleanupProgress ] = useState( false );
	const [ pluginsProgress, setPluginsProgress ] = useState( false );
	const [ contentProgress, setContentProgress ] = useState( false );
	const [ customizerProgress, setCustomizerProgress ] = useState( false );
	const [ widgetsProgress, setWidgetsProgress ] = useState( false );
	const [ performanceAddonProgress, setPerformanceAddonProgress ] = useState(
		false
	);
	const [ frontPageID, setFrontPageID ] = useState( null );
	const [ themeInstallProgress, setThemeInstallProgress ] = useState( false );
	const [ isCleanupAllowed, setIsCleanupAllowed ] = useState(
		cleanupAllowed
	);

	function runImportCleanup() {
		console.clear();
		if ( ! general.cleanup ) {
			console.log( '[S] Cleanup.' );
			runImport();
			return false;
		}
		setCurrentStep( 'cleanup' );
		console.log( '[P] Cleanup.' );
		cleanupImport( {} )
			.then( ( response ) => {
				if ( ! response.success ) {
					handleError( response, 'cleanup' );
					return false;
				}
				console.log( '[D] Cleanup.' );
				setActionsDone( ( prevActionsDone ) => prevActionsDone + 1 );
				setCleanupProgress( 'done' );
				runImport();
			} )
			.catch( ( incomingError ) =>
				handleError( incomingError, 'cleanup' )
			);
	}

	function runImport() {
		// console.clear();
		if ( ! themeData ) {
			console.log( '[S] Theme.' );
			runImportPlugins();
			return false;
		}
		if ( themeData.action === 'install' ) {
			setCurrentStep( 'theme_install' );
			console.log( '[P] Theme Install.' );
			handleThemeInstall();
			return false;
		}
		setCurrentStep( 'theme_install' );
		console.log( '[P] Theme Activate.' );
		handleActivate();
	}

	function handleThemeInstall() {
		const callbackSuccess = () => {
			setThemeAction( { ...themeData, action: 'activate' } );
			console.log( '[D] Theme Install.' );
			handleActivate();
		};

		const callbackError = ( err ) => {
			setThemeAction( { ...themeData, action: 'activate' } );
			handleError(
				err.errorMessage ||
					__(
						'Could not install theme.',
						'templates-patterns-collection'
					),
				'theme_install'
			);
		};

		installTheme( 'neve', callbackSuccess, callbackError );
	}

	function handleActivate() {
		const callbackSuccess = () => {
			console.log( '[D] Theme Activate.' );
			setThemeInstallProgress( 'done' );
			setThemeAction( false );
			runImportPlugins();
		};

		const callbackError = () => {
			handleError(
				__(
					'Could not activate theme.',
					'templates-patterns-collection'
				),
				'theme_install'
			);
		};

		activateTheme( themeData, callbackSuccess, callbackError );
	}

	function runImportPlugins() {
		if ( ! pluginOptions && ! general.performanceAddon ) {
			console.log( '[S] Plugins.' );
			runImportContent();
			return false;
		}
		setCurrentStep( 'plugins' );
		console.log( '[P] Plugins.' );
		installPlugins( pluginOptions )
			.then( ( response ) => {
				if ( ! response.success ) {
					handleError( response, 'plugins' );
					return false;
				}
				console.log( '[D] Plugins.' );
				setPluginsProgress( 'done' );
				setActionsDone( ( prevActionsDone ) => prevActionsDone + 1 );
				runImportContent();
			} )
			.catch( ( incomingError ) =>
				handleError( incomingError, 'plugins' )
			);
	}

	function runImportContent() {
		if ( ! general.content ) {
			console.log( '[S] Content.' );
			runImportCustomizer();
			return false;
		}
		setCurrentStep( 'content' );
		console.log( '[P] Content.' );
		importContent( {
			contentFile: importData.content_file,
			source: 'remote',
			frontPage: importData.front_page,
			shopPages: importData.shop_pages,
			demoSlug: importData.slug,
			editor,
		} )
			.then( ( response ) => {
				if ( ! response.success ) {
					handleError( response, 'content' );
					return false;
				}
				console.log( '[D] Content.' );
				if ( response.frontpage_id ) {
					setFrontPageID( response.frontpage_id );
				}
				setContentProgress( 'done' );
				setActionsDone( ( prevActionsDone ) => prevActionsDone + 1 );
				runImportCustomizer();
			} )
			.catch( ( incomingError ) =>
				handleError( incomingError, 'content' )
			);
	}

	function runImportCustomizer() {
		if ( ! general.customizer ) {
			console.log( '[S] Customizer.' );
			runImportWidgets();
			return false;
		}
		setCurrentStep( 'customizer' );
		console.log( '[P] Customizer.' );
		importMods( {
			source_url: importData.url,
			theme_mods: importData.theme_mods,
			wp_options: importData.wp_options,
		} )
			.then( ( response ) => {
				if ( ! response.success ) {
					handleError( response, 'customizer' );
					return false;
				}
				console.log( '[D] Customizer.' );
				setCustomizerProgress( 'done' );
				setActionsDone( ( prevActionsDone ) => prevActionsDone + 1 );
				runImportWidgets();
			} )
			.catch( ( incomingError ) =>
				handleError( incomingError, 'customizer' )
			);
	}

	function runImportWidgets() {
		if ( ! general.widgets ) {
			console.log( '[S] Widgets.' );
			runPerformanceAddonInstall();
			return false;
		}
		setCurrentStep( 'widgets' );
		console.log( '[P] Widgets.' );
		importWidgets( importData.widgets )
			.then( ( response ) => {
				if ( ! response.success ) {
					handleError( response, 'widgets' );
					return false;
				}
				console.log( '[D] Widgets.' );
				setWidgetsProgress( 'done' );
				setActionsDone( ( prevActionsDone ) => prevActionsDone + 1 );
				runPerformanceAddonInstall();
			} )
			.catch( ( incomingError ) =>
				handleError( incomingError, 'widgets' )
			);
	}

	function runPerformanceAddonInstall() {
		if ( ! general.performanceAddon ) {
			console.log( '[S] Performance Addon.' );
			importDone();
			return false;
		}
		setCurrentStep( 'performanceAddon' );
		console.log( '[P] Performance Addon.' );

		installPlugins( { 'optimole-wp': true } )
			.then( ( response ) => {
				if ( ! response.success ) {
					handleError( response, 'performanceAddon' );
					return false;
				}
				console.log( '[D] Performance Addon.' );
				setPerformanceAddonProgress( 'done' );
				setActionsDone( ( prevActionsDone ) => prevActionsDone + 1 );
				setTimeout( importDone, 2000 );
			} )
			.catch( ( incomingError ) =>
				handleError( incomingError, 'performanceAddon' )
			);
	}

	function importDone() {
		setCurrentStep( 'done' );
		setIsCleanupAllowed( 'yes' );
		tiobDash.cleanupAllowed = 'yes';
		setImporting( false );
	}

	function handleError( incomingError, step ) {
		setImporting( false );
		setCurrentStep( null );
		if ( 'cleanup' === step ) {
			setPluginsProgress( 'skip' );
		}
		if ( 'plugins' === step ) {
			setContentProgress( 'skip' );
		}
		if ( [ 'content', 'plugins' ].includes( step ) ) {
			setCustomizerProgress( 'skip' );
		}
		if ( [ 'content', 'plugins', 'customizer' ].includes( step ) ) {
			setWidgetsProgress( 'skip' );
		}

		const map = {
			cleanup: __(
				'Something went wrong while cleaning the previous import.',
				'templates-patterns-collection'
			),
			plugins: __(
				'Something went wrong while installing the necessary plugins.',
				'templates-patterns-collection'
			),
			content: __(
				'Something went wrong while importing the website content.',
				'templates-patterns-collection'
			),
			customizer: __(
				'Something went wrong while updating the customizer settings.',
				'templates-patterns-collection'
			),
			widgets: __(
				'Something went wrong while importing the widgets.',
				'templates-patterns-collection'
			),
			performanceAddon: __(
				'Something went wrong while installing the performance addon.',
				'templates-patterns-collection'
			),
		};

		switch ( step ) {
			case 'cleanup':
				setCleanupProgress( 'error' );
				break;
			case 'plugins':
				setPluginsProgress( 'error' );
				break;
			case 'content':
				setContentProgress( 'error' );
				break;
			case 'customizer':
				setCustomizerProgress( 'error' );
				break;
			case 'widgets':
				setWidgetsProgress( 'error' );
				break;
			case 'performanceAddon':
				setPerformanceAddonProgress( 'error' );
				break;
		}
		setError(
			incomingError.data
				? {
					message: map[ step ],
					code: incomingError.data,
				  }
				: { message: map[ step ] }
		);
	}

	useEffect( () => {
		runImportCleanup();
	}, [] );

	return (
		<div className="ob-container narrow center">
			{ 'done' !== currentStep && ! error && ! importing ? (
				<>
					<h1>
						{ __(
							'We are importing your new site!',
							'templates-patterns-collection'
						) }
					</h1>
					<p>
						{ __(
							'Sit tight as we import a website based on your references.',
							'templates-patterns-collection'
						) }
					</p>
					{ null !== currentStep && (
						<ImportProgress
							actionsDone={ actionsDone }
							currentStep={ currentStep }
							actionsNb={
								Object.values( general ).filter(
									( value ) => value === true
								).length
							}
						/>
					) }
				</>
			) : (
				<>
					{ error && (
						<>
							<ImportModalError
								message={ error.message || null }
								code={ error.code || null }
							/>
							<hr />
						</>
					) }
				</>
			) }
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getCurrentEditor, getCurrentSite, getThemeAction } = select(
			'ti-onboarding'
		);
		return {
			editor: getCurrentEditor(),
			siteData: getCurrentSite(),
			themeData: getThemeAction() || false,
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setImportModalStatus, setThemeAction } = dispatch(
			'ti-onboarding'
		);

		return {
			setModal: ( status ) => setImportModalStatus( status ),
			setThemeAction: ( status ) => setThemeAction( status ),
		};
	} )
)( Import );
