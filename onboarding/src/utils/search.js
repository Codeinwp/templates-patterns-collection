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

/**
 * Color-family predicate. A site matches if it ships ANY of the selected families
 * (`colors` is the per-site list of families it has, 1..N). Empty selection = no
 * color filter, so everything matches. A site with no `colors` (a baked / single-
 * screenshot demo) matches only the empty selection — it drops out once a color is
 * picked, so we never show a wrong-color thumbnail.
 *
 * @param {Object}   site   The site.
 * @param {string[]} colors The selected color-family keys (≤2).
 * @return {boolean} Whether the site belongs to any selected family.
 */
export const matchesColor = ( site, colors ) => {
	if ( ! Array.isArray( colors ) || colors.length === 0 ) {
		return true;
	}
	return (
		Array.isArray( site.colors ) &&
		colors.some( ( c ) => site.colors.includes( c ) )
	);
};

/**
 * Resolve which screenshot a card should show for the active color selection: the
 * variant for the FIRST selected family the site actually has, else its default
 * `screenshot`. Keeps the card a pure presentational swap.
 *
 * @param {Object}   site   The site (with optional `screenshots_by_color`).
 * @param {string[]} colors The selected color-family keys (≤2).
 * @return {string} The screenshot URL to render.
 */
export const colorScreenshot = ( site, colors ) => {
	if ( Array.isArray( colors ) && colors.length && site.screenshots_by_color ) {
		const hit = colors.find( ( c ) => site.screenshots_by_color[ c ] );
		if ( hit ) {
			return site.screenshots_by_color[ hit ];
		}
	}
	return site.screenshot;
};
