/**
 * External dependencies
 */
import {
	closeSmall,
	update
} from '@wordpress/icons';

import classnames from 'classnames';

import { v4 as uuidv4 } from 'uuid';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
	Button,
	ButtonGroup,
	Icon
} = wp.components;

const {
	useDispatch,
	useSelect
} = wp.data;

/**
 * Internal dependencies
 */
import icon from './../icon.js';

import { fetchTemplates } from './../data/templates-cloud/index.js';

const TABS = {
	'templates': __( 'Page Templates' ),
	'patterns': __( 'Patterns' ),
	'library': __( 'My Library' )
};

const Header = ({
	closeModal
}) => {
	const {
		updateCurrentTab,
		updateTemplates
	} = useDispatch( 'tpc/block-editor' );

	const currentTab = useSelect( select => select( 'tpc/block-editor' ).getCurrentTab() );
	const isFetching = useSelect( select => select( 'tpc/block-editor' ).isFetching() );

	const syncLibrary = async() => {
		window.localStorage.setItem( 'tpcCacheBuster', uuidv4() );
		const response = await fetchTemplates();
		return updateTemplates( response );
	};

	return (
		<div className="wp-block-themeisle-blocks-templates-cloud__modal-header">
			<div className="wp-block-themeisle-blocks-templates-cloud__modal-header__left">
				<Icon
					icon={ icon }
				/>
			</div>

			<div className="wp-block-themeisle-blocks-templates-cloud__modal-header__center">
				{ Object.keys( TABS ).map( i => (
					<Button
						onClick={ () => updateCurrentTab( i ) }
						className={ classnames(
							'wp-block-themeisle-blocks-templates-cloud__modal-header__tabs',
							{
								'is-active': i === currentTab
							}
						) }
					>
						{ TABS[ i ] }
					</Button>

				) ) }
			</div>

			<div className="wp-block-themeisle-blocks-templates-cloud__modal-header__right">
				{ 'library' === currentTab && (
					<ButtonGroup>
						<Button
							label={ __( 'Re-sync Library' ) }
							icon={ update }
							className={ classnames(
								'is-sync',
								{
									'is-loading': isFetching
								}
							) }
							onClick={ syncLibrary }
						/>
					</ButtonGroup>
				) }

				<Button
					label={ __( 'Close Modal' ) }
					icon={ closeSmall }
					onClick={ closeModal }
				/>
			</div>
		</div>
	);
};

export default Header;
