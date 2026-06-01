import Fuse from 'fuse.js/dist/fuse.min';

// TEST TOGGLE — when false, free-text search SKIPS the instant client-side Fuse
// pass and relies on the LLM (/starter_search) alone (viable now that ranking is
// ~1s). Set back to true to restore the Fuse-first instant hybrid.
export const SEARCH_USE_FUSE = false;

/**
 * Client-side fuzzy search keys.
 *
 * The enriched vocabulary (niches, site type, features, sections, description
 * terms) is folded into each site's `keywords` array upstream (by the catalog
 * sync / local tag-inject), so search just reads a few fields. `title`,
 * `category` and `slug` carry the site's identity and are weighted ABOVE
 * `keywords`, so a site that genuinely IS a shop/blog (the word is in its
 * title/slug/category) ranks above one that merely mentions it in keywords.
 */
const SEARCH_KEYS = [
	{ name: 'title', weight: 0.5 },
	{ name: 'category', weight: 0.35 },
	{ name: 'slug', weight: 0.3 },
	{ name: 'keywords', weight: 0.2 },
];

const SEARCH_THRESHOLD = 0.3;

/**
 * Run the instant client-side fuzzy search over a builder's catalog.
 *
 * @param {Object[]} items The sites to search.
 * @param {string}   query The search query.
 * @return {Object[]} Matched sites, best first (empty for an empty query/list).
 */
export const searchCatalog = ( items, query ) => {
	const q = ( query || '' ).trim();
	if ( ! q || ! Array.isArray( items ) || ! items.length ) {
		return [];
	}
	const fuse = new Fuse( items, {
		includeScore: true,
		threshold: SEARCH_THRESHOLD,
		keys: SEARCH_KEYS,
	} );
	return fuse
		.search( q )
		.map( ( result ) => result.item )
		.filter( Boolean );
};

/**
 * Count the relevant Fuse matches for a query — used to decide whether the
 * instant client search already covers it well enough to skip the (slower, paid)
 * LLM fill. Same keys/threshold as searchCatalog, so the count matches what shows.
 *
 * @param {Object[]} items The sites to count over.
 * @param {string}   query The search query.
 * @return {number} Count of matches (0 for empty query/list).
 */
export const countStrongMatches = ( items, query ) => {
	const q = ( query || '' ).trim();
	if ( ! q || ! Array.isArray( items ) || ! items.length ) {
		return 0;
	}
	return new Fuse( items, {
		threshold: SEARCH_THRESHOLD,
		keys: SEARCH_KEYS,
	} ).search( q ).length;
};

/**
 * Shared category predicate so the displayed grid and the LLM gate agree on what
 * is "in the active category". 'free' = non-premium; 'all'/'' = everything.
 *
 * @param {Object} site The site.
 * @param {string} cat  The active category.
 * @return {boolean} Whether the site belongs to the category.
 */
export const matchesCategory = ( site, cat ) => {
	if ( 'free' === cat ) {
		return ! site.upsell;
	}
	if ( cat && 'all' !== cat ) {
		return Array.isArray( site.keywords ) && site.keywords.includes( cat );
	}
	return true;
};
