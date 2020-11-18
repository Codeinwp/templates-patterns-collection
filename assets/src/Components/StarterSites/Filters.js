/* global tiobDash */

import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { useState } from '@wordpress/element';
import { Icon } from '@wordpress/components';

import Logo from '../Icon';
import Search from '../Search';
import { CATEGORIES, EDITOR_MAP } from '../../utils/common';
import EditorSelector from '../EditorSelector';
import VizSensor from 'react-visibility-sensor';
import EditorTabs from '../EditorTabs';

const Filters = ( {
	filterByCategory,
	filterBySearch,
	getSitesForBuilder,
	isOnboarding,
	getSites,
	category,
	editor,
	setSearchQuery,
	searchQuery,
} ) => {
	const [ sticky, setSticky ] = useState( false );
	const { sites = {} } = getSites;
	const stickyNavStyle = { top: sticky ? 0 : '-100%' };

	const builders = Object.keys( sites );

	const onlyProBuilders = builders.filter( ( builder ) => {
		const upsellSitesCount = Object.keys( sites[ builder ] ).filter(
			( site ) => true === sites[ builder ][ site ].upsell
		).length;
		const sitesCount = Object.keys( sites[ builder ] ).length;

		return upsellSitesCount === sitesCount;
	} );

	const getCounts = () => {
		const counts = {
			builders: {},
			categories: {},
		};

		builders.forEach( ( builder ) => {
			let buildersFiltered = getSitesForBuilder( builder );
			buildersFiltered = filterByCategory( buildersFiltered, category );
			buildersFiltered = filterBySearch( buildersFiltered );
			counts.builders[ builder ] = buildersFiltered
				? buildersFiltered.length
				: 0;
		} );

		Object.keys( CATEGORIES ).forEach( ( singleCat ) => {
			let categoriesFiltered = getSitesForBuilder( editor );
			categoriesFiltered = filterByCategory(
				categoriesFiltered,
				singleCat
			);
			categoriesFiltered = filterBySearch( categoriesFiltered );
			counts.categories[ singleCat ] = categoriesFiltered
				? categoriesFiltered.length
				: 0;
		} );

		return counts;
	};

	const counted = getCounts();

	const StickyNav = () => {
		if ( isOnboarding ) {
			return null;
		}

		return (
			<div className="sticky-nav" style={ stickyNavStyle }>
				<div className="container sticky-nav-content">
					{ ! tiobDash.brandedTheme && (
						<Icon icon={ Logo } size={ 32 } />
					) }
					<Search
						className="in-sticky"
						count={ counted.categories }
						categories={ CATEGORIES }
						onSearch={ setSearchQuery }
						query={ searchQuery }
					/>
					<EditorSelector
						isSmall
						count={ counted.builders }
						EDITOR_MAP={ EDITOR_MAP }
					/>
				</div>
			</div>
		);
	};

	return (
		<>
			<StickyNav />
			<VizSensor
				onChange={ ( isVisible ) => {
					if ( ! isVisible ) {
						setSticky( true );
					} else {
						setSticky( false );
					}
				} }
			>
				<div>
					<p className="instructions">
						{ tiobDash.strings.starterSitesTabDescription }
					</p>
					<EditorSelector
						count={ counted.builders }
						EDITOR_MAP={ EDITOR_MAP }
					/>

					<Search
						count={ counted.categories }
						categories={ CATEGORIES }
						onSearch={ setSearchQuery }
						query={ searchQuery }
					/>

					<EditorTabs
						EDITOR_MAP={ EDITOR_MAP }
						onlyProSites={ onlyProBuilders }
						count={ counted.builders }
					/>
				</div>
			</VizSensor>
		</>
	);
};

export default compose(
	withDispatch( ( dispatch ) => {
		const {
			setOnboardingState,
			setCurrentCategory,
			setCurrentTab,
		} = dispatch( 'neve-onboarding' );
		return {
			cancelOnboarding: () => {
				setOnboardingState( false );
			},
			resetCategory: () => {
				setCurrentCategory( 'all' );
			},
			setCurrentTab,
		};
	} ),
	withSelect( ( select ) => {
		const {
			getCurrentEditor,
			getCurrentCategory,
			getOnboardingStatus,
			getSites,
		} = select( 'neve-onboarding' );
		return {
			editor: getCurrentEditor(),
			category: getCurrentCategory(),
			isOnboarding: getOnboardingStatus(),
			getSites: getSites(),
		};
	} )
)( Filters );
