/*global tiobDash*/
/* eslint-disable no-console */
import {
	activateTheme,
	cleanupImport,
	importContent,
	importMods,
	importWidgets,
	installPlugins,
	installTheme,
} from '../utils/site-import';
import { get } from '../utils/rest';
import { trailingSlashIt } from '../utils/common';
import ImportStepper from './ImportStepper';
import ImportModalNote from './ImportModalNote';
import classnames from 'classnames';
import ImportModalError from './ImportModalError';
import ImportModalMock from './ImportModalMock';
import CustomTooltip from './CustomTooltip';

import {
	createInterpolateElement,
	useEffect,
	useState,
} from '@wordpress/element';
import { withDispatch, withSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';

import {
	Button,
	Icon,
	Modal,
	Panel,
	PanelBody,
	PanelRow,
	ToggleControl,
} from '@wordpress/components';

const ImportModal = ( {
	setModal,
	setThemeAction,
	editor,
	siteData,
	themeData,
	runTemplateImport,
} ) => {
	const [ general, setGeneral ] = useState( {
		content: true,
		customizer: true,
		widgets: true,
		cleanup: false,
		performanceAddon: true,
		theme_install: themeData !== false,
	} );

	const [ themeInstallProgress, setThemeInstallProgress ] = useState( false );
	const [ performanceAddonProgress, setPerformanceAddonProgress ] = useState(
		false
	);
	const [ cleanupProgress, setCleanupProgress ] = useState( false );
	const [ pluginsProgress, setPluginsProgress ] = useState( false );
	const [ contentProgress, setContentProgress ] = useState( false );
	const [ customizerProgress, setCustomizerProgress ] = useState( false );
	const [ widgetsProgress, setWidgetsProgress ] = useState( false );
	const [ frontPageID, setFrontPageID ] = useState( null );
	const [ currentStep, setCurrentStep ] = useState( null );
	const [ importing, setImporting ] = useState( false );
	const [ pluginOptions, setPluginOptions ] = useState( {} );
	const [ error, setError ] = useState( null );
	const [ importData, setImportData ] = useState( null );
	const [ fetching, setFetching ] = useState( true );
	const [ pluginsOpened, setPluginsOpened ] = useState( true );
	const [ optionsOpened, setOptionsOpened ] = useState( true );
	const [ themeOpened, setThemeOpened ] = useState( true );

	const { license, cleanupAllowed } = tiobDash;
	const [ isCleanupAllowed, setIsCleanupAllowed ] = useState(
		cleanupAllowed
	);

	useEffect( () => {
		const fetchAddress = siteData.remote_url || siteData.url;
		// Use the line below if testing in a staging env:
		// const fetchAddress = siteData.url || siteData.remote_url;
		const url = new URL(
			`${ trailingSlashIt( fetchAddress ) }wp-json/ti-demo-data/data`
		);
		url.searchParams.append( 'license', license ? license.key : 'free' );
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

					Object.keys( mandatory ).forEach( ( key ) => {
						mandatory[ key ] = true;
					} );
					Object.keys( optional ).forEach( ( key ) => {
						optional[ key ] = ! defaultOff.includes( key );
					} );

					setPluginOptions( {
						...optional,
						...mandatory,
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

	const Note = () => {
		return (
			<ImportModalNote
				data={ importData }
				externalInstalled={ externalPluginsInstalled }
			/>
		);
	};

	const ModalHead = () => (
		<div className="header">
			<h1>
				{ sprintf(
					/* translators: name of starter site */
					__(
						'Import %s as a complete site',
						'templates-patterns-collection'
					),
					importData.title
				) }
			</h1>
			<p className="description">
				{ __(
					'Import the entire site including customizer options, pages, content and plugins.',
					'templates-patterns-collection'
				) }
			</p>
		</div>
	);
	const Theme = () => {
		const toggleOpen = () => {
			setThemeOpened( ! themeOpened );
		};
		const rowClass = classnames( 'option-row', 'active' );
		const { icon, title, tooltip } = {
			icon: 'admin-appearance',
			title: __( 'Neve', 'templates-patterns-collection' ),
			tooltip: __(
				'In order to import the starter site, Neve theme has to be installed and activated.',
				'templates-patterns-collection'
			),
		};

		return (
			<PanelBody
				onToggle={ toggleOpen }
				opened={ themeOpened }
				className="options general"
				title={ __(
					'Install required theme',
					'templates-patterns-collection'
				) }
			>
				<PanelRow className={ rowClass }>
					<Icon icon={ icon } />
					<span>{ title }</span>
					{ tooltip && <CustomTooltip>{ tooltip }</CustomTooltip> }
				</PanelRow>
			</PanelBody>
		);
	};

	const Options = () => {
		let map = {
			content: {
				title: __( 'Content', 'templates-patterns-collection' ),
				icon: 'admin-post',
				tooltip: __(
					'We recommend you backup your website content before attempting a full site import.',
					'templates-patterns-collection'
				),
			},
			customizer: {
				title: __( 'Customizer', 'templates-patterns-collection' ),
				icon: 'admin-customizer',
			},
			widgets: {
				title: __( 'Widgets', 'templates-patterns-collection' ),
				icon: 'admin-generic',
				tooltip: __(
					'Widgets will be moved to the Inactive Widgets sidebar and can be retrieved from there.',
					'templates-patterns-collection'
				),
			},
			performanceAddon: {
				title: __(
					'Enable performance features for my site',
					'templates-patterns-collection'
				),
				icon: 'dashboard',
				tooltip: createInterpolateElement(
					__(
						sprintf(
							// translators: %s is Optimole plugin name.
							'Optimize and speed up your site with our trusted addon, <a><span>%s</span><icon/></a>. It’s free.',
							'Optimole'
						),
						'templates-patterns-collection'
					),
					{
						a: (
							<a
								href="https://wordpress.org/plugins/optimole-wp/"
								target={ '_blank' }
								style={ {
									textDecoration: 'none',
									display: 'inline-flex',
									alignItems: 'center',
								} }
							/>
						),
						icon: (
							<Icon
								size={ 10 }
								icon="external"
								style={ { marginLeft: 0 } }
							/>
						),
						span: <div />,
					}
				),
			},
		};

		if ( isCleanupAllowed === 'yes' ) {
			map = {
				cleanup: {
					icon: 'trash',
					title: __(
						'Cleanup previous import',
						'templates-patterns-collection'
					),
					tooltip: __(
						'This will remove any plugins, images, customizer options, widgets posts and pages added by the previous demo import',
						'templates-patterns-collection'
					),
				},
				...map,
			};
		}

		const toggleOpen = () => {
			setOptionsOpened( ! optionsOpened );
		};

		return (
			<PanelBody
				onToggle={ toggleOpen }
				opened={ optionsOpened }
				className="options general"
				title={ __(
					'Import settings',
					'templates-patterns-collection'
				) }
			>
				{ Object.keys( map ).map( ( id, index ) => {
					const rowClass = classnames( 'option-row', {
						active: general[ id ],
					} );
					const { icon, title, tooltip } = map[ id ];

					return (
						<PanelRow className={ rowClass } key={ index }>
							<Icon icon={ icon } />
							<span>{ title }</span>
							{ tooltip && (
								<CustomTooltip
									toLeft={ id === 'performanceAddon' }
								>
									{ tooltip }
								</CustomTooltip>
							) }
							{ id !== 'theme_install' && (
								<div className="toggle-wrapper">
									<ToggleControl
										checked={ general[ id ] }
										onChange={ () => {
											setGeneral( {
												...general,
												[ id ]: ! general[ id ],
											} );
										} }
									/>
								</div>
							) }
						</PanelRow>
					);
				} ) }
			</PanelBody>
		);
	};
	const Plugins = () => {
		if ( fetching ) {
			return null;
		}
		const allPlugins = {
			...( importData.recommended_plugins || {} ),
			...( importData.mandatory_plugins || {} ),
		};

		if ( Object.keys( allPlugins ).length < 1 ) {
			return null;
		}

		const toggleOpen = () => {
			setPluginsOpened( ! pluginsOpened );
		};

		return (
			<PanelBody
				onToggle={ toggleOpen }
				opened={ pluginsOpened }
				className="options plugins"
				title={ __( 'Plugins', 'templates-patterns-collection' ) }
			>
				{ Object.keys( allPlugins ).map( ( slug, index ) => {
					const rowClass = classnames( 'option-row', {
						active: pluginOptions[ slug ],
					} );
					return (
						<PanelRow className={ rowClass } key={ index }>
							<Icon icon="admin-plugins" />
							<span
								dangerouslySetInnerHTML={ {
									__html: allPlugins[ slug ],
								} }
							/>
							{ slug in importData.recommended_plugins && (
								<div className="toggle-wrapper">
									<ToggleControl
										checked={ pluginOptions[ slug ] }
										onChange={ () => {
											setPluginOptions( {
												...pluginOptions,
												[ slug ]: ! pluginOptions[
													slug
												],
											} );
										} }
									/>
								</div>
							) }
						</PanelRow>
					);
				} ) }
			</PanelBody>
		);
	};

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
				setCleanupProgress( 'done' );
				runImport();
			} )
			.catch( ( incomingError ) =>
				handleError( incomingError, 'cleanup' )
			);
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

	function runImportPlugins() {
		// console.clear();
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
				importDone();
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

	const closeModal = () => {
		if ( importing ) {
			return false;
		}
		setModal( false );
	};

	const externalPluginsInstalled = siteData.external_plugins
		? siteData.external_plugins.every( ( value ) => true === value.active )
		: true;
	const allOptionsOff = Object.keys( general ).every(
		( k ) => false === general[ k ]
	);
	const editLinkMap = {
		elementor: `${ tiobDash.onboarding.homeUrl }/wp-admin/post.php?post=${ frontPageID }&action=elementor`,
		brizy: `${ tiobDash.onboarding.homeUrl }/?brizy-edit`,
		'beaver builder': `${ tiobDash.onboarding.homeUrl }/?fl_builder`,
		'thrive architect': `${ tiobDash.onboarding.homeUrl }/wp-admin/post.php?post=${ frontPageID }&action=architect&tve=true`,
		'divi builder': `${ tiobDash.onboarding.homeUrl }/?et_fb=1&PageSpeed=off`,
		gutenberg: `${ tiobDash.onboarding.homeUrl }/wp-admin/post.php?post=${ frontPageID }&action=edit`,
	};
	const editLink = editLinkMap[ editor ];

	return (
		<Modal
			className={ classnames( [ 'ob-import-modal', { fetching } ] ) }
			onRequestClose={ closeModal }
			shouldCloseOnClickOutside={ ! importing && ! fetching }
			isDismissible={ ! importing && ! fetching }
		>
			{ fetching ? (
				<ImportModalMock />
			) : (
				<>
					<div className="modal-body">
						{ ! importing && 'done' !== currentStep && ! error ? (
							<>
								<ModalHead />
								<Note />
								<Panel className="modal-toggles">
									{ themeData !== false && <Theme /> }
									<Options />
									<Plugins />
								</Panel>
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
								{ null !== currentStep && (
									<ImportStepper
										progress={ {
											theme_install: themeInstallProgress,
											cleanup: cleanupProgress,
											plugins: pluginsProgress,
											content: contentProgress,
											customizer: customizerProgress,
											widgets: widgetsProgress,
											performanceAddon: performanceAddonProgress,
										} }
										currentStep={ currentStep }
										willDo={ general }
									/>
								) }
								{ 'done' === currentStep && (
									<>
										<hr />
										<p className="import-result">
											{ __(
												'Content was successfully imported. Enjoy your new site!',
												'templates-patterns-collection'
											) }
										</p>
										<hr />
									</>
								) }
							</>
						) }
					</div>
					{ ! importing && (
						<div className="modal-footer">
							{ 'done' !== currentStep ? (
								<>
									<Button
										className="import-templates"
										isLink
										onClick={ runTemplateImport }
									>
										{ __(
											'I want to import just the templates',
											'templates-patterns-collection'
										) }
									</Button>
									{ ! error && (
										<Button
											className="import"
											isPrimary
											disabled={
												allOptionsOff ||
												! externalPluginsInstalled
											}
											onClick={ () => {
												setImporting( true );
												runImportCleanup();
											} }
										>
											{ __(
												'Import entire site',
												'templates-patterns-collection'
											) }
										</Button>
									) }
								</>
							) : (
								<div className="import-done-actions">
									<Button
										isLink
										className="close"
										onClick={ closeModal }
									>
										{ __(
											'Back to Sites Library',
											'templates-patterns-collection'
										) }
									</Button>
									<Button
										isSecondary
										href={ tiobDash.onboarding.homeUrl }
									>
										{ __(
											'View Website',
											'templates-patterns-collection'
										) }
									</Button>
									<Button
										isPrimary
										className="import"
										href={ editLink }
									>
										{ __(
											'Add your own content',
											'templates-patterns-collection'
										) }
									</Button>
								</div>
							) }
						</div>
					) }
				</>
			) }
		</Modal>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getCurrentEditor, getCurrentSite, getThemeAction } = select(
			'neve-onboarding'
		);
		return {
			editor: getCurrentEditor(),
			siteData: getCurrentSite(),
			themeData: getThemeAction() || false,
		};
	} ),
	withDispatch( ( dispatch, { siteData } ) => {
		const {
			setTemplateModal,
			setSingleTemplateImport,
			setImportModalStatus,
			setThemeAction,
		} = dispatch( 'neve-onboarding' );

		const runTemplateImport = () => {
			setSingleTemplateImport( siteData.slug );
			setTemplateModal( true );
			setImportModalStatus( false );
		};

		return {
			setModal: ( status ) => setImportModalStatus( status ),
			setThemeAction: ( status ) => setThemeAction( status ),
			runTemplateImport,
		};
	} )
)( ImportModal );
