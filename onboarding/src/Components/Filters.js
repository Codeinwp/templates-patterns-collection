import { __ } from '@wordpress/i18n';
import Search from './Search';
import CategoryButtons from './CategoryButtons';
import { ONBOARDING_CAT } from '../utils/common';

const Filters = () => {
	const categories = {
		all: __( 'All', 'templates-patterns-collection' ),
		free: __( 'Free', 'templates-patterns-collection' ),
		...ONBOARDING_CAT,
	};

	return (
		<div className="ob-filters-container">
			<Search />
			<CategoryButtons categories={ categories } />
		</div>
	);
};

export default Filters;
