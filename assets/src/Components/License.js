import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import Card from './Card';
import {
	ExternalLink,
	TextControl,
	Button,
	Notice,
	Icon,
} from '@wordpress/components';
import { models } from '@wordpress/api';
import { fetchLibrary as licenseCheck } from './CloudLibrary/common';

const License = ( { setLicense, license } ) => {
	const keyValue = license?.key !== '' && license?.key !== 'free' ? license?.key : '';
	const [ licenseKey, setLicenseKey ] = useState( keyValue );
	const [ loading, setLoading ] = useState( false );
	const [ resultMsg, setResultMsg ] = useState( {} );


	const isValid = 'valid' === license?.valid || 'valid' === license?.license;

	const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

	const createNotice = (type, message) => {
		setResultMsg({type, message});

		delay(3000).then(()=>setResultMsg({}));
	}

	const updateKey = ( value ) => {
		const optionName = 'templates_patterns_collection_license';
		const model = new models.Settings({
			[optionName]: value,
		});

		return new Promise((resolve) => {
			model.save().then((r) => {
				if (!r || !r[optionName] === value) {
					resolve({ success: false });
				}
				resolve({ success: true });
			});
		});
	}

	const onSaveLicense = async ( data ) => {
		setLoading( true );
		if ( data.action === 'deactivate' ) {
			setLicense( {
				key: 'free',
				valid: 'invalid',
				expiration: '',
				tier: 0,
			} );
			setLicenseKey('');
			await updateKey( '' );
			setLoading( false );
			return;
		}

		const { success, templates } = await licenseCheck( false, { license_id: data.key, license_check: 1 } );

		if ( success ) {
			setLicense( templates );
			await updateKey( data.key );
		} else {
			createNotice(
				'error',
				__( 'Can not activate this license!', 'templates-patterns-collection' ),
			);
		}
		setLoading( false );
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
			{ 'Verified - Expires at'} { new Date( license.expires ).toDateString() }
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
				Themeisle
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
		const { setLicense } = dispatch( 'neve-onboarding' );

		return {
			setLicense,
		};
	} ),
	withSelect( ( select ) => {
		const { getLicense } = select( 'neve-onboarding' );

		return {
			license: getLicense(),
		};
	} )
)( License );
