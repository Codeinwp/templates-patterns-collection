import { parseEntities } from 'parse-entities';
import { withDispatch, withSelect } from '@wordpress/data';
import { Button, Icon, Modal } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { page as pageIcon } from '@wordpress/icons';
import { useEffect, useState } from '@wordpress/element';

import {
	activateTheme,
	importTemplates,
	importFseTemplate,
	installTheme,
} from '../../utils/site-import';
import { fetchBulkData, getUserTemplateData } from './common';
import classnames from 'classnames';

const ImportTemplatesModal = ( {
	templatesData,
	cancel,
	siteData,
	themeData,
	setModal,
	isUserTemplate = false,
	generalTemplates = false,
} ) => {
	const [ fetching, setFetching ] = useState( true );
	const [ templates, setTemplates ] = useState( [] );
	const [ importing, setImporting ] = useState( false );
	const [ imported, setImported ] = useState( [] );
	const [ error, setError ] = useState( false );

	const isSingle = templatesData.length === 1;

	useEffect( () => {
		if ( isUserTemplate && isSingle ) {
			getUserTemplateData( templatesData[ 0 ].template_id ).then(
				( r ) => {
					if ( ! r.success ) {
						if ( r.message ) {
							setError( r.message );
						} else {
							setError( true );
						}
						setFetching( false );
					}
					setTemplates( r.templates );
					setFetching( false );
				}
			);
		} else {
			fetchBulkData( templatesData.map( ( i ) => i.template_id ) ).then(
				( r ) => {
					if ( ! r.success ) {
						if ( r.message ) {
							setError( r.message );
						} else {
							setError( true );
						}
						setFetching( false );
						return false;
					}
					setTemplates( r.templates );
					setFetching( false );
				}
			);
		}
	}, [ templatesData ] );

	const Mock = () => {
		return (
			<>
				<div className="modal-body">
					<div className="header">
						{ /* eslint-disable-next-line jsx-a11y/heading-has-content */ }
						<h1
							className="is-loading"
							style={ {
								height: 30,
								marginBottom: 30,
								width: '70%',
							} }
						/>
						<p className="description is-loading" />
						<p className="description is-loading" />
						<p
							className="description is-loading"
							style={ { width: '40%' } }
						/>
					</div>
				</div>
				<div className="modal-footer" style={ { marginTop: 50 } }>
					<span className="is-loading link" />
					<span
						className="is-loading button"
						style={ {
							width: '150px',
							marginLeft: 'auto',
						} }
					/>
				</div>
			</>
		);
	};

	const launchImport = ( e ) => {
		e.preventDefault();
		setModal( true );
	};

	const runTemplatesImport = () => {
		setImporting( true );

		/**
		 * Please note that templatesData is an array of objects, but currently we only send one template at a time.
		 * In the future we might send more than one template to bulk-import templates.
		 */
		const { fseTemplates, otherTemplates } = templatesData.reduce(
			( acc, item, index ) => {
				const templateType = item.template_type;
				const mergedTemplate = { ...item, ...templates[ index ] };

				if ( templateType === 'fse' ) {
					acc.fseTemplates.push( mergedTemplate );
				} else {
					acc.otherTemplates.push( mergedTemplate );
				}

				return acc;
			},
			{ fseTemplates: [], otherTemplates: [] }
		);

		/**
		 * Function to import templates that are not FSE.
		 */
		const callbackImportTemplate = () => {
			if ( ! otherTemplates ) {
				return;
			}

			try {
				importTemplates( otherTemplates ).then( ( r ) => {
					if ( ! r.success ) {
						// eslint-disable-next-line no-console
						console.log( r.message );
						return false;
					}

					setImported( r.pages );
					setImporting( 'done' );
				} );
			} catch ( e ) {
				// eslint-disable-next-line no-console
				console.log( e );
			}
		};

		/**
		 * Function to import FSE templates.
		 */
		const callbackImportFse = () => {
			if ( ! fseTemplates ) {
				return;
			}

			try {
				importFseTemplate( fseTemplates ).then( ( r ) => {
					if ( ! r.success ) {
						// eslint-disable-next-line no-console
						setError( r.message );
						return false;
					}

					// setImported( r.pages );
					setImporting( 'done' );
				} );
			} catch ( e ) {
				// eslint-disable-next-line no-console
				console.log( e );
			}
		};

		if (
			! themeData ||
			( otherTemplates[ 0 ]?.template_site_slug === 'general' &&
				otherTemplates[ 0 ]?.premade === 'yes' )
		) {
			callbackImportTemplate();
			return false;
		}

		const callbackError = ( err ) => {
			// eslint-disable-next-line no-console
			console.error( err );
		};

		// skip activation or install for user templates
		if ( isUserTemplate ) {
			callbackImportTemplate();
			callbackImportFse();
			return false;
		}

		if ( themeData.action === 'install' ) {
			installTheme(
				'neve',
				() => {
					activateTheme(
						themeData,
						callbackImportTemplate,
						callbackError
					);
				},
				callbackError
			);
			return false;
		}

		activateTheme( themeData, callbackImportTemplate, callbackError );
	};

	const ImportDone = () => {
		return (
			<>
				<div className="modal-body">
					<div className="header">
						<h1>
							{ __(
								'Import done!',
								'templates-patterns-collection'
							) }
						</h1>
						<p className="description">
							{ isSingle
								? __(
										'Template was successfully imported!',
										'templates-patterns-collection'
								  )
								: __(
										'Templates were successfully imported!',
										'templates-patterns-collection'
								  ) }
						</p>
					</div>
					{ imported && (
						<ul className="modal-toggles">
							{ imported.map( ( page, index ) => {
								return (
									<li className="option-row" key={ index }>
										<Icon
											icon={ pageIcon }
											className="active"
										/>
										<span>
											{ parseEntities( page.title ) }
										</span>
										<div className="actions">
											<Button
												isTertiary
												href={ page.url }
											>
												{ __(
													'Visit',
													'templates-patterns-collection'
												) }
											</Button>
											<Button
												isTertiary
												href={ page.edit }
											>
												{ __(
													'Edit',
													'templates-patterns-collection'
												) }
											</Button>
										</div>
									</li>
								);
							} ) }
						</ul>
					) }
				</div>
				<div className="modal-footer">
					<Button isPrimary className="import" onClick={ cancel }>
						{ __( 'Close', 'templates-patterns-collection' ) }
					</Button>
				</div>
			</>
		);
	};

	const Error = () => {
		return (
			<>
				<div className="modal-body">
					<div className="header">
						<h1>
							{ __(
								'An error occurred!',
								'templates-patterns-collection'
							) }
						</h1>
						<p className="description">
							{ error === true
								? __( 'Please refresh the page and try again.', 'templates-patterns-collection' )
								: error }
						</p>
					</div>
				</div>
				<div className="modal-footer">
					<Button
						isPrimary
						className="import"
						onClick={ () => {
							setError( false );
							cancel();
						} }
					>
						{ __( 'Close', 'templates-patterns-collection' ) }
					</Button>
				</div>
			</>
		);
	};

	const description = () => {
		const {
			template_name: templateName,
			template_type: templateType,
		} = templatesData[ 0 ];

		if ( templateType === 'fse' ) {
			return __(
				'This import will add a new Full Site Editing template to your site.',
				'templates-patterns-collection'
			);
		}

		return isSingle
			? sprintf(
				/* translators: %s  the name of the template */
				__(
					'The %s template will be imported as a page into your site. This import will install & activate the page builder plugin if not already installed.',
					'templates-patterns-collection'
				),
				templateName
			  )
			: __(
					'All the templates that are included in this starter site, will be imported as pages. This import will install & activate the page builder plugin if not already installed.',
					'templates-patterns-collection'
			  );
	};

	const ModalContent = ( props ) => {
		if ( fetching ) {
			return <Mock />;
		}

		if ( props.error ) {
			return <Error />;
		}

		return (
			<>
				<div className="modal-body">
					<div className="header">
						<h1>
							{ sprintf(
								isSingle
									? /* translators: name of starter site */
									  __(
											'Import the %s template',
											'templates-patterns-collection'
									  )
									: /* translators: name of template */
									  __(
											'Import all templates from %s',
											'templates-patterns-collection'
									  ),
								isSingle
									? templatesData[ 0 ].template_name
									: siteData.title
							) }
						</h1>
						<p className="description">{ description() }</p>
					</div>
				</div>
				<div className="modal-footer">
					{ ! generalTemplates && (
						<Button
							className="import-templates"
							isLink
							disabled={ importing }
							onClick={ launchImport }
						>
							{ __(
								'I want to import the entire site',
								'templates-patterns-collection'
							) }
						</Button>
					) }
					<Button
						isPrimary
						className="import"
						disabled={ importing }
						onClick={ runTemplatesImport }
					>
						{ importing
							? __( 'Importing', 'templates-patterns-collection' ) + '...'
							: isSingle
							? __( 'Import', 'templates-patterns-collection' )
							: __( 'Import All Pages', 'templates-patterns-collection' ) }
					</Button>
				</div>
			</>
		);
	};

	return (
		<Modal
			className={ classnames( [ 'ob-import-modal', { fetching } ] ) }
			onRequestClose={ cancel }
			shouldCloseOnClickOutside={
				( ! importing || importing === 'done' ) && ! fetching
			}
			isDismissible={
				( ! importing || importing === 'done' ) && ! fetching
			}
		>
			{ importing === 'done' && ! error ? (
				<ImportDone />
			) : (
				<ModalContent error={ error } />
			) }
		</Modal>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getThemeAction, getCurrentSite } = select( 'neve-onboarding' );
		return {
			siteData: getCurrentSite(),
			themeData: getThemeAction() || false,
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setTemplateModal, setImportModalStatus } = dispatch(
			'neve-onboarding'
		);

		return {
			cancel: () => {
				setTemplateModal( null );
			},
			setModal: ( status ) => setImportModalStatus( status ),
		};
	} )
)( ImportTemplatesModal );
