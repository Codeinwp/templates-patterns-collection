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
		console.log( hash );
		if ( null === hash ) {
			return;
		}

		let menu = document.getElementById( 'toplevel_page_neve-welcome' );
		if ( ! menu ) {
			menu = document.getElementById( 'menu-appearance' );
		}
		const tiobMenu = document.getElementById( 'toplevel_page_tiob-plugin' );

		console.log( {menu} );
		console.log( {tiobMenu} );

		const lookupHashList = [ '#pageTemplates', '#settings' ];
		const itemHashList = lookupHashList.map( ( itemHash ) => {
			console.log( {itemHash} );
			return {
				hash: itemHash,
				item: menu.querySelector( `a[href="themes.php?page=tiob-starter-sites${ itemHash }"]` )
					|| menu.querySelector( `a[href="admin.php?page=tiob-starter-sites${ itemHash }"]` )
					|| tiobMenu.querySelector( `a[href="admin.php?page=tiob-plugin${ itemHash }"]` ),
			}
		} );
		console.log( {itemHashList} );

		const hasAllItemsDefined = itemHashList.reduce( ( acc, link ) => { return ( link?.item ) ? ++acc : acc }, 0 ) === itemHashList.length;

		if ( hasAllItemsDefined ) {
			for ( let i in itemHashList ) {
				const link = itemHashList[ i ];
				console.log( link.hash, hash );
				if ( link.hash.replace('#', '') === hash ) {
					let siblings = link.item.parentElement.parentElement.children;
					for ( let child of siblings ) {
						child.classList.remove( 'current' );
					}
					link.item.parentElement.classList.add( 'current' );
				}
			}
		}

		//const menu = document.getElementById( 'menu-appearance' );
		// const libraryLink = menu.querySelector(
		// 	'a[href="themes.php?page=tiob-starter-sites#library"]'
		// ) ||  menu.querySelector(
		// 	'a[href="admin.php?page=tiob-starter-sites#library"]'
		// );
		// const pageTemplatesLink = menu.querySelector(
		// 	'a[href="themes.php?page=tiob-starter-sites#pageTemplates"]'
		// );
		// const starterLink = menu.querySelector(
		// 	'a[href="themes.php?page=tiob-starter-sites"]'
		// );

		// console.log( libraryLink );

		// This is used only to set the active state of the links from the left admin nav.
		// So we check that those items exist before trying to mutate them.
		// if ( libraryLink && starterLink ) {
		// 	const libraryItem = libraryLink.parentElement;
		// 	const pageTemplatesItem = pageTemplatesLink.parentElement;
		// 	const starterSitesItem = starterLink.parentElement;
		// 	const activeItem = menu.querySelector( '.current' );
		//
		// 	activeItem.classList.remove( 'current' );
		// 	libraryItem.classList.remove( 'current' );
		// 	pageTemplatesItem.classList.remove( 'current' );
		// 	switch ( hash ) {
		// 		case 'library':
		// 			libraryItem.classList.add( 'current' );
		// 			break;
		// 		case 'pageTemplates':
		// 			pageTemplatesItem.classList.add( 'current' );
		// 			break;
		// 		default:
		// 			starterSitesItem.classList.add( 'current' );
		// 	}
		// }
		setCurrentTab( hash );
	};

	useEffect( () => {
		onHashChanged();
		window.addEventListener( 'hashchange', onHashChanged );
	}, [] );

	return (
		<div className="header-nav">
			{/*{ Object.keys( buttons ).map( ( slug ) => {*/}
			{/*	return (*/}
			{/*		<Button*/}
			{/*			href={ '#' + slug }*/}
			{/*			key={ slug }*/}
			{/*			isTertiary*/}
			{/*			isPressed={ slug === currentTab }*/}
			{/*			onClick={ ( e ) => {*/}
			{/*				e.preventDefault();*/}
			{/*				setCurrentTab( slug );*/}
			{/*				addUrlHash( slug );*/}
			{/*			} }*/}
			{/*		>*/}
			{/*			{ buttons[ slug ] }*/}
			{/*		</Button>*/}
			{/*	);*/}
			{/*} ) }*/}
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
			{/*{ currentTab !== 'starterSites' && ! tiobDash.hideMyLibrary && (*/}
			{/*	<>*/}
			{/*		<Button*/}
			{/*			icon={ ! isLicenseOpen ? cloud : close }*/}
			{/*			onClick={ () => {*/}
			{/*				setLicenseOpen( ! isLicenseOpen );*/}
			{/*			} }*/}
			{/*			label={ __(*/}
			{/*				'License',*/}
			{/*				'templates-patterns-collection'*/}
			{/*			) }*/}
			{/*			className={ classnames( 'is-icon-btn', {*/}
			{/*				'is-not-valid': ! isLicenseOpen && ! isValid,*/}
			{/*				'is-valid': ! isLicenseOpen && isValid,*/}
			{/*			} ) }*/}
			{/*			data-content={ __(*/}
			{/*				'License',*/}
			{/*				'templates-patterns-collection'*/}
			{/*			) }*/}
			{/*		/>*/}
			{/*		{ isLicenseOpen && <License /> }*/}
			{/*	</>*/}
			{/*) }*/}
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
