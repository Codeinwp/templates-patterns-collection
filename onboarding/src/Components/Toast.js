import classnames from 'classnames';

const Toast = ( { svgIcon, message, className, setShowToast } ) => {
	const handleClose = () => {
		setShowToast( 'dismissed' );
	};

	return (
		<div className={ classnames( 'ob-toast', className ) }>
			<div className="ob-toast-content">
				{ svgIcon && <div className="ob-toast-icon">{ svgIcon }</div> }
				{ message && <p>{ message }</p> }
			</div>
			<button className="ob-toast-close" onClick={ handleClose }>
				&times;
			</button>
		</div>
	);
};

export default Toast;
