import { Button } from '@wordpress/components';

const ImportModalMock = ( {} ) => (
	<>
		<div className="modal-body">
			<div className="header">
				<span
					className="title is-loading"
					style={ { height: 35, marginBottom: 20 } }
				/>
				<p
					className="description is-loading"
					style={ { height: 20 } }
				/>
				<p
					className="description is-loading"
					style={ { height: 20, marginBottom: 20 } }
				/>
			</div>
			<div className="well is-loading">
				<span className="title is-loading" style={ { height: 20 } } />
				<ol>
					<li />
					<li />
					<li />
				</ol>
			</div>

			<div className="modal-toggles components-panel">
				{ [ 1, 2 ].map( ( i ) => (
					<div
						key={ i }
						className="components-panel__body options general is-opened"
					>
						<span className="title is-loading" />
						<ul>
							{ [ 1, 2, 3 ].map( ( idx ) => (
								<li className="option-row" key={ idx }>
									<div className="mock-icon is-loading" />
									<span className="is-loading" />
									<div className="toggle is-loading" />
								</li>
							) ) }
						</ul>
					</div>
				) ) }
			</div>
		</div>
		<div className="modal-footer">
			<span className="link is-loading" />
			<Button isPrimary className="import is-loading" />
		</div>
	</>
);

export default ImportModalMock;
