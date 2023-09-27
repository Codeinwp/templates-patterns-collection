import { Button } from '@wordpress/components';

const ImportMock = ( {} ) => (
	<>
		<div className="ob-site-settings-container">
			<div className="ob-settings-wrap">
				<div className="ob-settings-top" style={ { gap: 0 } }>
					<p
						className="top-link is-loading"
						style={ { height: 20, marginBottom: 10, width: 50 } }
					/>
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
					<div className="ob-ctrl">
						<div className="ob-ctrl-head">
							<span
								className="title is-loading"
								style={ { height: 35 } }
							/>
							<span className="revert is-loading"></span>
						</div>
						<div className="ob-ctrl-wrap">
							<p
								className="description is-loading"
								style={ { height: 30, marginBottom: 10 } }
							/>
							<p
								className="description is-loading"
								style={ { height: 30, marginBottom: 10 } }
							/>
							<p
								className="description is-loading"
								style={ { height: 30, marginBottom: 10 } }
							/>
						</div>
					</div>

					<div className="ob-ctrl">
						<div className="ob-ctrl-head">
							<span
								className="title is-loading"
								style={ { height: 35 } }
							/>
							<span className="revert is-loading"></span>
						</div>
						<div className="ob-ctrl-wrap font">
							<p
								className="description is-loading"
								style={ { height: 30, marginBottom: 10 } }
							/>
							<p
								className="description is-loading"
								style={ {
									height: 40,
									marginBottom: 10,
									width: '30%',
								} }
							/>
							<p
								className="description is-loading"
								style={ {
									height: 40,
									marginBottom: 10,
									width: '30%',
								} }
							/>
							<p
								className="description is-loading"
								style={ {
									height: 40,
									marginBottom: 10,
									width: '30%',
								} }
							/>
							<p
								className="description is-loading"
								style={ {
									height: 40,
									marginBottom: 10,
									width: '30%',
								} }
							/>
							<p
								className="description is-loading"
								style={ {
									height: 40,
									marginBottom: 10,
									width: '30%',
								} }
							/>
							<p
								className="description is-loading"
								style={ {
									height: 40,
									marginBottom: 10,
									width: '30%',
								} }
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div className="ob-settings-bottom">
			<Button isPrimary className="import is-loading" />
		</div>
	</>
);

export default ImportMock;
