/* global tiobDash */
import { withSelect, withDispatch } from '@wordpress/data';
import { Button, Dashicon } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { __, isRTL } from '@wordpress/i18n';
import { close, chevronRight, chevronLeft } from '@wordpress/icons';

const PreviewFrame = ( {
	next,
	prev,
	siteData,
	setSite,
	setPreview,
	setModal,
} ) => {
	const handleImport = ( e ) => {
		e.preventDefault();
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
						label={ __( 'Close', 'templates-patterns-collection' ) }
						icon={ close }
					/>

					{ prev && (
						<Button
							onClick={ handlePrev }
							className="prev"
							label={ __(
								'Previous',
								'templates-patterns-collection'
							) }
							icon={ isRTL() ? chevronRight : chevronLeft }
						/>
					) }

					{ next && (
						<Button
							onClick={ handleNext }
							className="next"
							label={ __(
								'Next',
								'templates-patterns-collection'
							) }
							icon={ isRTL() ? chevronLeft : chevronRight }
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
							{ __(
								'Upgrade and Import',
								'templates-patterns-collection'
							) }
						</Button>
					) : (
						<Button
							className="import"
							isPrimary
							onClick={ handleImport }
						>
							{ __( 'Import', 'templates-patterns-collection' ) }
						</Button>
					) }
				</div>
			</div>
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getCurrentSite } = select( 'neve-onboarding' );
		return {
			siteData: getCurrentSite(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setCurrentSite,
			setPreviewStatus,
			setImportModalStatus,
		} = dispatch( 'neve-onboarding' );
		return {
			setSite: ( data ) => setCurrentSite( data ),
			setPreview: ( status ) => setPreviewStatus( status ),
			setModal: ( status ) => setImportModalStatus( status ),
		};
	} )
)( PreviewFrame );
