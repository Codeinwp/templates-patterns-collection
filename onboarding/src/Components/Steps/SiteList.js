/* global tiobDash */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useEffect } from '@wordpress/element';
import { withDispatch } from '@wordpress/data';
import Toast from '../Toast';
import Filters from '../Filters';
import Sites from '../Sites';
import EditorSelector from '../EditorSelector';
import SVG from '../../utils/svg';

const SiteList = ( { showToast, setShowToast, setFetching } ) => {
	const toastMessage = createInterpolateElement(
		__(
			'Unlock Access to all premium templates with Neve Business plan. <a></a>.',
			'templates-patterns-collection'
		),
		{
			a: (
				<a
					href={ tiobDash.onboardingUpsell.upgradeToast }
					target="_blank"
					rel="external noreferrer noopener"
				>
					{ __( 'Get Started', 'templates-patterns-collection' ) }
				</a>
			),
		}
	);

	const handleShowToast = () => {
		if ( showToast === 'dismissed' ) {
			return;
		}

		// Automatically hide the toast after a certain duration (e.g., 5 seconds)
		setTimeout( () => {
			setShowToast( true );
		}, 1000 );
	};

	useEffect( () => {
		handleShowToast();
		setFetching( true );
	}, [] );

	return (
		<div className="ob-container">
			<div className="ob-container-inner">
				<div className="ob-title-wrap">
					<h1>
						{ __( 'Choose a design', 'templates-patterns-collection' ) }
				</h1>
				<EditorSelector />
			</div>
			<Filters />
			<Sites />
			{ ! tiobDash.isValidLicense && (
				<Toast
					setShowToast={ setShowToast }
					svgIcon={ SVG.logo }
					className={ showToast === true ? 'show' : '' }
					message={ toastMessage }
				/>
			) }
			</div>
		</div>
	);
};

export default withDispatch( ( dispatch ) => {
	const { setFetching } = dispatch( 'ti-onboarding' );
	return {
		setFetching,
	};
} )( SiteList );
