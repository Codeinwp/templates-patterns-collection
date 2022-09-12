/* eslint-disable camelcase */
import { withDispatch } from '@wordpress/data';
import { Button, Dashicon } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';

import classnames from 'classnames';

const StarterSiteCard = ( {
	data,
	setSite,
	setPreview,
	setModal,
	setImportingPages,
} ) => {
	const { upsell, screenshot, title, has_templates, isNew } = data;
	const [ actionsClass, setActionClass ] = useState( '' );

	const showActions = () => {
		setActionClass( 'visible' );
	};
	const hideActions = () => {
		setActionClass( '' );
	};

	const launchImport = ( e ) => {
		e.preventDefault();

		setSite();
		setModal( true );
	};

	const launchPreview = ( e ) => {
		e.preventDefault();
		setSite();
		setPreview( true );
	};

	const cardClassNames = classnames( 'card starter-site-card', {
		'has-templates': has_templates,
	} );

	return (
		<div
			onMouseEnter={ showActions }
			onMouseLeave={ hideActions }
			className={ cardClassNames }
		>
			{ isNew && (
				<span className="new-badge">
					{ __(
						'New',
						'templates-patterns-collection'
					).toUpperCase() }
				</span>
			) }
			<div className="top">
				<div className={ 'actions ' + actionsClass }>
					<Button isSecondary onClick={ launchPreview }>
						{ __( 'Preview', 'templates-patterns-collection' ) }
					</Button>
					{ ! upsell && (
						<Button
							isPrimary
							className="import"
							onClick={ launchImport }
						>
							{ __( 'Import', 'templates-patterns-collection' ) }
						</Button>
					) }
					{ ! has_templates && upsell && (
						<Button
							isLink
							className="templates"
							target="_blank"
							href="https://themeisle.com/themes/neve/upgrade/?utm_medium=nevedashboard&utm_source=wpadmin&utm_campaign=templatecloud&utm_content=neve"
						>
							{ __(
								'Unlock access with Business plan',
								'templates-patterns-collection'
							) }
						</Button>
					) }
					{ has_templates && (
						<Button
							isLink
							className="templates"
							onClick={ ( e ) => {
								e.preventDefault();
								setSite();
								setImportingPages();
							} }
						>
							{ __(
								'View Pages',
								'templates-patterns-collection'
							) }
						</Button>
					) }
				</div>
				{ screenshot && (
					<div
						className="image"
						style={ {
							backgroundImage: `url("${ screenshot }")`,
						} }
					/>
				) }
			</div>
			<div className="bottom">
				<p className="title">{ title }</p>
				{ upsell && (
					<span className="pro-badge">
						<Dashicon icon="lock" size={ 15 } />
						<span>
							{ __( 'Premium', 'templates-patterns-collection' ) }
						</span>
					</span>
				) }
			</div>
		</div>
	);
};

export default compose(
	withDispatch( ( dispatch, { data } ) => {
		const { slug } = data;
		const {
			setCurrentSite,
			setPreviewStatus,
			setImportModalStatus,
			setSingleTemplateImport,
		} = dispatch( 'neve-onboarding' );
		return {
			setSite: () => setCurrentSite( data ),
			setPreview: ( status ) => setPreviewStatus( status ),
			setModal: ( status ) => setImportModalStatus( status ),
			setImportingPages: () => setSingleTemplateImport( slug ),
		};
	} )
)( StarterSiteCard );
