const WelcomeMock = ( {} ) => (
	<div className="fetching">
		<span
			className="title is-loading"
			style={ { width: 550, height: 35, marginBottom: 20 } }
		/>
		<span
			className="title is-loading"
			style={ { width: 200, height: 35, marginBottom: 20 } }
		/>
		<p className="description is-loading" style={ { height: 20 } } />
		<p
			className="description is-loading"
			style={ { height: 20, marginBottom: 20 } }
		/>
		<div
			className="ob-ctrl-wrap font"
			style={ { justifyContent: 'flex-start' } }
		>
			<p
				className="description is-loading"
				style={ { height: 40, marginBottom: 10, width: '30%' } }
			/>
			<p
				className="description is-loading"
				style={ { height: 40, marginBottom: 10, width: '30%' } }
			/>
			<p
				className="description is-loading"
				style={ { height: 40, marginBottom: 10, width: '30%' } }
			/>
			<p
				className="description is-loading"
				style={ { height: 40, marginBottom: 10, width: '30%' } }
			/>
			<p
				className="description is-loading"
				style={ { height: 40, marginBottom: 10, width: '30%' } }
			/>
		</div>

		<div className="ob-ctrl">
			<p
				className="description is-loading"
				style={ { height: 20, marginBottom: 20, width: 100 } }
			/>
			<div className="ob-ctrl-head">
				<span className="title is-loading" style={ { height: 35 } } />
			</div>
		</div>
	</div>
);

export default WelcomeMock;
