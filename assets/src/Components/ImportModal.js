/*global tiobDash*/
import {
	importContent,
	importMods,
	importWidgets,
	installPlugins,
} from '../utils/site-import';
import { get } from '../utils/rest';
import { trailingSlashIt } from '../utils/common';
import ImportStepper from './ImportStepper';
import ImportModalNote from './ImportModalNote';
import classnames from 'classnames';
import ImportModalError from './ImportModalError';

import { useState, useEffect, Fragment } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import {
	Button,
	Icon,
	ToggleControl,
	Modal,
	Panel,
	PanelBody,
	PanelRow,
} from '@wordpress/components';

const ImportModal = ( { setModal, editor, siteData, runTemplateImport } ) => {
	const [ general, setGeneral ] = useState( {
		content: true,
		customizer: true,
		widgets: true,
	} );
	const [ pluginsProgress, setPluginsProgress ] = useState( false );
	const [ contentProgress, setContentProgress ] = useState( false );
	const [ customizerProgress, setCustomizerProgress ] = useState( false );
	const [ widgetsProgress, setWidgetsProgress ] = useState( false );
	const [ frontPageID, setFrontPageID ] = useState( null );
	const [ currentStep, setCurrentStep ] = useState( null );
	const [ importing, setImporting ] = useState( false );
	const [ pluginOptions, setPluginOptions ] = useState( null );
	const [ error, setError ] = useState( null );
	const [ importData, setImportData ] = useState( null );
	const [ fetching, setFetching ] = useState( true );
	const [ pluginsOpened, setPluginsOpened ] = useState( true );
	const [ optionsOpened, setOptionsOpened ] = useState( true );

	const { license } = tiobDash;

	useEffect( () => {
		const fetchAddress = siteData.remote_url || siteData.url;
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

					Object.keys( mandatory ).map( ( key ) => {
						mandatory[ key ] = true;
					} );
					Object.keys( optional ).map( ( key ) => {
						optional[ key ] = ! defaultOff.includes( key );
					} );

					setPluginOptions( {
						...optional,
						...mandatory,
					} );

					setFetching( false );
				} );
			} )
			.catch( ( error ) => {
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

	const renderMock = () => {
		return (
			<Fragment>
				<div className="modal-body">
					<div className="header">
						<span
							className="title is-loading"
							style={ { height: 35, marginBottom: 20 } }
						/>
						<p className="description is-loading" />
						<p className="description is-loading" />
					</div>
					<div className="well is-loading">
						<span
							className="title is-loading"
							style={ { height: 20 } }
						/>
						<ol>
							<li />
							<li />
						</ol>
					</div>

					<div className="modal-toggles components-panel">
						{ [ 1, 2 ].map( ( i ) => (
							<div
								key={ i }
								className="components-panel__body options general is-opened"
							>
								<span className="title is-loading" />
								<ul>
									{ [ 1, 2, 3 ].map( ( i ) => (
										<li className="option-row" key={ i }>
											<div className="mock-icon is-loading" />
											<span className="is-loading" />
											<div className="toggle is-loading" />
										</li>
									) ) }
								</ul>
							</div>
						) ) }
					</div>
				</div>
				<div className="modal-footer">
					<span className="link is-loading" />
					<Button isPrimary className="import is-loading" />
				</div>
			</Fragment>
		);
	};
	const Note = () => {
		return (
			<ImportModalNote
				data={ importData }
				externalInstalled={ externalPluginsInstalled }
			/>
		);
	};

	const ModalHead = () => {
		if ( fetching ) {
			return (
				<>
					<h1 className="is-loading title" />
					<p className="is-loading description" />
				</>
			);
		}
		return (
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
	};

	const Options = () => {
		const map = {
			content: {
				title: __( 'Content', 'templates-patterns-collection' ),
				icon: 'admin-post',
			},
			customizer: {
				title: __( 'Customizer', 'templates-patterns-collection' ),
				icon: 'admin-customizer',
			},
			widgets: {
				title: __( 'Widgets', 'templates-patterns-collection' ),
				icon: 'admin-generic',
			},
		};

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
					return (
						<PanelRow className="option-row" key={ index }>
							<Icon
								className={ classnames( {
									active: general[ id ],
								} ) }
								icon={ map[ id ].icon }
							/>
							<span>{ map[ id ].title }</span>
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
					return (
						<PanelRow className="option-row" key={ index }>
							<Icon
								icon="admin-plugins"
								className={ classnames( {
									active: pluginOptions[ slug ],
								} ) }
							/>
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

	function runImport() {
		console.clear();
		if ( ! pluginOptions ) {
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
			.catch( ( error ) => handleError( error, 'plugins' ) );
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
			.catch( ( error ) => handleError( error, 'content' ) );
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
			.catch( ( error ) => handleError( error, 'customizer' ) );
	}

	function runImportWidgets() {
		if ( ! general.widgets ) {
			console.log( '[S] Widgets.' );
			importDone();
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
				importDone();
			} )
			.catch( ( error ) => handleError( error, 'widgets' ) );
	}

	function importDone() {
		setCurrentStep( 'done' );
		setImporting( false );
	}

	function handleError( error, step ) {
		setImporting( false );
		setCurrentStep( null );
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
		};

		switch ( step ) {
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
		}
		setError(
			error.data
				? {
						message: map[ step ],
						code: error.data,
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

	const runTemplatesImport = () => {};

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
				renderMock()
			) : (
				<Fragment>
					<div className="modal-body">
						{ ! importing && 'done' !== currentStep && ! error ? (
							<>
								<ModalHead />
								<Note />
								<Panel className="modal-toggles">
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
											plugins: pluginsProgress,
											content: contentProgress,
											customizer: customizerProgress,
											widgets: widgetsProgress,
										} }
										currentStep={ currentStep }
										willDo={ general }
									/>
								) }
								{ 'done' === currentStep && (
									<Fragment>
										<hr />
										<p className="import-result">
											{ __(
												'Content was successfully imported. Enjoy your new site!',
												'templates-patterns-collection'
											) }
										</p>
										<hr />
									</Fragment>
								) }
							</>
						) }
					</div>
					{ ! importing && (
						<div className="modal-footer">
							{ 'done' !== currentStep ? (
								<Fragment>
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
												runImport();
											} }
										>
											{ __(
												'Import entire site',
												'templates-patterns-collection'
											) }
										</Button>
									) }
								</Fragment>
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
				</Fragment>
			) }
		</Modal>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getCurrentEditor, getCurrentSite } = select(
			'neve-onboarding'
		);
		return {
			editor: getCurrentEditor(),
			siteData: getCurrentSite(),
		};
	} ),
	withDispatch( ( dispatch, { siteData } ) => {
		const {
			setTemplateModal,
			setSingleTemplateImport,
			setImportModalStatus,
		} = dispatch( 'neve-onboarding' );

		const runTemplateImport = () => {
			setSingleTemplateImport( siteData.slug );
			setTemplateModal( true );
			setImportModalStatus( false );
		};

		return {
			setModal: ( status ) => setImportModalStatus( status ),
			runTemplateImport,
		};
	} )
)( ImportModal );
