import classnames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

import { cloudUpload, closeSmall, update } from '@wordpress/icons';
import { Button, ButtonGroup, Icon } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';

import icon from './../icon';
import { fetchTemplates, fetchLibrary } from './../data/templates-cloud/index';

const Header = ( { closeModal, getOrder, getSearchQuery } ) => {
	const { setFetching, updateCurrentTab } = useDispatch( 'tpc/beaver' );

	const TABS = {
		templates: window.tiTpc.library.tabs.templates,
	};

	if ( parseInt( window.tiTpc.tier ) === 3 ) {
		TABS.library = window.tiTpc.library.tabs.library;
	}

	const isFetching = useSelect( ( select ) =>
		select( 'tpc/beaver' ).isFetching()
	);

	const isPreview = useSelect( ( select ) =>
		select( 'tpc/beaver' ).isPreview()
	);

	const currentTab = useSelect( ( select ) =>
		select( 'tpc/beaver' ).getCurrentTab()
	);

	const syncLibrary = async () => {
		window.localStorage.setItem( 'tpcCacheBuster', uuidv4() );
		setFetching( true );

		const order = getOrder();

		await fetchTemplates( {
			search: getSearchQuery(),
			...order,
		} );

		await fetchLibrary( {
			search: getSearchQuery(),
			...order,
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
				{ ! isPreview && (
					<ButtonGroup>
						{ 'library' === currentTab && (
							<Button
								label={ window.tiTpc.library.actions.sync }
								icon={ update }
								disabled={ isFetching }
								className={ classnames( 'is-sync', {
									'is-loading': isFetching,
								} ) }
								onClick={ syncLibrary }
							/>
						) }

						{ window.tiTpc.postTypes.includes(
							window.tiTpc.postType
						) &&
							parseInt( window.tiTpc.tier ) === 3 && (
							<Button
								label={ window.tiTpc.library.actions.save }
								icon={ cloudUpload }
								onClick={ () =>
									updateCurrentTab( 'export' )
								}
							/>
						) }
					</ButtonGroup>
				) }

				<Button
					label={ window.tiTpc.library.actions.close }
					icon={ closeSmall }
					onClick={ closeModal }
				/>
			</div>
		</div>
	);
};

export default Header;
