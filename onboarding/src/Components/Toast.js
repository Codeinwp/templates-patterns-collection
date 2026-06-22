import classnames from 'classnames';
import { __ } from '@wordpress/i18n';

const Toast = ( { svgIcon, heading, message, className, setShowToast } ) => {
	const handleClose = () => {
		setShowToast( 'dismissed' );
	};

	return (
		<div
			className={ classnames( 'ob-toast', className ) }
			role="status"
			aria-live="polite"
		>
			{ svgIcon && (
				<span className="ob-toast-icon" aria-hidden="true">
					{ svgIcon }
				</span>
			) }
			<div className="ob-toast-content">
				{ heading && <p className="ob-toast-heading">{ heading }</p> }
				{ message && <p className="ob-toast-message">{ message }</p> }
			</div>
			<button
				type="button"
				className="ob-toast-close"
				onClick={ handleClose }
				aria-label={ __( 'Dismiss', 'templates-patterns-collection' ) }
			>
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
	);
};

export default Toast;
