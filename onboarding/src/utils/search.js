import Fuse from 'fuse.js/dist/fuse.min';

const SEARCH_KEYS = [
	{ name: 'title', weight: 0.5 },
	{ name: 'category', weight: 0.35 },
	{ name: 'slug', weight: 0.3 },
	{ name: 'site_description', weight: 0.25 },
	{ name: 'description', weight: 0.25 },
	{ name: 'keywords', weight: 0.2 },
];

const SEARCH_THRESHOLD = 0.3;

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

export const matchesCategory = ( site, cat ) => {
	if ( 'free' === cat ) {
		return ! site.upsell;
	}

	if ( cat && 'all' !== cat ) {
		return Array.isArray( site.keywords ) && site.keywords.includes( cat );
	}

	return true;
};
