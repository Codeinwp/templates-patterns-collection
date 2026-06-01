import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import Search from './Search';
import CategoryButtons from './CategoryButtons';
import { ONBOARDING_CAT } from '../utils/common';

const Filters = () => {
	const { sortBy, searchQuery, editor } = useSelect( ( select ) => ( {
		sortBy: select( 'ti-onboarding' ).getSortBy(),
		searchQuery: select( 'ti-onboarding' ).getSearchQuery(),
		editor: select( 'ti-onboarding' ).getCurrentEditor(),
	} ) );
	const { setSortBy } = useDispatch( 'ti-onboarding' );

	const categories = {
		all: __( 'All', 'templates-patterns-collection' ),
		free: __( 'Free', 'templates-patterns-collection' ),
		...ONBOARDING_CAT,
	};

	const sortOptions = [
		{
			label: __( 'Recommended', 'templates-patterns-collection' ),
			value: 'recommended',
		},
		{
			label: __( 'Popular', 'templates-patterns-collection' ),
			value: 'popular',
		},
		// "New first" relies on the per-site isNew flag, which only the Gutenberg
		// starters carry today — hide it for builders that have no new sites.
		...( editor === 'gutenberg'
			? [
					{
						label: __(
							'New first',
							'templates-patterns-collection'
						),
						value: 'new',
					},
			  ]
			: [] ),
	];

	// Nudge: a one-word query yields weak matches — coax a little more detail. Shows
	// only for a short, single-word query and disappears the moment a space is typed.
	const trimmed = ( searchQuery || '' ).trim();
	const showHint =
		trimmed.length > 0 && trimmed.length <= 12 && ! trimmed.includes( ' ' );

	return (
		<div className="ob-filters">
			<div className="ob-search-row">
				<Search
					placeholder={ __(
						'Describe your site — e.g. "law firm for personal injury cases"',
						'templates-patterns-collection'
					) }
				/>
				{ showHint && (
					<p className="ob-search-hint">
						{ __(
							"Add a detail or two for sharper matches — try what you do, who it's for, or where.",
							'templates-patterns-collection'
						) }
					</p>
				) }
			</div>
			<div className="ob-filters-bar">
				<CategoryButtons categories={ categories } />
				<SelectControl
					className="ob-sort-select"
					label={ __( 'Sort', 'templates-patterns-collection' ) }
					hideLabelFromVision
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					// Search relevance takes over while searching — reflect it and lock it.
					value={ searchQuery ? 'recommended' : sortBy }
					options={ sortOptions }
					onChange={ setSortBy }
					disabled={ !! searchQuery }
				/>
			</div>
		</div>
	);
};

export default Filters;
