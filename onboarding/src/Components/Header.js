/* global tiobDash */
import { withDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

import SVG from '../utils/svg';

const Header = ( { handleLogoClick, importing } ) => {
	const { brandedTheme } = tiobDash;
	return (
		<div className="ob-header">
			<Button
				onClick={ handleLogoClick }
				disabled={ importing }
				style={ { opacity: 1 } }
			>
				{ ! brandedTheme ? (
					SVG.logo
				) : (
					<h2 style={ { margin: 0 } }>
						{ __(
							'Import Templates',
							'templates-patterns-collection'
						) }
					</h2>
				) }
			</Button>
			<Button
				label={ __(
					'Exit to dashboard',
					'templates-patterns-collection'
				) }
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
