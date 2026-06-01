import Fuse from 'fuse.js/dist/fuse.min';

/**
 * Client-side fuzzy search keys. Search is LLM-first (the server-side semantic
 * ranking in /starter_search). `searchCatalog` below is only a FALLBACK: when the
 * LLM search fails (error / 404 / timeout / empty), the client runs Fuse so search
 * still returns results. The AI-enriched is-a vocabulary (niches + site type) lives
 * in each site's `keywords`; `title`/`category`/`slug` are weighted above `keywords`.
 */
const SEARCH_KEYS = [
	{ name: 'title', weight: 0.5 },
	{ name: 'category', weight: 0.35 },
	{ name: 'slug', weight: 0.3 },
	{ name: 'keywords', weight: 0.2 },
];

const SEARCH_THRESHOLD = 0.3;

/**
 * Fuse FALLBACK search over a builder's catalog — used only when the LLM-first
 * search is unavailable, so search degrades to instant lexical matching instead of
 * returning nothing.
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
	return new Fuse( items, {
		includeScore: true,
		threshold: SEARCH_THRESHOLD,
		keys: SEARCH_KEYS,
	} )
		.search( q )
		.map( ( result ) => result.item )
		.filter( Boolean );
};

/**
 * Shared category predicate so the grid and the search/ranking paths agree on what
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
