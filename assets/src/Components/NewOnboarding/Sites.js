import { useState } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import StarterSiteCard from './StarterSiteCard';
import VizSensor from 'react-visibility-sensor';
import Fuse from 'fuse.js/dist/fuse.min';

const Sites = ( { getSites, editor, category, searchQuery } ) => {
	const [ maxShown, setMaxShown ] = useState( 9 );
	const { sites = {} } = getSites;

	const getFilteredSites = () => {
		const allSites = getAllSites();
		let builderSites = allSites[ editor ];
		builderSites = filterBySearch( builderSites );
		builderSites = filterByCategory( builderSites, category );

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

		if ( 'all' !== cat ) {
			return items.filter( ( item ) => item.keywords.includes( cat ) );
		}

		return items;
	};

	const getBuilders = () => Object.keys( sites );

	const allData = getFilteredSites();

	return (
		<div className="ob-sites is-grid">
			{ allData.slice( 0, maxShown ).map( ( site, index ) => {
				return <StarterSiteCard key={ index } data={ site } />;
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
	);
};

export default compose(
	withSelect( ( select ) => {
		const {
			getCurrentEditor,
			getCurrentCategory,
			getSites,
			getSearchQuery,
		} = select( 'neve-onboarding' );
		return {
			editor: getCurrentEditor(),
			category: getCurrentCategory(),
			searchQuery: getSearchQuery(),
			getSites: getSites(),
		};
	} )
)( Sites );
