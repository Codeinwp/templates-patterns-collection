import { Icon, info } from '@wordpress/icons';

import classnames from 'classnames';

const CustomTooltip = ( { children, className, toLeft = false } ) => {
	const tooltipClassNames = classnames( [ className, 'tiob-tooltip-wrap' ] );

	const ttStyle = toLeft ? { right: 0, left: 'unset' } : {};

	return (
		<div className={ tooltipClassNames }>
			<div className="tiob-tooltip-toggle">
				<Icon icon={ info } size={ 24 } />
				<div className="tiob-tooltip-content" style={ ttStyle }>
					{ children }
				</div>
			</div>
		</div>
	);
};

export default CustomTooltip;
