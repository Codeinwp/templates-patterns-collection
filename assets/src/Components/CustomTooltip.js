import { Button, Icon } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { info } from '@wordpress/icons';

import classnames from 'classnames';

const CustomTooltip = ( { children, className } ) => {
	const tooltipClassNames = classnames( [ className, 'tiob-tooltip-wrap' ] );

	return (
		<div className={ tooltipClassNames }>
			<Button
				onClick={ ( e ) => {
					e.preventDefault();
				} }
				className="tiob-tooltip-toggle"
				icon={ info }
				isLink
				isSmall
			/>
			<div className="tiob-tooltip-content">{ children }</div>
		</div>
	);
};

export default CustomTooltip;
