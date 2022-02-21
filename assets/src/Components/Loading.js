const Loading = ( { isGrid } ) => {
	return (
		<div className="table">
			{ [ 1, 2, 3, 4, 5, 6, 7, 8 ].map( ( i ) => {
				if ( isGrid ) {
					return (
						<div key={ i } className="table-grid">
							<div className="grid-preview image is-loading" />
							<div className="card-footer">
								<p className="title loading" style={ {
									height: 14,
									backgroundColor: '#f3f3f3',
								} } />
							</div>
						</div>
					)
				}
				return (
					<div key={ i } className="table-row">
						<p className="title loading" style={ {
							width: '100%',
							height: 14,
							background: 'linear-gradient(to right, #f3f3f3, #ffffff)',
						} } />
					</div>
				);
			} ) }
		</div>
	);
};

export default Loading;
