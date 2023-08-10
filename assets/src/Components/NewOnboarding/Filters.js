import { __ } from '@wordpress/i18n';
import { ONBOARDING_CAT } from '../../utils/common';
import Search from './Search';
import CategoryButtons from './CategoryButtons';

const categories = {
	all: __( 'All', 'templates-patterns-collection' ),
	...ONBOARDING_CAT,
};

const Filters = () => {
	return (
		<div className="ob-filters-container">
			<Search />
			<CategoryButtons categories={ categories } />
		</div>
	);
};

export default Filters;
