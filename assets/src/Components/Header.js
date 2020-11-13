/* global tiobDash */
import { withSelect, withDispatch } from '@wordpress/data';
import { Button, Icon } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { update } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import Logo from './Icon';
import classnames from 'classnames';

const TabNavigation = ( {
	setCurrentTab,
	currentTab,
	isFetching,
	setFetching,
} ) => {
	const buttons = {
		starterSites: __( 'Starter Sites', 'neve' ),
		pageTemplates: __( 'Page Templates', 'neve' ),
	};

	if (
		tiobDash.license &&
		tiobDash.license.tier &&
		tiobDash.license.tier === 3
	) {
		buttons.library = __( 'My Library', 'neve' );
	}

	return (
		<div className="header-nav">
			{ Object.keys( buttons ).map( ( slug ) => {
				return (
					<Button
						key={ slug }
						isTertiary
						isPressed={ slug === currentTab }
						onClick={ () => setCurrentTab( slug ) }
					>
						{ buttons[ slug ] }
					</Button>
				);
			} ) }
		</div>
	);
};

const Header = ( {
	isOnboarding,
	cancelOnboarding,
	setCurrentTab,
	currentTab,
} ) => {
	return (
		<div className="ob-head">
			{ ! isOnboarding && (
				<>
					<div className="header-container">
						<h2>
							{ ! tiobDash.brandedTheme && (
								<Icon icon={ Logo } />
							) }
							<span>{ __( 'Templates Cloud', 'neve' ) }</span>
						</h2>
						<TabNavigation
							setCurrentTab={ setCurrentTab }
							currentTab={ currentTab }
						/>
					</div>
				</>
			) }
			{ isOnboarding && (
				<Button
					className="close-onboarding"
					isLink
					icon="no-alt"
					onClick={ cancelOnboarding }
				/>
			) }
		</div>
	);
};

export default compose(
	withDispatch( ( dispatch ) => {
		const { setOnboardingState, setCurrentTab, setFetching } = dispatch(
			'neve-onboarding'
		);
		return {
			cancelOnboarding: () => {
				setOnboardingState( false );
			},
			setCurrentTab,
			setFetching,
		};
	} ),
	withSelect( ( select ) => {
		const { getOnboardingStatus, getCurrentTab, getFetching } = select(
			'neve-onboarding'
		);
		return {
			isOnboarding: getOnboardingStatus(),
			currentTab: getCurrentTab(),
			isFetching: getFetching(),
		};
	} )
)( Header );
