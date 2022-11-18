import classnames from 'classnames';

const Card = ( props ) => {
	const {
		title,
		description,
		children,
		cardHeader,
		cardBottom,
		classNames,
	} = props;
	return (
		<>
			<div className={ classnames( [ 'card', classNames ] ) }>
				<div className="card-header">
					{ title && <h3 className="title">{ title }</h3> }
					{ cardHeader }
				</div>
				<div className="card-content">
					{ description && (
						<p className="card-description">{ description }</p>
					) }
					{ children }
				</div>
				{ cardBottom && (
					<div className="card-bottom">{ cardBottom }</div>
				) }
			</div>
		</>
	);
};

export default Card;
