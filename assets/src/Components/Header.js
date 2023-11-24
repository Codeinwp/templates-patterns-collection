/* global tiobDash, localStorage */
import { withSelect, withDispatch } from '@wordpress/data';
import { useEffect, useState, useContext } from '@wordpress/element';
import { Button, Icon } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { update, cloud, close } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import Logo, { NeveIcon } from './Icon';
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
	const buttons = {};

	if ( ! tiobDash.hideStarterSites ) {
		buttons.starterSites = __( 'Starter Sites', 'templates-patterns-collection' );
		buttons.pageTemplates = __( 'Page Templates', 'templates-patterns-collection' );
	}

	if ( ! tiobDash.hideMyLibrary ) {
		buttons.library = __( 'My Library', 'templates-patterns-collection' );
	}
	buttons.settings = __( 'Settings', 'templates-patterns-collection' );

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

		let menu = document.getElementById( 'toplevel_page_neve-welcome' );
		if ( ! menu ) {
			menu = document.getElementById( 'menu-appearance' );
		}
		const tiobMenu = document.getElementById( 'toplevel_page_tiob-plugin' );

		const lookupHashList = [ '#pageTemplates', '#settings' ];
		const itemHashList = lookupHashList.map( ( itemHash ) => {
			return {
				hash: itemHash,
				item: menu.querySelector( `a[href="themes.php?page=tiob-starter-sites${ itemHash }"]` )
					|| menu.querySelector( `a[href="admin.php?page=tiob-starter-sites${ itemHash }"]` )
					|| tiobMenu.querySelector( `a[href="admin.php?page=tiob-plugin${ itemHash }"]` ),
			}
		} );

		const hasAllItemsDefined = itemHashList.reduce( ( acc, link ) => { return ( link?.item ) ? ++acc : acc }, 0 ) === itemHashList.length;

		// The logic here is to ensure the sidebar menu items appear as active when the user navigates to a page via the URL hash (through react).
		if ( hasAllItemsDefined ) {
			for ( let i in itemHashList ) {
				const link = itemHashList[ i ];
				if ( link.hash.replace('#', '') === hash ) {
					let siblings = link.item.parentElement.parentElement.children;
					for ( let child of siblings ) {
						child.classList.remove( 'current' );
					}
					link.item.parentElement.classList.add( 'current' );
				}
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
			{ currentTab !== 'starterSites' && currentTab !== 'settings' && ! tiobDash.hideMyLibrary && (
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
		</div>
	);
};

const BrandTitle = ( currentTab ) => {

	let showNeveIcon = false;
	if ( [ 'starterSites', 'pageTemplates' ].includes( currentTab.currentTab ) && ! tiobDash.brandedTheme ) {
		showNeveIcon = true;
	}

	let title = __( 'Templates Cloud', 'templates-patterns-collection' );
	switch ( currentTab.currentTab ) {
		case 'starterSites':
			title = __( 'Starter Sites', 'templates-patterns-collection' );
			break;
		case 'pageTemplates':
			title = __( 'Page Templates', 'templates-patterns-collection' );
			break;
		case 'library':
			title = __( 'My Library', 'templates-patterns-collection' );
			break;
		case 'settings':
			title = __( 'Settings', 'templates-patterns-collection' );
			break;
	}

	return (
		<h2>
			{ showNeveIcon && (
				<Icon icon={ NeveIcon } />
			) }
			{ ! showNeveIcon && (
				<Icon icon={ Logo } />
			) }
			<span>
				{ title }
			</span>
		</h2>
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
						<BrandTitle currentTab={ currentTab } />
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
