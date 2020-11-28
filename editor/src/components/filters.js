import { alignJustify, check, grid } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { Button, Dropdown, MenuItem } from '@wordpress/components';

const sortingOptions = {
	DESC: __( 'Latest first' ),
	ASC: __( 'Oldest first' ),
};

const Filters = ( {
	layout,
	sortingOrder,
	setLayout,
	setSortingOrder,
	changeOrder,
} ) => {
	const getSortingItems = () => {
		const items = [];

		for ( const [ key, value ] of Object.entries( sortingOptions ) ) {
			const item = (
				<MenuItem
					icon={ key === sortingOrder && check }
					isSelected={ key === sortingOrder }
					onClick={ () => {
						setSortingOrder( key );
						changeOrder( key );
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
	);
};

export default Filters;
