import classnames from 'classnames';
import Onboarding from './Onboarding';

const App = () => {
	const wrapClasses = classnames( [
		'content-wrap',
		'starter-sites',
		'is-onboarding',
	] );

	return (
		<div className={ wrapClasses }>
			<div className="main">
				<Onboarding />
			</div>
		</div>
	);
};

export default App;
