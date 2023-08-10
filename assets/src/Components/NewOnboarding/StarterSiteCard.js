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
	handleNextStep,
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

	const launchPreview = () => {
		setSite();
		handleNextStep();
	};

	return (
		<div className="ss-card-wrap">
			<div className="ss-card">
				{ upsell && (
					<span className="ss-badge">
						<span>
							{ __( 'PRO', 'templates-patterns-collection' ) }
						</span>
					</span>
				) }

				<div className={ 'ss-actions ' + actionsClass }>
					<Button
						isPrimary
						className="ob-button"
						onClick={ launchPreview }
					>
						{ __( 'Select', 'templates-patterns-collection' ) }
					</Button>
				</div>

				{ screenshot && (
					<div
						className="ss-image"
						style={ {
							backgroundImage: `url("${ screenshot }")`,
						} }
					/>
				) }
			</div>
			<p className="ss-title">{ title }</p>
		</div>
		// <div
		// 	onMouseEnter={ showActions }
		// 	onMouseLeave={ hideActions }
		// 	className={ cardClassNames }
		// >
		// 	{ isNew && (
		// 		<span className="new-badge">
		// 			{ __(
		// 				'New',
		// 				'templates-patterns-collection'
		// 			).toUpperCase() }
		// 		</span>
		// 	) }
		// 	<div className="top">
		// 		{/*<div className={ 'actions ' + actionsClass }>*/}
		// 		{/*	<Button isSecondary onClick={ launchPreview }>*/}
		// 		{/*		{ __( 'Preview', 'templates-patterns-collection' ) }*/}
		// 		{/*	</Button>*/}
		// 		{/*	{ ! upsell && (*/}
		// 		{/*		<Button*/}
		// 		{/*			isPrimary*/}
		// 		{/*			className="import"*/}
		// 		{/*			onClick={ launchImport }*/}
		// 		{/*		>*/}
		// 		{/*			{ __( 'Import', 'templates-patterns-collection' ) }*/}
		// 		{/*		</Button>*/}
		// 		{/*	) }*/}

		// 		{/*</div>*/}
		// 		{ screenshot && (
		// 			<div
		// 				className="image"
		// 				style={ {
		// 					backgroundImage: `url("${ screenshot }")`,
		// 				} }
		// 			/>
		// 		) }
		// 	</div>
		// 	<p className="title">{ title }</p>
		// 	{ upsell && (
		// 		<span className="pro-badge">
		// 			<Dashicon icon="lock" size={ 15 } />
		// 			<span>
		// 				{ __( 'Premium', 'templates-patterns-collection' ) }
		// 			</span>
		// 		</span>
		// 	) }
		// </div>
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
			setOnboardingStep,
		} = dispatch( 'neve-onboarding' );
		return {
			setSite: () => setCurrentSite( data ),
			setPreview: ( status ) => setPreviewStatus( status ),
			setModal: ( status ) => setImportModalStatus( status ),
			setImportingPages: () => setSingleTemplateImport( slug ),
			handleNextStep: () => setOnboardingStep( 3 ),
		};
	} )
)( StarterSiteCard );
