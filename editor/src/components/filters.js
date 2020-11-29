import { alignJustify, check, grid } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { Button, Dropdown, MenuItem } from '@wordpress/components';
import { ENTER } from '@wordpress/keycodes';

const sortingOptions = {
	DESC: __( 'Latest first' ),
	ASC: __( 'Oldest first' ),
};

const Filters = ( {
	layout,
	sortingOrder,
	setLayout,
	searchQuery,
	onSearch,
	setSearchQuery,
	setSortingOrder,
	changeOrder,
} ) => {
	const getSortingItems = ( { onToggle } ) => {
		const items = [];

		for ( const [ key, value ] of Object.entries( sortingOptions ) ) {
			const item = (
				<MenuItem
					icon={ key === sortingOrder && check }
					isSelected={ key === sortingOrder }
					onClick={ () => {
						setSortingOrder( key );
						changeOrder( key );
						onToggle();
					} }
				>
					{ value }
				</MenuItem>
			);

			items.push( item );
		}

		return items;
	};

	return (
		<div className="filters">
			<div className="search-filters">
				<input
					placeholder={ __( 'Search for a template…' ) }
					className="filter-search"
					value={ searchQuery }
					onChange={ ( e ) => setSearchQuery( e.target.value ) }
					onKeyDown={ ( e ) => {
						if ( e.keyCode === ENTER ) {
							onSearch();
						}
					} }
				/>

				<Dropdown
					position="bottom center"
					contentClassName="filter-overlay"
					popoverProps={ {
						noArrow: false,
					} }
					renderToggle={ ( { isOpen, onToggle } ) => (
						<Button
							onClick={ onToggle }
							aria-expanded={ isOpen }
							className={ 'filter-input' }
						>
							{ sortingOptions[ sortingOrder ] }
						</Button>
					) }
					renderContent={ getSortingItems }
				/>
			</div>

			<div className="view-filters">
				<Button
					label={ __( 'List View' ) }
					icon={ alignJustify }
					onClick={ () => setLayout( 'list' ) }
					isPressed={ 'list' === layout }
				/>

				<Button
					label={ __( 'Grid View' ) }
					icon={ grid }
					onClick={ () => setLayout( 'grid' ) }
					isPressed={ 'grid' === layout }
				/>
			</div>
		</div>
	);
};

export default Filters;
