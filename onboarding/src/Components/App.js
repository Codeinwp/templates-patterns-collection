import { withSelect } from '@wordpress/data';
import classnames from 'classnames';
import Onboarding from './Onboarding';

const App = () => {
	const wrapClasses = classnames( [
		'content-wrap',
		'starter-sites',
		'is-onboarding',
	] );

	return (
		<div className="tiob-wrap">
			<div className={ wrapClasses }>
				<div className="container content">
					<div className="main">
						<div className="tab-content columns starter-sites">
							<Onboarding />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default App;
