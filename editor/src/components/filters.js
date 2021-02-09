import classnames from 'classnames';
import { alignJustify, grid, search } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { Button, Icon } from '@wordpress/components';
import { ENTER } from '@wordpress/keycodes';

const sortByOptions = {
	date: __( 'Date' ),
	template_name: __( 'Name' ),
	modified: __( 'Last Modified' ),
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
	return (
		<div className="filters">
			<div className="display-sorting">
				<div className="sorting-label">{ __( 'Sort by' ) }</div>

				<div className="sorting-filter">
					{ Object.keys( sortByOptions ).map( ( i ) => (
						<Button
							key={ i }
							className={ classnames( {
								'is-selected': i === sortingOrder.orderby,
								'is-asc': 'ASC' === sortingOrder.order,
							} ) }
							onClick={ () => {
								const order = {
									order: 'DESC',
									orderby: i,
								};

								if ( i === sortingOrder.orderby ) {
									if ( 'DESC' === sortingOrder.order ) {
										order.order = 'ASC';
									}
								}
								setSortingOrder( {
									...order,
								} );
								changeOrder( {
									...order,
								} );
							} }
						>
							{ sortByOptions[ i ] }
						</Button>
					) ) }
				</div>
			</div>

			<div className="view-filters">
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

					<Icon icon={ search } />
				</div>

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
