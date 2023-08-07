import SVG from '../../utils/svg';

import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';

const Header = () => {
	return (
		<div className="ti-onboarding-header">
			<div>{ SVG.logo }</div>
			<Tooltip text={ __( 'Exit to dashboard', 'neve' ) }>
				<a href="/wp-admin/">{ SVG.close }</a>
			</Tooltip>
		</div>
	);
};

export default Header;
