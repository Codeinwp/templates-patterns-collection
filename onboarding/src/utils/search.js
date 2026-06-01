/**
 * Free-text search is LLM-first: the server-side semantic ranking (`/starter_search`)
 * is the matcher — there is no client-side Fuse pass. The AI-enriched is-a vocabulary
 * (niches + site type) lives in each site's `keywords` (the catalog's keywords column)
 * and feeds the server-side ranking/search.
 *
 * Shared category predicate so the grid and the search/ranking paths agree on what is
 * "in the active category". 'free' = non-premium; 'all'/'' = everything.
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
