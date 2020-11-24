/* global tiobDash, localStorage */
import { withSelect, withDispatch } from '@wordpress/data';
import { Button, Icon } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { update } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import Logo from './Icon';
import classnames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

const TabNavigation = ( { setCurrentTab, currentTab, isFetching } ) => {
	const [ isSyncing, setSyncing ] = useState( false );

	const buttons = {
		starterSites: __( 'Starter Sites', 'neve' ),
		pageTemplates: __( 'Page Templates', 'neve' ),
	};

	const sync = () => {
		setSyncing( true );
		localStorage.setItem( 'tpcCacheBuster', uuidv4() );
		const nextTab = currentTab;
		setCurrentTab( null );
		setTimeout( () => {
			setCurrentTab( nextTab );
			setSyncing( false );
		}, 100 );
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
			{ currentTab !== 'starterSites' && (
				<Button
					icon={ update }
					onClick={ sync }
					label={ __( 'Re-sync Library' ) }
					className={ classnames( 'is-sync', {
						'is-loading': isSyncing,
					} ) }
					disabled={ isFetching || isSyncing }
					data-content={ __( 'Sync' ) }
				/>
			) }
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
