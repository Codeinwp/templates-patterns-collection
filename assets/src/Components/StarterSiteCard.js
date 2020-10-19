import { Button, Dashicon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { useState } from '@wordpress/element';

const StarterSiteCard = ( {
	data,
	setSite,
	setPreview,
	setModal,
	themeStatus,
	setInstallModal,
} ) => {
	const { upsell } = data;
	const [ actionsClass, setActionClass ] = useState( '' );

	const showActions = () => {
		setActionClass( 'visible' );
	};
	const hideActions = () => {
		setActionClass( '' );
	};

	const launchImport = ( e ) => {
		e.preventDefault();
		setSite( data );

		if ( themeStatus ) {
			setInstallModal( true );

			return false;
		}
		setModal( true );
	};

	const launchPreview = ( e ) => {
		e.preventDefault();
		setSite( data );
		setPreview( true );
	};

	return (
		<div
			onMouseEnter={ showActions }
			onMouseLeave={ hideActions }
			className="card starter-site-card"
		>
			<div className="top">
				<div className={ 'actions ' + actionsClass }>
					<Button className="preview" onClick={ launchPreview }>
						{ __( 'Preview', 'templates-patterns-collection' ) }
					</Button>
					{ ! upsell && (
						<Button className="import" onClick={ launchImport }>
							{ __( 'Import', 'templates-patterns-collection' ) }
						</Button>
					) }
				</div>
				{ data.screenshot && (
					<div
						className="image"
						style={ {
							backgroundImage: `url("${ data.screenshot }")`,
						} }
					/>
				) }
			</div>
			<div className="bottom">
				<p className="title">{ data.title }</p>
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
	withDispatch( ( dispatch ) => {
		const {
			setCurrentSite,
			setPreviewStatus,
			setImportModalStatus,
			setInstallModalStatus,
		} = dispatch( 'neve-onboarding' );
		return {
			setSite: ( data ) => setCurrentSite( data ),
			setPreview: ( status ) => setPreviewStatus( status ),
			setModal: ( status ) => setImportModalStatus( status ),
			setInstallModal: ( status ) => setInstallModalStatus( status ),
		};
	} )
)( StarterSiteCard );
