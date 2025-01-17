import { useState } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import StarterSiteCard from './StarterSiteCard';
import VizSensor from 'react-visibility-sensor';
import Fuse from 'fuse.js/dist/fuse.min';

const MINIMUM_SITES_LISTING = 10;

const Sites = ( { getSites, editor, category, searchQuery } ) => {
	const [ maxShown, setMaxShown ] = useState( 9 );
	const { sites = {} } = getSites;

	const getFilteredSites = () => {
		const allSites = getAllSites();
		if ( Object.keys( allSites ).length === 0 ) {
			return [];
		}

		/** @type {Array} */
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

	const filterBySearch = ( items ) => {
		if ( ! searchQuery ) {
			return items;
		}

		const fuse = new Fuse( items, {
			includeScore: true,
			keys: [ 'title', 'slug', 'keywords' ],
		} );
		return fuse.search( searchQuery ).map( ( item ) => item.item );
	};

	const filterByCategory = ( items, cat ) => {
		if ( 'free' === cat ) {
			return items.filter( ( item ) => ! item.upsell );
		}

		if ( cat && 'all' !== cat ) {
			return items.filter( ( item ) => item.keywords.includes( cat ) );
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
