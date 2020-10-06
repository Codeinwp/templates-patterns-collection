/* global tiobDash */
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Button, Dashicon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const PreviewFrame = ( {
	next,
	prev,
	siteData,
	setSite,
	setPreview,
	setModal,
	themeStatus,
	setInstallModal,
} ) => {
	const { isRTL } = tiobDash;

	const handleImport = ( e ) => {
		e.preventDefault();
		if ( themeStatus ) {
			setInstallModal( true );

			return false;
		}
		setModal( true );
	};
	const handleNext = ( e ) => {
		e.preventDefault();
		setSite( next );
	};
	const handlePrev = ( e ) => {
		e.preventDefault();
		setSite( prev );
	};
	const handleClose = ( e ) => {
		e.preventDefault();
		setPreview( false );
		setSite( null );
	};

	return (
		<div className="ob-preview">
			<div className="preview">
				<iframe src={ siteData.url } frameBorder="0" />
				<div className="loading">
					<Dashicon icon="update" size={ 50 } />
				</div>
			</div>
			<div className="bottom-bar">
				<div className="navigator">
					<Button
						onClick={ handleClose }
						className="close"
						label={ __( 'Close', 'neve' ) }
						icon="no"
					/>

					{ prev && (
						<Button
							onClick={ handlePrev }
							className="prev"
							label={ __( 'Previous', 'neve' ) }
							icon={
								isRTL ? 'arrow-right-alt2' : 'arrow-left-alt2'
							}
						/>
					) }

					{ next && (
						<Button
							onClick={ handleNext }
							className="next"
							label={ __( 'Next', 'neve' ) }
							icon={
								isRTL ? 'arrow-left-alt2' : 'arrow-right-alt2'
							}
						/>
					) }
				</div>
				<div className="actions">
					{ siteData.upsell ? (
						<Button
							className="upgrade"
							isPrimary
							href={
								siteData.utmOutboundLink || tiobDash.upgradeURL
							}
						>
							{ __( 'Upgrade and Import', 'neve' ) }
						</Button>
					) : (
						<Button
							className="import"
							isPrimary
							onClick={ handleImport }
						>
							{ __( 'Import', 'neve' ) }
						</Button>
					) }
				</div>
			</div>
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getCurrentSite, getThemeAction } = select( 'neve-onboarding' );
		return {
			siteData: getCurrentSite(),
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
)( PreviewFrame );
