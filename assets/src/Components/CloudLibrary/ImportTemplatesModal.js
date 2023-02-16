import { parseEntities } from 'parse-entities';
import { withSelect, withDispatch } from '@wordpress/data';
import { Modal, Button, Icon } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { page as pageIcon } from '@wordpress/icons';
import { useEffect, useState } from '@wordpress/element';

import {
	importTemplates,
	installTheme,
	activateTheme,
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
		const data = templatesData.map( ( item, index ) => {
			return { ...item, ...templates[ index ] };
		} );

		const callbackImportTemplate = () => {
			try {
				importTemplates( data ).then( ( r ) => {
					if ( ! r.success ) {
						console.log( r.message );
						return false;
					}

					setImported( r.pages );
					setImporting( 'done' );
				} );
			} catch ( e ) {
				console.log( e );
			}
		};

		if (
			! themeData ||
			( data[ 0 ].template_site_slug === 'general' &&
				data[ 0 ].premade === 'yes' )
		) {
			callbackImportTemplate();
			return false;
		}

		const callbackError = ( err ) => {
			console.error( err );
		};

		// skip activation or install for user templates
		if ( isUserTemplate ) {
			callbackImportTemplate();
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
										<span>{ parseEntities( page.title ) }</span>
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
						{ __( 'Close' ) }
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
								? __( 'Please refresh the page and try again.' )
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
						{ __( 'Close' ) }
					</Button>
				</div>
			</>
		);
	};

	const description = () => {
		const map = {
			strong: <strong>{ __( 'does not' ) }</strong>,
		};

		const text = isSingle
			? sprintf(
				/* translators: %s  the name of the template */
				__(
					'The %s template will be imported as a page into your site. This import will install & activate the page builder plugin if not already installed.',
						'templates-patterns-collection'
				),
				templatesData[ 0 ].template_name
			  )
			: __(
				'All the templates that are included in this starter site, will be imported as pages. This import will install & activate the page builder plugin if not already installed.',
				'templates-patterns-collection'
			  );

		return text;
	};

	const ModalContent = () => {
		if ( fetching ) {
			return <Mock />;
		}

		if ( error ) {
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
							? __( 'Importing' ) + '...'
							: isSingle
								? __( 'Import' )
								: __( 'Import All Pages' ) }
					</Button>
				</div>
			</>
		);
	};

	return (
		<Modal
			className={ classnames( [ 'ob-import-modal', { fetching } ] ) }
			onRequestClose={ cancel }
			shouldCloseOnClickOutside={ ( ! importing || importing === 'done' ) && ! fetching }
			isDismissible={ ( ! importing || importing === 'done' ) && ! fetching }
		>
			{ importing === 'done' ? <ImportDone /> : <ModalContent /> }
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
		const {
			setTemplateModal,
			setImportModalStatus,
		} = dispatch( 'neve-onboarding' );

		return {
			cancel: () => {
				setTemplateModal( null );
			},
			setModal: ( status ) => setImportModalStatus( status ),
		};
	} )
)( ImportTemplatesModal );
