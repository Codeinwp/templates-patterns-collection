import { useState } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import StarterSiteCard from './StarterSiteCard';
import VizSensor from 'react-visibility-sensor';
import Fuse from 'fuse.js/dist/fuse.min';

/**
 * @typedef {Object} Site
 * @property {string}   url        - The demo site URL
 * @property {string}   remote_url - The API endpoint URL
 * @property {string}   screenshot - The screenshot image URL
 * @property {string}   title      - The site title
 * @property {string[]} keywords   - Array of keyword strings
 * @property {boolean}  isNew      - Whether the site is new
 * @property {string}   slug       - The site's slug
 */


const MINIMUM_SITES_LISTING = 10;

const Sites = ( { getSites, editor, category, searchQuery } ) => {
	const [ maxShown, setMaxShown ] = useState( 9 );
	const { sites = {} } = getSites;

	const getFilteredSites = () => {
		const allSites = getAllSites();
		if ( Object.keys( allSites ).length === 0 ) {
			return [];
		}

		/** @type {Site[]} */
		let builderSites = allSites[ editor ];
		const sitesBySearch = filterBySearch( builderSites );
		builderSites = filterByCategory( sitesBySearch, category );

		if ( MINIMUM_SITES_LISTING > builderSites.length ) {
			// Populate with sites related to search.
			for (const site of sitesBySearch) {
				if (builderSites.length >= MINIMUM_SITES_LISTING) {
					break;
				}
				if (builderSites.find(existing => existing.slug === site.slug)) {
					continue;
				}
				if (site?.upsell && 'free' === category) {
					continue;
				}
				builderSites.push(site);
			}
			
			// Get the top recommendation if we still do not meed the minimum.
			for (const site of allSites[editor]) {
				if (builderSites.length >= MINIMUM_SITES_LISTING) {
					break;
				}
				if (builderSites.find(existing => existing.slug === site.slug)) {
					continue;
				}
				if (site?.upsell && 'free' === category) {
					continue;
				}
				builderSites.push(site);
			}
		}
		
		return builderSites;
	};
	
	const getAllSites = () => {
		const finalData = {};
		const builders = getBuilders();

		builders.forEach( ( builder ) => {
			const sitesData = sites && sites[ builder ] ? sites[ builder ] : {};
			finalData[ builder ] = [ ...Object.values( sitesData ) ];
		} );

		return finalData;
	};

	/**
	 * Sort the sites based on keyword position.
	 *
	 * @param {string} keyword     The keyword.
	 * @param {Site[]} sitesToSort The list of sites to sort.
	 *
	 * @return {Site[]} Array of sites sorted by keyword position.
	 */
	const sortByKeywords = (keyword, sitesToSort) => {
		const _keyword = keyword?.toLowerCase();
		return sitesToSort.sort((a, b) => {
			if (!Array.isArray(a?.keywords) || !Array.isArray(b?.keywords)) {
				return 0;
			}

			const aHasKeyword = a.keywords.includes(_keyword);
			const bHasKeyword = b.keywords.includes(_keyword);

			if (aHasKeyword && !bHasKeyword) {
				return -1;
			}
			if (!aHasKeyword && bHasKeyword) {
				return 1;
			}

			const aIndex = a.keywords.findIndex(k => k === _keyword);
			const bIndex = b.keywords.findIndex(k => k === _keyword);
			return aIndex - bIndex;
		});
	};
	
	/**
	 * Filters an array of items based on a search query using Fuse.js for fuzzy searching.
	 *
	 * @param {Site[]} items Array of objects containing title, slug, and keywords properties to search through
	 * @return {Site[]} Filtered array of items that match the search query, or the original array if no query
	 */
	const filterBySearch = ( items ) => {
		if ( ! searchQuery ) {
			return items;
		}
		
		const fuse = new Fuse(items, {
			includeScore: true,
			keys: [
				{
					name: 'title',
					weight: 0.5
				},
				{
					name: 'slug',
					weight: 0.1
				},
				{
					name: 'keywords',
					weight: 0.4,
				}
			],
			threshold: 0.4
		});

		const fuzzyResults = fuse.search(searchQuery)
			.map(result => result.item)
			.filter(Boolean);

		return sortByKeywords( searchQuery, fuzzyResults );
	};

	/**
	 * Filters an array of items based on a category.
	 * @param {Site[]} items The array of items to filter.
	 * @param {string} cat   The category to filter by. Can be 'free', 'all', or any other category value.
	 * @return {Site[]} A filtered array of items based on the category.
	 */
	const filterByCategory = ( items, cat ) => {
		if ( 'free' === cat ) {
			return items.filter( ( item ) => ! item.upsell );
		}

		if ( cat && 'all' !== cat ) {
			const filteredByCat = items.filter( ( item ) => {
				if (!Array.isArray(item?.keywords)) {
					return false;
				}
				const keywordIndex = item.keywords.findIndex(k => k === cat);
				return keywordIndex !== -1;
			});
			return sortByKeywords( cat, filteredByCat ); 
		}

		return items;
	};

	const getBuilders = () => Object.keys( sites );

	const allData = getFilteredSites();
	return (
		<>
			{ allData.length ? (
				<div className="ob-sites is-grid">
					{ allData.slice( 0, maxShown ).map( ( site, index ) => {
						return (
							<StarterSiteCard
								key={ index }
								data={ site }
							/>
						);
					} ) }

					<VizSensor
						onChange={ ( isVisible ) => {
							if ( ! isVisible ) {
								return false;
							}
							setMaxShown( maxShown + 9 );
						} }
					>
						<span
							style={ {
								height: 10,
								width: 10,
								display: 'block',
							} }
						/>
					</VizSensor>
				</div>
			) : (
				<div className="ob-no-results">
					<p>
						{ __(
							'No results found.',
							'templates-patterns-collection'
						) }
						&nbsp;
						{ __(
							'You can try a different search or use another category.',
							'templates-patterns-collection'
						) }
					</p>
				</div>
			) }
		</>
	);
};

export default withSelect( ( select ) => {
	const { getCurrentEditor, getCurrentCategory, getSites, getSearchQuery } =
		select( 'ti-onboarding' );
	return {
		editor: getCurrentEditor(),
		category: getCurrentCategory(),
		searchQuery: getSearchQuery(),
		getSites: getSites(),
	};
} )( Sites );
