import { useState, useMemo, useEffect, Fragment } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import StarterSiteCard from './StarterSiteCard';
import VizSensor from 'react-visibility-sensor';
import { matchesCategory, searchCatalog } from '../utils/search';

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


const Sites = ( { getSites, editor, category, searchQuery, rankedOrder, searchOrder, searchFailed, sortBy } ) => {
	const [ maxShown, setMaxShown ] = useState( 9 );
	const { sites = {} } = getSites;

	// Reset the lazy-load window when the result set changes, so a larger cap from a
	// previous list doesn't carry into a new search / category / sort / editor.
	useEffect( () => {
		setMaxShown( 9 );
	}, [ editor, category, searchQuery, sortBy ] );

	const getFilteredSites = () => {
		const allSites = getAllSites();
		if ( Object.keys( allSites ).length === 0 ) {
			return { list: [], matchCount: 0 };
		}

		/** @type {Site[]} */
		const fullBucket = allSites[ editor ] || [];
		// Personalize with the AI-inferred order in the default "Recommended" sort
		// (or while searching — relevance wins). Explicit Popular/New opts out and is
		// applied below via applySort.
		let ranked = fullBucket;
		if ( searchQuery || ! sortBy || sortBy === 'recommended' ) {
			ranked = applyRanking(
				fullBucket,
				rankedOrder && rankedOrder[ editor ]
			);
		}

		// Search: the genuine matches (LLM semantic ranking) come first; then the
		// REST of the (category-respecting) catalog below a "browse more" divider —
		// no silent padding with look-alike filler, and the rest always fills the grid.
		// `matchCount` tells the render where to drop the divider.
		if ( searchQuery ) {
			const matches = filterByCategory( filterBySearch( ranked ), category );
			const inMatches = {};
			matches.forEach( ( site ) => {
				if ( site && site.slug ) {
					inMatches[ site.slug ] = true;
				}
			} );
			const rest = filterByCategory( ranked, category ).filter(
				( site ) => site && site.slug && ! inMatches[ site.slug ]
			);
			// Pad the matches up to a full grid row (multiple of 3) using the top of
			// the rest, so the divider lands on a clean row boundary instead of leaving
			// a half-empty row. The list stays matches+rest — we just push the divider
			// down by the pad count (those pad items are the most-relevant non-matches).
			const remainder = matches.length % 3;
			const pad =
				remainder === 0 ? 0 : Math.min( 3 - remainder, rest.length );
			return {
				list: [ ...matches, ...rest ],
				matchCount: matches.length + pad,
			};
		}

		// Browse: the personalized (or explicitly Popular/New sorted) catalog for the
		// active category. No min-fill — 'all' shows the whole catalog; a specific
		// category shows its members (a thin category honestly shows fewer cards
		// rather than padding with unrelated sites).
		let builderSites = filterByCategory( ranked, category );
		if ( sortBy === 'popular' || sortBy === 'new' ) {
			builderSites = applySort( builderSites, sortBy, fullBucket );
		}
		return { list: builderSites, matchCount: 0 };
	};
	
	const getAllSites = () => {
		const finalData = {};
		const builders = getBuilders();

		builders.forEach( ( builder ) => {
			const sitesData = sites && sites[ builder ] ? sites[ builder ] : {};
			// Guarantee a `slug` field on every entry from the catalog key. PHP
			// already injects one (Admin.php get_sites_data), so this is defensive —
			// it keeps slug-based ranking/search/dedup correct regardless of source,
			// and is output-equivalent to Object.values when the field is present.
			finalData[ builder ] = Object.entries( sitesData ).map(
				( [ slug, site ] ) => ( { ...site, slug } )
			);
		} );

		return finalData;
	};

	/**
	 * Pick the sites whose slug appears in `slugs`, in that order, deduped.
	 *
	 * @param {Site[]}   siteList The sites to pick from.
	 * @param {string[]} slugs    Ordered slugs.
	 * @return {{ picked: Site[], placed: Object }} Matched sites + a set of their slugs.
	 */
	const pickBySlugs = ( siteList, slugs ) => {
		const bySlug = {};
		siteList.forEach( ( site ) => {
			if ( site && site.slug ) {
				bySlug[ site.slug ] = site;
			}
		} );
		const picked = [];
		const placed = {};
		( slugs || [] ).forEach( ( slug ) => {
			if ( bySlug[ slug ] && ! placed[ slug ] ) {
				picked.push( bySlug[ slug ] );
				placed[ slug ] = true;
			}
		} );
		return { picked, placed };
	};

	/**
	 * Reorder sites by the AI-inferred order (matching slugs first, in that order;
	 * the rest keep their original position). No order → unchanged.
	 *
	 * @param {Site[]}   sitesToRank The sites to reorder.
	 * @param {string[]} order       Ordered slugs from the AI proxy.
	 * @return {Site[]} Reordered sites.
	 */
	const applyRanking = ( sitesToRank, order ) => {
		if ( ! Array.isArray( order ) || order.length === 0 ) {
			return sitesToRank;
		}
		const { picked, placed } = pickBySlugs( sitesToRank, order );
		sitesToRank.forEach( ( site ) => {
			if ( site && ( ! site.slug || ! placed[ site.slug ] ) ) {
				picked.push( site );
			}
		} );
		return picked;
	};

	/**
	 * Apply an explicit sort to the grid, overriding personalization.
	 *  - 'popular': the curated catalog (Google Sheet) order — NOT the AI order.
	 *  - 'new':     new sites first, then curated order (ties broken by row position).
	 * `fullList` is the unfiltered builder bucket, so the curated row index reflects
	 * the true sheet position even after filtering. Sorts a copy (no mutation).
	 *
	 * @param {Site[]} list     The (possibly filtered) sites to order.
	 * @param {string} mode     'popular' or 'new'.
	 * @param {Site[]} fullList The full builder bucket, in curated sheet order.
	 * @return {Site[]} The sorted sites.
	 */
	const applySort = ( list, mode, fullList ) => {
		const rowIndex = new Map(
			fullList.map( ( site, i ) => [ site.slug, i ] )
		);
		// Unknown slugs sort to the tail (0 is the legitimate top/most-popular row).
		const byRow = ( a, b ) =>
			( rowIndex.get( a.slug ) ?? Number.MAX_SAFE_INTEGER ) -
			( rowIndex.get( b.slug ) ?? Number.MAX_SAFE_INTEGER );
		if ( mode === 'new' ) {
			return [ ...list ].sort(
				( a, b ) =>
					( b.isNew ? 1 : 0 ) - ( a.isNew ? 1 : 0 ) || byRow( a, b )
			);
		}
		return [ ...list ].sort( byRow );
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
			const aHasKw = Array.isArray( a?.keywords );
			const bHasKw = Array.isArray( b?.keywords );
			if ( ! aHasKw && ! bHasKw ) {
				return 0;
			}
			if ( ! aHasKw ) {
				return 1; // keyword-less sinks to the tail (keeps the comparator transitive)
			}
			if ( ! bHasKw ) {
				return -1;
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
	 * Filters items by the active search query. LLM-first: the matches are the
	 * server-side semantic ranking (searchOrder), in the model's relevance order.
	 * If that search failed (error / 404 / hung / empty → `searchFailed`), fall back
	 * to an instant client-side Fuse pass so search still returns results.
	 *
	 * @param {Site[]} items The sites to filter.
	 * @return {Site[]} The matched sites (empty while the LLM is still in flight), or the input when no query.
	 */
	const filterBySearch = ( items ) => {
		if ( ! searchQuery ) {
			return items;
		}

		// LLM-first: the server-side semantic ranking, in the model's relevance order.
		if ( Array.isArray( searchOrder ) && searchOrder.length ) {
			return pickBySlugs( items, searchOrder ).picked;
		}

		// Fallback: the LLM search couldn't deliver → instant Fuse lexical matching so
		// search never breaks. (Until it fails, stay empty — the loader is showing.)
		if ( searchFailed ) {
			return searchCatalog( items, searchQuery );
		}

		return [];
	};

	/**
	 * Filters an array of items based on a category.
	 * @param {Site[]} items The array of items to filter.
	 * @param {string} cat   The category to filter by. Can be 'free', 'all', or any other category value.
	 * @return {Site[]} A filtered array of items based on the category.
	 */
	const filterByCategory = ( items, cat ) => {
		if ( 'free' === cat ) {
			return items.filter( ( item ) => matchesCategory( item, cat ) );
		}

		if ( cat && 'all' !== cat ) {
			const filteredByCat = items.filter( ( item ) =>
				matchesCategory( item, cat )
			);
			return sortByKeywords( cat, filteredByCat );
		}

		return items;
	};

	const getBuilders = () => Object.keys( sites );

	// Memoize the full pipeline (search + slug Maps + sorts) so it doesn't
	// rebuild on every render — notably `maxShown` changes while scrolling, which
	// only drive the .slice() below, not the filtering/ranking.
	const { list: allData, matchCount } = useMemo(
		() => getFilteredSites(),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			sites,
			editor,
			category,
			searchQuery,
			sortBy,
			rankedOrder,
			searchOrder,
			searchFailed,
		]
	);
	return (
		<>
			{ allData.length ? (
				<div className="ob-sites is-grid">
					{ allData.slice( 0, maxShown ).map( ( site, index ) => (
						<Fragment key={ site.slug || index }>
							{ searchQuery &&
								matchCount > 0 &&
								index === matchCount && (
									<div className="ob-results-divider">
										<span>
											{ __(
												'Not quite right? Browse more',
												'templates-patterns-collection'
											) }
										</span>
									</div>
								) }
							<StarterSiteCard data={ site } />
						</Fragment>
					) ) }

					<VizSensor
						onChange={ ( isVisible ) => {
							if ( ! isVisible ) {
								return false;
							}
							setMaxShown( ( shown ) => shown + 9 );
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
	const {
		getCurrentEditor,
		getCurrentCategory,
		getSites,
		getSearchQuery,
		getRankedOrder,
		getSearchOrder,
		getSearchFailed,
		getSortBy,
	} = select( 'ti-onboarding' );
	return {
		editor: getCurrentEditor(),
		category: getCurrentCategory(),
		searchQuery: getSearchQuery(),
		getSites: getSites(),
		rankedOrder: getRankedOrder(),
		searchOrder: getSearchOrder(),
		searchFailed: getSearchFailed(),
		sortBy: getSortBy(),
	};
} )( Sites );
