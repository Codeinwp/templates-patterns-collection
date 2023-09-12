/* global tiobDash, fetch */
/* eslint-disable no-console */
import { __ } from '@wordpress/i18n';
import { TextControl, Button, SelectControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { ajaxAction } from '../utils/rest';

const ImportForm = () => {
	const [ email, setEmail ] = useState( tiobDash.emailSubscribe.email || '' );
	const [ userLevel, setUserLevel ] = useState( '' );
	const [ buildingFor, setBuildingFor ] = useState( '' );
	const [ processingSub, setProcessingSub ] = useState( false );

	const userLevelMap = [
		{
			disabled: true,
			label: __( 'I am a…', 'templates-patterns-collection' ),
			value: '',
		},
		{
			label: __( 'Beginner', 'templates-patterns-collection' ),
			value: 'beginner',
		},
		{
			label: __( 'Intermediate', 'templates-patterns-collection' ),
			value: 'intermediate',
		},
		{
			label: __( 'Expert', 'templates-patterns-collection' ),
			value: 'expert',
		},
	];
	const buildingForMap = [
		{
			disabled: true,
			label: __(
				'I build this site for…',
				'templates-patterns-collection'
			),
			value: '',
		},
		{
			label: __( 'Myself', 'templates-patterns-collection' ),
			value: 'myself',
		},
		{
			label: __( 'My Company', 'templates-patterns-collection' ),
			value: 'company',
		},
		{
			label: __( 'My Client', 'templates-patterns-collection' ),
			value: 'client',
		},
	];

	const site = tiobDash.onboarding.homeUrl || '';

	const viewWebsiteAndSubscribe = () => {
		setProcessingSub( true );

		ajaxAction(
			tiobDash.onboardingDone.ajaxURL,
			'mark_onboarding_done',
			tiobDash.onboardingDone.nonce
		);

		fetch( 'https://api.themeisle.com/tracking/subscribe', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( {
				slug: 'templates-patterns-collection',
				site,
				email,
				userLevel,
				buildingFor,
			} ),
		} )
			.then( ( r ) => r.json() )
			.catch( ( error ) => {
				console.error( error );
			} )
			.finally( () => {
				ajaxAction(
					tiobDash.onboardingDone.ajaxURL,
					'mark_onboarding_done',
					tiobDash.onboardingDone.nonce
				).then( () => {
					window.location.href = site;
				} );
			} );
	};

	const handleSkip = () => {
		setProcessingSub( true );
		ajaxAction(
			tiobDash.onboardingDone.ajaxURL,
			'mark_onboarding_done',
			tiobDash.onboardingDone.nonce
		).then( () => {
			window.location.href = site;
		} );
	};

	return (
		<>
			<p>
				{ __(
					'You\'re all set. Tell us a bit about yourself.',
					'templates-patterns-collection'
				) }
			</p>
			<form
				className="ob-subscribe-form"
				onSubmit={ viewWebsiteAndSubscribe }
			>
				<div className="ob-form-wrap">
					<TextControl
						aria-label={ __(
							'Enter your email',
							'templates-patterns-collection'
						) }
						type="email"
						value={ email }
						onChange={ setEmail }
					/>
					<SelectControl
						className="ob-select"
						options={ userLevelMap }
						value={ userLevel }
						onChange={ setUserLevel }
					/>
					<SelectControl
						className="ob-select"
						options={ buildingForMap }
						value={ buildingFor }
						onChange={ setBuildingFor }
					/>
				</div>
				<div className="ob-done-actions">
					<Button
						type="submit"
						isPrimary
						className="ob-button full"
						disabled={
							processingSub ||
							( ! email && ! userLevel && ! buildingFor )
						}
					>
						{ __(
							'Submit and view site',
							'templates-patterns-collection'
						) }
					</Button>
					<Button
						isLink
						className="close is-grayed"
						disabled={ processingSub }
						onClick={ handleSkip }
					>
						{ __(
							'Skip and view site',
							'templates-patterns-collection'
						) }
					</Button>
				</div>
			</form>
		</>
	);
};

export default ImportForm;
