import { withDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { Tooltip, Button } from '@wordpress/components';

import SVG from '../utils/svg';

const Header = ( { handleLogoClick, importing } ) => {
	return (
		<div className="ob-header">
			<Button
				onClick={ handleLogoClick }
				disabled={ importing }
				style={ { opacity: 1 } }
			>
				{ SVG.logo }
			</Button>
			<Button
				label={ __( 'Exit to dashboard', 'neve' ) }
				href="/wp-admin"
				isLink
				disabled={ importing }
			>
				{ SVG.close }
			</Button>
		</div>
	);
};

export default withDispatch( ( dispatch ) => {
	const { setOnboardingStep } = dispatch( 'ti-onboarding' );
	return {
		handleLogoClick: () => {
			setOnboardingStep( 1 );
		},
	};
} )( Header );
