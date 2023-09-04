import { __ } from '@wordpress/i18n';
import CategoryButtons from '../CategoryButtons';
import Search from '../Search';
import { ONBOARDING_CAT } from '../../utils/common';

const Welcome = () => {
	return (
		<div className="ob-container narrow">
			<h1>
				{ __(
					'What type of website are you creating?',
					'templates-patterns-collection'
				) }
			</h1>
			<p>
				{ __(
					'Pick a category and we will provide you with relevant suggestions so you can find the starter site that works best for you.',
					'templates-patterns-collection'
				) }
			</p>
			<CategoryButtons
				categories={ ONBOARDING_CAT }
				style={ { margin: '26px 0' } }
			/>
			<div className="ob-search-container">
				<Search
					label={ __(
						'Or search for a site',
						'templates-patterns-collection'
					) }
				/>
			</div>
		</div>
	);
};

export default Welcome;
