import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withDispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import Card from './Card';
import {
	ExternalLink,
	TextControl,
	Button,
	Notice,
	Icon,
} from '@wordpress/components';

const License = ( { setLicenseStatus } ) => {
	const [ license, setLicense ] = useState( window.tiobDash.licenseTIOB );
	const [ licenseKey, setLicenseKey ] = useState( '' );
	const [ loading, setLoading ] = useState( false );
	const [ resultMsg, setResultMsg ] = useState( {} );

	useEffect( () => {
		if (
			license.key &&
			( 'valid' === license.valid || 'active_expired' === license.valid )
		) {
			setLicenseKey( license.key );
		}
	}, [ license ] );

	const isValid = 'valid' === license?.valid || 'valid' === license?.license;

	const delay = ( time ) =>
		new Promise( ( resolve ) => setTimeout( resolve, time ) );

	const createNotice = ( type, message ) => {
		setResultMsg( { type, message } );

		delay( 3000 ).then( () => setResultMsg( {} ) );
	};

	const onSaveLicense = ( data ) => {
		setLoading( true );
		apiFetch( {
			path: 'ti-sites-lib/v1/toggle_license',
			method: 'POST',
			data,
		} )
			.then( ( res ) => {
				setLoading( false );
				createNotice( res.success ? 'success' : 'error', res.message );

				if (
					res?.success &&
					res.license &&
					'free' !== res.license.key
				) {
					setLicense( res.license );
					setLicenseKey( res.license.key );
					setLicenseStatus( res.license.valid );
					window.tiobDash.licenseTIOB = res.license;
					console.log( res.license );
					console.log( window.tiobDash.licenseTIOB );
				} else {
					window.tiobDash.licenseTIOB = res.license;
					setLicense( {} );
					setLicenseKey( '' );
				}
			} )
			.catch( ( err ) => {
				setLoading( false );
				console.log( err );
			} );
	};

	const toggleLicense = ( event ) => {
		onSaveLicense( {
			action: isValid ? 'deactivate' : 'activate',
			key: licenseKey,
		} );

		event.preventDefault();
	};

	const licenseStatusMsg = isValid ? (
		<>
			<Icon size={ 32 } className="verified" icon="yes-alt" />{ ' ' }
			{ 'Verified - Expires at' } { license.expiration }
		</>
	) : (
		''
	);

	const renderResultMsg =
		Object.keys( resultMsg ).length > 0 ? (
			<Notice isDismissible={ false } status={ resultMsg.type }>
				{ resultMsg.message }
			</Notice>
		) : (
			''
		);

	const children = () => (
		<>
			<form onSubmit={ toggleLicense }>
				<TextControl
					disabled={ isValid }
					onChange={ setLicenseKey }
					value={
						isValid
							? '******************************' +
							  licenseKey.slice( -5 )
							: licenseKey
					}
				/>
				<Button
					className="components-button is-primary"
					disabled={ loading }
					type="submit"
					variant="primary"
				>
					{ isValid
						? __( 'Deactivate', 'templates-patterns-collection' )
						: __( 'Activate', 'templates-patterns-collection' ) }
				</Button>
			</form>

			<div className="info">{ licenseStatusMsg }</div>
			{ renderResultMsg }
		</>
	);

	const description = () => (
		<>
			<span>Enter your license from </span>
			<ExternalLink href="https://store.themeisle.com/login/">
				ThemeIsle
			</ExternalLink>
			<span> purchase history in order to get plugin updates</span>
		</>
	);

	return (
		<Card
			classNames={ 'license' }
			title={
				'Templates Collection ' +
				__( 'License', 'templates-patterns-collection' )
			}
			description={ description() }
			children={ children() }
		/>
	);
};

export default compose(
	withDispatch( ( dispatch ) => {
		const { setLicenseStatus } = dispatch( 'neve-onboarding' );

		return {
			setLicenseStatus,
		};
	} )
)( License );
