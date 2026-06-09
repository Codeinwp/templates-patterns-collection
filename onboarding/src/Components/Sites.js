import { Fragment, useEffect, useMemo, useState } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import StarterSiteCard from './StarterSiteCard';
import VizSensor from 'react-visibility-sensor';
import { matchesCategory, searchCatalog } from '../utils/search';

/**
 * @typedef {Object} Site
 * @property {string}   url
 * @property {string}   remote_url
 * @property {string}   screenshot
 * @property {string}   title
 * @property {string[]} keywords
 * @property {boolean}  isNew
 * @property {string}   slug
 */

const Sites = ( {
	getSites,
	editor,
	category,
	searchQuery,
	rankedOrder,
	searchOrder,
	searchFailed,
	sortBy,
	selectedColors,
} ) => {
	const [ maxShown, setMaxShown ] = useState( 9 );
	const { sites = {} } = getSites;

	useEffect( () => {
		setMaxShown( 9 );
	}, [ editor, category, searchQuery, sortBy, selectedColors ] );

	const getBuilders = () => Object.keys( sites );

	const getAllSites = () => {
		const finalData = {};
		const builders = getBuilders();

		builders.forEach( ( builder ) => {
			const sitesData = sites && sites[ builder ] ? sites[ builder ] : {};
			finalData[ builder ] = Object.entries( sitesData ).map(
				( [ slug, site ] ) => ( { ...site, slug } )
			);
		} );

		return finalData;
	};

	const pickBySlugs = ( siteList, slugs ) => {
		if ( ! Array.isArray( siteList ) || ! Array.isArray( slugs ) ) {
			return { picked: [], placed: {} };
		}

		const bySlug = new Map(
			siteList
				.filter( ( site ) => site && site.slug )
				.map( ( site ) => [ site.slug, site ] )
		);
		const picked = [];
		const placed = {};

		slugs.forEach( ( slug ) => {
			if ( ! slug || placed[ slug ] || ! bySlug.has( slug ) ) {
				return;
			}

			placed[ slug ] = true;
			picked.push( bySlug.get( slug ) );
		} );

		return { picked, placed };
	};

	const applyRanking = ( sitesToRank, order ) => {
		if ( ! Array.isArray( order ) || ! order.length ) {
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

	const applySort = ( list, mode, fullList ) => {
		const rowIndex = new Map(
			fullList.map( ( site, index ) => [ site.slug, index ] )
		);
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

	const sortByKeywords = ( keyword, sitesToSort ) => {
		const normalizedKeyword = keyword?.toLowerCase();

		return sitesToSort.sort( ( a, b ) => {
			const aHasKeywords = Array.isArray( a?.keywords );
			const bHasKeywords = Array.isArray( b?.keywords );

			if ( ! aHasKeywords && ! bHasKeywords ) {
				return 0;
			}
			if ( ! aHasKeywords ) {
				return 1;
			}
			if ( ! bHasKeywords ) {
				return -1;
			}

			const aHasKeyword = a.keywords.includes( normalizedKeyword );
			const bHasKeyword = b.keywords.includes( normalizedKeyword );

			if ( aHasKeyword && ! bHasKeyword ) {
				return -1;
			}
			if ( ! aHasKeyword && bHasKeyword ) {
				return 1;
			}

			const aIndex = a.keywords.findIndex( ( value ) => value === normalizedKeyword );
			const bIndex = b.keywords.findIndex( ( value ) => value === normalizedKeyword );

			return aIndex - bIndex;
		} );
	};

	const filterBySearch = ( items ) => {
		if ( ! searchQuery ) {
			return items;
		}

		if ( Array.isArray( searchOrder ) && searchOrder.length ) {
			return pickBySlugs( items, searchOrder ).picked;
		}

		if ( searchFailed ) {
			return searchCatalog( items, searchQuery );
		}

		return [];
	};

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

	const filterByColors = ( items ) => {
		if ( ! Array.isArray( selectedColors ) || ! selectedColors.length ) {
			return items;
		}

		return items.filter( ( site ) => {
			if ( ! Array.isArray( site?.colors ) || ! site.colors.length ) {
				return false;
			}

			const siteColors = site.colors.map( ( color ) =>
				String( color || '' ).trim().toLowerCase()
			);

			return selectedColors.some( ( color ) => siteColors.includes( color ) );
		} );
	};

	const getFilteredSites = () => {
		const allSites = getAllSites();
		if ( Object.keys( allSites ).length === 0 ) {
			return { list: [], matchCount: 0 };
		}

		const fullBucket = allSites[ editor ] || [];
		let ranked = fullBucket;
		if ( searchQuery || ! sortBy || sortBy === 'recommended' ) {
			ranked = applyRanking( fullBucket, rankedOrder && rankedOrder[ editor ] );
		}

		if ( searchQuery ) {
			const matches = filterByColors(
				filterByCategory( filterBySearch( ranked ), category )
			);
			const inMatches = {};
			matches.forEach( ( site ) => {
				if ( site && site.slug ) {
					inMatches[ site.slug ] = true;
				}
			} );

			const rest = filterByColors( filterByCategory( ranked, category ) ).filter(
				( site ) => site && site.slug && ! inMatches[ site.slug ]
			);
			const remainder = matches.length % 3;
			const pad =
				remainder === 0 ? 0 : Math.min( 3 - remainder, rest.length );

			return {
				list: [ ...matches, ...rest ],
				matchCount: matches.length + pad,
			};
		}

		let builderSites = filterByColors( filterByCategory( ranked, category ) );
		if ( sortBy === 'popular' || sortBy === 'new' ) {
			builderSites = applySort( builderSites, sortBy, fullBucket );
		}

		return { list: builderSites, matchCount: 0 };
	};

	const { list: allData, matchCount } = useMemo(
		() => getFilteredSites(),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			sites,
			editor,
			category,
			searchQuery,
			sortBy,
			selectedColors,
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
			) : searchQuery && ! searchFailed && ! searchOrder.length ? null : (
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
		getSelectedColors,
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
		selectedColors: getSelectedColors(),
	};
} )( Sites );
