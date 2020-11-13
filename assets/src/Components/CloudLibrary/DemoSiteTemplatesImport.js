/* global tiobDash */
import { Spinner, Button, Icon } from '@wordpress/components';
import { withDispatch, withSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';

import { fetchLibrary, fetchBulkData } from './common';
import ListItem from './ListItem';
import PreviewFrame from './PreviewFrame';
import { close } from '@wordpress/icons';

const DemoSiteTemplatesImport = ( {
	slug,
	cancel,
	setModal,
	setInstallModal,
	themeStatus,
	site,
	editor,
} ) => {
	const [ templates, setTemplates ] = useState( [] );
	const [ loading, setLoading ] = useState( false );
	const [ previewUrl, setPreviewUrl ] = useState( '' );

	const { title, upsell, utmOutboundLink } = site;

	useEffect( () => {
		setLoading( true );
		loadTemplates();
	}, [] );

	const loadTemplates = () => {
		const params = {
			per_page: 100,
			template_site_slug: slug,
			premade: true,
			type: editor,
		};

		fetchLibrary( true, params ).then( ( r ) => {
			setTemplates( r.templates || [] );
			setLoading( false );
		} );
	};

	const handlePreview = ( url ) => {
		setPreviewUrl( url );
	};

	const handleBulk = () => {
		fetchBulkData( templates.map( ( i ) => i.template_id ) ).then(
			( r ) => {
				console.log( r );
			}
		);
	};

	const launchImport = ( e ) => {
		e.preventDefault();

		if ( themeStatus ) {
			setInstallModal( true );

			return false;
		}
		setModal( true );
	};

	const Templates = () => {
		if ( loading ) {
			return <Spinner />;
		}
		if ( templates.length < 1 ) {
			return __( 'No templates for this starter site.' );
		}

		return (
			<div className="cloud-items is-grid">
				<div className="table">
					{ templates.map( ( item ) => (
						<ListItem
							onPreview={ handlePreview }
							userTemplate={ false }
							key={ item.template_id }
							item={ item }
							loadTemplates={ loadTemplates }
							grid={ true }
						/>
					) ) }
				</div>
			</div>
		);
	};

	return (
		<div className="single-templates-wrapper">
			<div className="top">
				<div className="breadcrumb">
					<Button isTertiary onClick={ cancel }>
						{ __( 'Back to starter sites' ) }
					</Button>
				</div>
				<div className="header">
					<div className="text">
						<h1>
							{ title || '' }
							{ upsell && (
								<span className="pro-badge">
									<Icon icon="lock" />
									<span>
										{ __(
											'Premium',
											'templates-patterns-collection'
										) }
									</span>
								</span>
							) }
						</h1>
						<p className="description">
							{ __(
								'You can import individual pages or bulk-import all of them.'
							) }
						</p>
					</div>

					<div className="actions">
						{ ! upsell && (
							<>
								<Button isSecondary onClick={ launchImport }>
									{ __( 'Import Starter Site' ) }
								</Button>
								<Button
									isPrimary
									disabled={ templates.length < 1 }
									onClick={ handleBulk }
								>
									{ __( 'Import All Pages' ) }
								</Button>
							</>
						) }
						{ upsell && (
							<Button
								href={ utmOutboundLink || tiobDash.upgradeURL }
								isSecondary
								onClick={ launchImport }
							>
								{ __( 'Upgrade' ) }
							</Button>
						) }
					</div>
				</div>
			</div>
			<Templates />
			{ previewUrl && (
				<PreviewFrame
					previewUrl={ previewUrl }
					leftButtons={
						<Button
							icon={ close }
							onClick={ () => setPreviewUrl( '' ) }
						/>
					}
				/>
			) }
		</div>
	);
};

export default compose(
	withDispatch( ( dispatch ) => {
		const {
			setSingleTemplateImport,
			setImportModalStatus,
			setInstallModalStatus,
		} = dispatch( 'neve-onboarding' );

		const cancel = () => {
			setSingleTemplateImport( null );
		};

		return {
			cancel,
			setModal: ( status ) => setImportModalStatus( status ),
			setInstallModal: ( status ) => setInstallModalStatus( status ),
		};
	} ),
	withSelect( ( select ) => {
		const { getThemeAction, getCurrentSite, getCurrentEditor } = select(
			'neve-onboarding'
		);

		return {
			themeStatus: getThemeAction().action || false,
			site: getCurrentSite(),
			editor: getCurrentEditor(),
		};
	} )
)( DemoSiteTemplatesImport );
