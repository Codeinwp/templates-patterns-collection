import { Icon, info } from '@wordpress/icons';

import classnames from 'classnames';

const CustomTooltip = ( {
	children,
	className,
	toLeft = false,
	rightOffset = 0,
} ) => {
	const tooltipClassNames = classnames( [ className, 'ob-tooltip-wrap' ] );

	const ttStyle = toLeft ? { right: rightOffset, left: 'unset' } : {};

	return (
		<div className={ tooltipClassNames }>
			<div className="ob-tooltip-toggle">
				<Icon icon={ info } size={ 24 } />
				<div className="ob-tooltip-content" style={ ttStyle }>
					{ children }
				</div>
			</div>
		</div>
	);
};

export default CustomTooltip;
