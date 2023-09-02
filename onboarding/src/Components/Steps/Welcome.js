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
			<CategoryButtons categories={ ONBOARDING_CAT } />
			<div className="ob-search-container">
				<p>
					{ ' ' }
					{ __(
						'Or search for a site',
						'templates-patterns-collection'
					) }
				</p>
				<Search />
			</div>
		</div>
	);
};

export default Welcome;
