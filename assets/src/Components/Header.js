/* global tiobDash, localStorage */
import { withSelect, withDispatch } from '@wordpress/data';
import { useEffect, useState, useContext } from '@wordpress/element';
import { Button, Icon } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { update, cloud, close } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import Logo from './Icon';
import classnames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { addUrlHash, getTabHash } from '../utils/common';
import License from './License';
import { LicensePanelContext } from './LicensePanelContext';

const TabNavigation = ( {
	setCurrentTab,
	currentTab,
	isFetching,
	license,
} ) => {
	const buttons = {
		starterSites: __( 'Starter Sites', 'templates-patterns-collection' ),
		pageTemplates: __( 'Page Templates', 'templates-patterns-collection' ),
	};

	if ( ! tiobDash.hideMyLibrary ) {
		buttons.library = __( 'My Library', 'templates-patterns-collection' );
	}

	const [ isSyncing, setSyncing ] = useState( false );
	const { isLicenseOpen, setLicenseOpen } = useContext( LicensePanelContext );
	const isValid = 'valid' === license?.valid || 'valid' === license?.license;

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

	const onHashChanged = () => {
		const hash = getTabHash( buttons );
		if ( null === hash ) {
			return;
		}

		const menu = document.getElementById( 'menu-appearance' );
		const libraryLink = menu.querySelector(
			'a[href="themes.php?page=tiob-starter-sites#library"]'
		);
		const starterLink = menu.querySelector(
			'a[href="themes.php?page=tiob-starter-sites"]'
		);

		// This is used only to set the active state of the links from the left admin nav.
		// So we check that those items exist before trying to mutate them.
		if ( libraryLink && starterLink ) {
			const libraryItem = libraryLink.parentElement;
			const starterSitesItem = starterLink.parentElement;
			const activeItem = menu.querySelector( '.current' );

			activeItem.classList.remove( 'current' );
			libraryItem.classList.remove( 'current' );
			if ( hash === 'library' ) {
				libraryItem.classList.add( 'current' );
			} else {
				starterSitesItem.classList.add( 'current' );
			}
		}
		setCurrentTab( hash );
	};

	useEffect( () => {
		onHashChanged();
		window.addEventListener( 'hashchange', onHashChanged );
	}, [] );

	return (
		<div className="header-nav">
			{ Object.keys( buttons ).map( ( slug ) => {
				return (
					<Button
						href={ '#' + slug }
						key={ slug }
						isTertiary
						isPressed={ slug === currentTab }
						onClick={ ( e ) => {
							e.preventDefault();
							setCurrentTab( slug );
							addUrlHash( slug );
						} }
					>
						{ buttons[ slug ] }
					</Button>
				);
			} ) }
			{ currentTab !== 'starterSites' && ! tiobDash.hideMyLibrary && (
				<Button
					icon={ update }
					onClick={ sync }
					label={ __(
						'Re-sync Library',
						'templates-patterns-collection'
					) }
					className={ classnames( 'is-icon-btn', {
						'is-loading': isSyncing,
					} ) }
					disabled={ isFetching || isSyncing }
					data-content={ __(
						'Sync',
						'templates-patterns-collection'
					) }
				/>
			) }
			{ currentTab !== 'starterSites' && ! tiobDash.hideMyLibrary && (
				<>
					<Button
						icon={ ! isLicenseOpen ? cloud : close }
						onClick={ () => {
							setLicenseOpen( ! isLicenseOpen );
						} }
						label={ __(
							'License',
							'templates-patterns-collection'
						) }
						className={ classnames( 'is-icon-btn', {
							'is-not-valid': ! isLicenseOpen && ! isValid,
							'is-valid': ! isLicenseOpen && isValid,
						} ) }
						data-content={ __(
							'License',
							'templates-patterns-collection'
						) }
					/>
					{ isLicenseOpen && <License /> }
				</>
			) }
		</div>
	);
};

const Header = ( {
	isOnboarding,
	cancelOnboarding,
	setCurrentTab,
	currentTab,
	license,
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
							<span>
								{ __(
									'Templates Cloud',
									'templates-patterns-collection'
								) }
							</span>
						</h2>
						<TabNavigation
							setCurrentTab={ setCurrentTab }
							currentTab={ currentTab }
							license={ license }
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
		const {
			getOnboardingStatus,
			getCurrentTab,
			getFetching,
			getLicense,
		} = select( 'neve-onboarding' );
		return {
			isOnboarding: getOnboardingStatus(),
			currentTab: getCurrentTab(),
			isFetching: getFetching(),
			license: getLicense(),
		};
	} )
)( Header );
