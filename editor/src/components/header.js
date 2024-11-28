/* global tiTpc */
import classnames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

import { closeSmall, update } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { Button, ButtonGroup, Icon } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';

import icon from './../icon';
import { fetchTemplates, fetchLibrary } from './../data/templates-cloud/index';

const Header = ( { closeModal, getOrder, getSearchQuery } ) => {
	const { setFetching, updateCurrentTab } = useDispatch( 'tpc/block-editor' );

	const TABS = {
		library : __( 'My Library', 'templates-patterns-collection' )
		// Removed since PRF.
		// templates: __( 'Page Templates', 'templates-patterns-collection' ),
	};

	const isFetching = useSelect( ( select ) =>
		select( 'tpc/block-editor' ).isFetching()
	);
	const isPreview = useSelect( ( select ) =>
		select( 'tpc/block-editor' ).isPreview()
	);
	const currentTab = useSelect( ( select ) =>
		select( 'tpc/block-editor' ).getCurrentTab()
	);

	const syncLibrary = async () => {
		window.localStorage.setItem( 'tpcCacheBuster', uuidv4() );
		setFetching( true );

		const order = getOrder();

		await fetchTemplates( {
			search: getSearchQuery(),
			...order,
			showFSE: tiTpc.isFSETheme
				? window?.localStorage?.tpcShowFse === 'true'
				: false,
		} );

		await fetchLibrary( {
			search: getSearchQuery(),
			...order,
			showFSE: tiTpc.isFSETheme
				? window?.localStorage?.tpcShowFse === 'true'
				: false,
		} );

		setFetching( false );
	};

	return (
		<div className="modal-header">
			<div className="left">
				<Icon icon={ icon } />
			</div>

			<div className="center">
				{ Object.keys( TABS ).map( ( i ) => (
					<Button
						key={ i }
						onClick={ () => updateCurrentTab( i ) }
						className={ classnames( 'tabs', {
							'is-active': i === currentTab,
						} ) }
					>
						{ TABS[ i ] }
					</Button>
				) ) }
			</div>

			<div className="right">
				{ 'library' === currentTab && ! isPreview && (
					<ButtonGroup>
						<Button
							label={ __(
								'Re-sync Library',
								'templates-patterns-collection'
							) }
							icon={ update }
							disabled={ isFetching }
							className={ classnames( 'is-sync', {
								'is-loading': isFetching,
							} ) }
							onClick={ syncLibrary }
						/>
					</ButtonGroup>
				) }

				<Button
					label={ __(
						'Close Modal',
						'templates-patterns-collection'
					) }
					icon={ closeSmall }
					onClick={ closeModal }
				/>
			</div>
		</div>
	);
};

export default Header;
