/* eslint-disable camelcase */
import { withDispatch, withSelect } from '@wordpress/data';
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
	themeStatus,
	setInstallModal,
	setImportingPages,
} ) => {
	const { upsell, slug, screenshot, title, has_templates } = data;
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

		if ( themeStatus ) {
			setInstallModal( true );

			return false;
		}
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
	withSelect( ( select ) => {
		const { getThemeAction } = select( 'neve-onboarding' );

		return {
			themeStatus: getThemeAction().action || false,
		};
	} ),
	withDispatch( ( dispatch, { data } ) => {
		const { slug } = data;
		const {
			setCurrentSite,
			setPreviewStatus,
			setImportModalStatus,
			setInstallModalStatus,
			setSingleTemplateImport,
		} = dispatch( 'neve-onboarding' );
		return {
			setSite: () => setCurrentSite( data ),
			setPreview: ( status ) => setPreviewStatus( status ),
			setModal: ( status ) => setImportModalStatus( status ),
			setInstallModal: ( status ) => setInstallModalStatus( status ),
			setImportingPages: () => setSingleTemplateImport( slug ),
		};
	} )
)( StarterSiteCard );
