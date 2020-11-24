/* global tiobDash */

import { Button, Modal } from '@wordpress/components';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { get } from '../utils/rest';

const InstallModal = ( {
	setImportModal,
	setInstallModal,
	themeData,
	setThemeAction,
	singleImport,
	showTemplateModal,
} ) => {
	const { action, slug, nonce } = themeData;
	const { themesURL, brandedTheme } = tiobDash;
	const [ installing, setInstalling ] = useState( false );
	const [ error, setError ] = useState( null );
	const handleDismiss = () => {
		setInstallModal( false );
	};

	const handleError = ( message ) => {
		setInstalling( false );
		setError(
			sprintf(
				// translators: %s: Error message.
				__(
					'An error has ocurred: %s',
					'templates-patterns-collection'
				),
				message
			)
		);
	};

	const handleInstall = () => {
		setInstalling( 'installing' );
		wp.updates.installTheme( {
			slug: 'neve',
			success: () => {
				setThemeAction( { ...themeData, action: 'activate' } );
				handleActivate();
			},
			error: ( err ) => {
				setThemeAction( { ...themeData, action: 'activate' } );
				handleError(
					err.errorMessage ||
						__(
							'Could not install theme.',
							'templates-patterns-collection'
						)
				);
			},
		} );
	};

	const handleActivate = () => {
		setInstalling( 'activating' );
		const url = `${ themesURL }?action=activate&stylesheet=${ slug }&_wpnonce=${ nonce }`;
		get( url, true ).then( ( response ) => {
			if ( response.status !== 200 ) {
				handleError(
					__(
						'Could not activate theme.',
						'templates-patterns-collection'
					)
				);
				setInstalling( false );
				return false;
			}
			setInstalling( false );
			setInstallModal( false );
			setThemeAction( false );
			if ( singleImport ) {
				showTemplateModal();
				return false;
			}
			setImportModal( true );
		} );
	};

	return (
		<Modal
			className="ob-import-modal install-modal"
			title={ __(
				'Install and Activate Neve',
				'templates-patterns-collection'
			) }
			onRequestClose={ handleDismiss }
			shouldCloseOnClickOutside={ ! installing }
			isDismissible={ ! installing }
		>
			<div className="modal-body" style={ { textAlign: 'center' } }>
				{ ! brandedTheme && (
					<img
						style={ { width: 75 } }
						src={ `${ tiobDash.assets }/img/logo.svg` }
						alt={ __( 'Logo', 'templates-patterns-collection' ) }
					/>
				) }
				{ error && (
					<div className="well error" style={ { margin: '20px 0' } }>
						{ error }
					</div>
				) }
				<p
					style={ {
						lineHeight: 1.6,
						fontSize: '15px',
					} }
				>
					{ __(
						'In order to import the starter site, Neve theme has to be installed and activated. Click the button below to install and activate Neve',
						'templates-patterns-collection'
					) }
				</p>
			</div>
			<div
				className="modal-footer"
				style={ { justifyContent: 'center' } }
			>
				<div className="actions" style={ { display: 'flex' } }>
					{ ! error && (
						<Button
							dismiss={ error }
							isPrimary
							disabled={ installing }
							className={ installing && 'is-loading' }
							icon={ installing && 'update' }
							onClick={
								action === 'install'
									? handleInstall
									: handleActivate
							}
						>
							{ installing &&
								( installing === 'installing'
									? __( 'Installing' )
									: __( 'Activating' ) ) }

							{ ! installing &&
								( action === 'install'
									? __(
										'Install and Activate',
										'templates-patterns-collection'
									  )
									: __(
											'Activate',
											'templates-patterns-collection'
									  ) ) }
						</Button>
					) }
					<Button
						style={ { marginLeft: 30 } }
						isSecondary
						disabled={ installing }
						onClick={ handleDismiss }
					>
						{ __( 'Close', 'templates-patterns-collection' ) }
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getSingleImport, getThemeAction } = select( 'neve-onboarding' );

		return {
			themeData: getThemeAction() || false,
			singleImport: getSingleImport(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setImportModalStatus,
			setInstallModalStatus,
			setThemeAction,
			setTemplateModal,
		} = dispatch( 'neve-onboarding' );
		return {
			setImportModal: ( status ) => setImportModalStatus( status ),
			setInstallModal: ( status ) => setInstallModalStatus( status ),
			setThemeAction: ( status ) => setThemeAction( status ),
			showTemplateModal: () => setTemplateModal( true ),
		};
	} )
)( InstallModal );
