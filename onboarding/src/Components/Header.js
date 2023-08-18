import { withDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { Tooltip, Button } from '@wordpress/components';

import SVG from '../utils/svg';

const Header = ( { handleLogoClick } ) => {
	return (
		<div className="ob-header">
			<Button onClick={ handleLogoClick }>{ SVG.logo }</Button>
			<Tooltip text={ __( 'Exit to dashboard', 'neve' ) }>
				<a href="/wp-admin/">{ SVG.close }</a>
			</Tooltip>
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
