import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useEffect } from '@wordpress/element';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import Toast from '../Toast';
import Filters from '../Filters';
import Sites from '../Sites';
import EditorSelector from '../EditorSelector';
import SVG from '../../utils/svg';

const SiteList = ( { showToast, setShowToast, setFetching, userStatus } ) => {
	const toastMessage = createInterpolateElement(
		__(
			'Unlock Access to all premium templates with Neve PRO. <a></a>.',
			'templates-patterns-collection'
		),
		{
			a: (
				<a
					href="https://themeisle.com/themes/neve/upgrade/"
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
		<div className="ob-container wide">
			<div className="ob-title-wrap">
				<h1>
					{ __( 'Choose a design', 'templates-patterns-collection' ) }
				</h1>
				<EditorSelector />
			</div>
			<Filters />
			<Sites />
			{ ! userStatus && (
				<Toast
					setShowToast={ setShowToast }
					svgIcon={ SVG.logo }
					className={ showToast === true ? 'show' : '' }
					message={ toastMessage }
				/>
			) }
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getUserStatus } = select( 'ti-onboarding' );
		return {
			userStatus: getUserStatus(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setFetching } = dispatch( 'ti-onboarding' );
		return {
			setFetching,
		};
	} )
)( SiteList );
