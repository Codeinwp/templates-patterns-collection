/* global tiobDash */

import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { useState } from '@wordpress/element';
import { Icon } from '@wordpress/components';
import Notification from '../Notification';

import Logo from '../Icon';
import Search from '../Search';
import { CATEGORIES, EDITOR_MAP, isTabbedEditor } from '../../utils/common';
import EditorSelector from '../EditorSelector';
import VizSensor from 'react-visibility-sensor';
import EditorTabs from '../EditorTabs';
import CategoriesTabs from '../CategoriesTabs';
import CategorySelector from "../CategorySelector";

const Filters = ( {
	filterByCategory,
	filterBySearch,
	getSitesForBuilder,
	isOnboarding,
	getSites,
	category,
	editor,
} ) => {
	const [ sticky, setSticky ] = useState( false );
	const { sites = {}, migration } = getSites;
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

	const activeCount = getSitesForBuilder( editor ).length;
	const showCount = 50 <= activeCount;

	return (
		<>
			{ ! isOnboarding && ! migration && (
				<div className="sticky-nav" style={ stickyNavStyle }>
					<div className="container sticky-nav-content">
						{ ! tiobDash.brandedTheme && (
							<Icon icon={ Logo } size={ 32 } />
						) }
						<Search
							className="in-sticky"
							count={
								isTabbedEditor
									? counted.categories
									: counted.builders
							}
							categories={ CATEGORIES }
							editors={ EDITOR_MAP }
							onlyProSites={ onlyProBuilders }
							showCount={ showCount }
						/>
						{ isTabbedEditor && (
							<EditorSelector
								isSmall
								count={ counted.builders }
								EDITOR_MAP={ EDITOR_MAP }
							/>
						) }
						{ ! isTabbedEditor && (
							<CategorySelector
								count={ counted.categories }
								categories={ CATEGORIES }
								showCount={ showCount }
							/>
						) }
					</div>
				</div>
			) }
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
					{ ! isOnboarding && (
						<p className="instructions">
							{ tiobDash.strings.starterSitesTabDescription }
						</p>
					) }
					{ isTabbedEditor && (
						<EditorSelector
							count={ counted.builders }
							EDITOR_MAP={ EDITOR_MAP }
						/>
					) }
					{ ! isTabbedEditor && (
						<CategorySelector
							count={ counted.categories }
							categories={ CATEGORIES }
							showCount={ showCount }
						/>
					) }

					<Search
						count={
							isTabbedEditor
								? counted.categories
								: counted.builders
						}
						categories={ CATEGORIES }
						editors={ EDITOR_MAP }
						onlyProSites={ onlyProBuilders }
						showCount={ showCount }
					/>

					{ isTabbedEditor && (
						<EditorTabs
							EDITOR_MAP={ EDITOR_MAP }
							onlyProSites={ onlyProBuilders }
							count={ counted.builders }
						/>
					) }
					{ ! isTabbedEditor && (
						<CategoriesTabs
							categories={ CATEGORIES }
							count={ counted.categories }
							showCount={ showCount }
						/>
					) }
					{ ! tiobDash.isValidLicense && (
						<Notification
							data={ tiobDash.upsellNotifications.upsell_1 }
							editor={ editor }
						/>
					) }
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
