const ProgressBar = ( props ) => {
	const { completed } = props;

	const fillerStyles = {
		width: `${ completed }%`,
	};

	return (
		<div className="ob-progress-bar-wrap">
			<div className="ob-fill" style={ fillerStyles } />
		</div>
	);
};

export default ProgressBar;
