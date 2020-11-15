/* global tiobDash */
import { close, chevronLeft, chevronRight } from '@wordpress/icons';
import { Spinner, Button, Icon } from '@wordpress/components';
import { withDispatch, withSelect } from '@wordpress/data';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { __, isRTL } from '@wordpress/i18n';

import { compose } from '@wordpress/compose';
import { fetchLibrary } from './common';
import ListItem from './ListItem';
import PreviewFrame from './PreviewFrame';
import ImportTemplatesModal from './ImportTemplatesModal';

const DemoSiteTemplatesImport = ( {
	slug,
	cancel,
	setModal,
	setInstallModal,
	themeStatus,
	site,
	editor,
	setTemplateModal,
	templateModal,
} ) => {
	const [ templates, setTemplates ] = useState( [] );
	const [ loading, setLoading ] = useState( true );
	const [ previewUrl, setPreviewUrl ] = useState( '' );

	const { title, upsell, utmOutboundLink } = site;

	useEffect( () => {
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

	const handleBulk = ( e ) => {
		e.preventDefault();

		if ( themeStatus ) {
			setInstallModal( true );

			return false;
		}
		setTemplateModal( templates.map( ( i ) => i.template_id ) );
	};

	const launchImport = ( e ) => {
		e.preventDefault();

		if ( themeStatus ) {
			setInstallModal( true );

			return false;
		}
		setModal( true );
	};

	const handleSingleImport = ( id ) => {
		if ( themeStatus ) {
			setInstallModal( true );

			return false;
		}
		console.log( id );

		setTemplateModal( [ id ] );
	};

	const currentPreviewIndex = templates.findIndex(
		( item ) => item.link === previewUrl
	);

	const currentPreviewTemplateId = () => {
		const currentItem = templates.find(
			( item ) => item.link === previewUrl
		);

		return currentItem.template_id;
	};

	const handlePrevious = () => {
		let newIndex = currentPreviewIndex - 1;
		if ( currentPreviewIndex === 0 ) {
			newIndex = templates.length - 1;
		}
		setPreviewUrl( templates[ newIndex ].link );
	};

	const handleNext = () => {
		let newIndex = currentPreviewIndex + 1;
		if ( currentPreviewIndex === templates.length - 1 ) {
			newIndex = 0;
		}
		setPreviewUrl( templates[ newIndex ].link );
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
							upsell={ upsell }
							onPreview={ handlePreview }
							userTemplate={ false }
							key={ item.template_id }
							item={ item }
							loadTemplates={ loadTemplates }
							onImport={ () =>
								handleSingleImport( item.template_id )
							}
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
						<>
							<Button
								icon={ close }
								onClick={ () => setPreviewUrl( '' ) }
								label={ __(
									'Close',
									'templates-patterns-collection'
								) }
							/>
							{ templates.length > 1 && (
								<>
									<Button
										icon={
											isRTL() ? chevronRight : chevronLeft
										}
										onClick={ handlePrevious }
									/>
									<Button
										icon={
											isRTL() ? chevronLeft : chevronRight
										}
										onClick={ handleNext }
									/>
								</>
							) }
						</>
					}
					rightButtons={
						<>
							{ ! upsell && (
								<>
									<Button
										isSecondary
										onClick={ launchImport }
									>
										{ __( 'Import Starter Site' ) }
									</Button>
									<Button
										isPrimary
										disabled={ templates.length < 1 }
										onClick={ () =>
											handleSingleImport(
												currentPreviewTemplateId()
											)
										}
									>
										{ __( 'Import Page' ) }
									</Button>
								</>
							) }
							{ upsell && (
								<Button
									href={
										utmOutboundLink || tiobDash.upgradeURL
									}
									isSecondary
								>
									{ __( 'Upgrade' ) }
								</Button>
							) }
						</>
					}
				/>
			) }
			{ templateModal && ! loading && templates.length > 1 && (
				<ImportTemplatesModal templatesData={ templates } />
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
			setTemplateModal,
		} = dispatch( 'neve-onboarding' );

		const cancel = () => {
			setSingleTemplateImport( null );
		};

		return {
			cancel,
			setModal: ( status ) => setImportModalStatus( status ),
			setInstallModal: ( status ) => setInstallModalStatus( status ),
			setTemplateModal,
		};
	} ),
	withSelect( ( select ) => {
		const {
			getTemplateModal,
			getThemeAction,
			getCurrentSite,
			getCurrentEditor,
		} = select( 'neve-onboarding' );

		return {
			templateModal: getTemplateModal(),
			themeStatus: getThemeAction().action || false,
			site: getCurrentSite(),
			editor: getCurrentEditor(),
		};
	} )
)( DemoSiteTemplatesImport );
