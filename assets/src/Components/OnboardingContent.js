import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

import VizSensor from 'react-visibility-sensor';
import Fuse from 'fuse.js/dist/fuse.min';

import StarterSiteCard from './StarterSiteCard';
import PreviewFrame from './PreviewFrame';
import { TAGS } from '../utils/common';
import Filters from './StarterSites/Filters';

const OnboardingContent = ( {
	getSites,
	category,
	resetCategory,
	editor,
	previewOpen,
	currentSiteData,
	isOnboarding,
	cancelOnboarding,
	setSearchQuery,
	searchQuery,
} ) => {
	const { sites = {} } = getSites;

	const getAllSites = () => {
		const finalData = {};
		const builders = getBuilders();

		builders.forEach( ( builder ) => {
			const sitesData = sites && sites[ builder ] ? sites[ builder ] : {};
			finalData[ builder ] = [ ...Object.values( sitesData ) ];
		} );

		return finalData;
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

	const getSitesForBuilder = ( builder ) => {
		const allSites = getAllSites();
		return allSites[ builder ];
	};

	const getBuilders = () => Object.keys( sites );

	const getFilteredSites = () => {
		const allSites = getAllSites();
		let builderSites = allSites[ editor ];
		builderSites = filterBySearch( builderSites );
		builderSites = filterByCategory( builderSites, category );

		return builderSites;
	};

	const Sites = () => {
		const [ maxShown, setMaxShown ] = useState( 9 );
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

	const getSiteNav = ( prev = false ) => {
		if ( null === currentSiteData ) {
			return null;
		}
		const allSites = getAllSites()[ editor ];
		const position = allSites.indexOf( currentSiteData );

		if ( -1 === position ) {
			return null;
		}

		if ( 1 === allSites.length ) {
			return null;
		}

		if ( prev && 0 === position ) {
			return allSites[ allSites.length - 1 ];
		}

		if ( ! prev && position === allSites.length - 1 ) {
			return allSites[ 0 ];
		}

		return allSites[ prev ? position - 1 : position + 1 ];
	};

	if ( 1 > sites.length ) {
		return (
			<>
				<p>
					{ __(
						'Starter sites could not be loaded. Please refresh and try again.',
						'neve'
					) }
					{ isOnboarding && (
						<Button
							style={ {
								display: 'block',
								margin: '20px auto',
							} }
							isPrimary
							onClick={ cancelOnboarding }
						>
							{ __( 'Close', 'templates-patterns-collection' ) }
						</Button>
					) }
				</p>
			</>
		);
	}

	return (
		<>
			<Filters
				getSitesForBuilder={ getSitesForBuilder }
				filterBySearch={ filterBySearch }
				filterByCategory={ filterByCategory }
			/>
			{ 0 === getFilteredSites().length && (
				<div className="no-results">
					<p>
						{ __(
							'No results found',
							'templates-patterns-collection'
						) }
						{ __(
							'You can try a different search or use one of the categories below.',
							'neve'
						) }
					</p>
					<div className="tags">
						{ TAGS.map( ( tag, index ) => {
							return (
								<Button
									key={ index }
									isPrimary
									className="tag"
									onClick={ ( e ) => {
										e.preventDefault();
										setSearchQuery( tag );
										resetCategory();
									} }
								>
									{ tag }
								</Button>
							);
						} ) }
					</div>
				</div>
			) }
			<Sites />
			{ previewOpen && currentSiteData && (
				<PreviewFrame
					next={ getSiteNav() }
					prev={ getSiteNav( true ) }
				/>
			) }
		</>
	);
};

export default compose(
	withDispatch( ( dispatch ) => {
		const {
			setOnboardingState,
			setCurrentCategory,
			setCurrentTab,
			setSearchQuery,
		} = dispatch( 'neve-onboarding' );
		return {
			cancelOnboarding: () => {
				setOnboardingState( false );
			},
			resetCategory: () => {
				setCurrentCategory( 'all' );
			},
			setCurrentTab,
			setSearchQuery,
		};
	} ),
	withSelect( ( select ) => {
		const {
			getCurrentEditor,
			getCurrentCategory,
			getPreviewStatus,
			getCurrentSite,
			getImportModalStatus,
			getOnboardingStatus,
			getSites,
			getInstallModalStatus,
			getCurrentTab,
			getSearchQuery,
		} = select( 'neve-onboarding' );
		return {
			editor: getCurrentEditor(),
			category: getCurrentCategory(),
			previewOpen: getPreviewStatus(),
			currentSiteData: getCurrentSite(),
			importModal: getImportModalStatus(),
			installModal: getInstallModalStatus(),
			isOnboarding: getOnboardingStatus(),
			getSites: getSites(),
			currentTab: getCurrentTab(),
			searchQuery: getSearchQuery(),
		};
	} )
)( OnboardingContent );
