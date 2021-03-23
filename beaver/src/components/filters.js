import classnames from 'classnames';
import { alignJustify, closeSmall, grid, search } from '@wordpress/icons';
import { Button, Icon } from '@wordpress/components';
import { ENTER } from '@wordpress/keycodes';

const sortByOptions = {
	date: window.tiTpc.library.filters.sortLabels.date,
	template_name: window.tiTpc.library.filters.sortLabels.name,
	modified: window.tiTpc.library.filters.sortLabels.modified,
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
	isSearch,
} ) => {
	return (
		<div className="filters">
			<div className="display-sorting">
				<div className="sorting-label">
					{ window.tiTpc.library.filters.sortLabel }
				</div>

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
						placeholder={ window.tiTpc.library.filters.searchLabel }
						className="filter-search"
						value={ searchQuery }
						onChange={ ( e ) => setSearchQuery( e.target.value ) }
						onKeyDown={ ( e ) => {
							if ( e.keyCode === ENTER ) {
								onSearch();
							}
						} }
					/>

					{ isSearch ? (
						<Button
							label={ window.tiTpc.library.filters.clearSearch }
							icon={ closeSmall }
							onClick={ () => {
								setSearchQuery( '' );
								onSearch( '' );
							} }
						/>
					) : (
						<Icon icon={ search } />
					) }
				</div>

				<Button
					label={ window.tiTpc.library.filters.sortLabels.list }
					icon={ alignJustify }
					onClick={ () => setLayout( 'list' ) }
					isPressed={ 'list' === layout }
				/>

				<Button
					label={ window.tiTpc.library.filters.sortLabels.grid }
					icon={ grid }
					onClick={ () => setLayout( 'grid' ) }
					isPressed={ 'grid' === layout }
				/>
			</div>
		</div>
	);
};

export default Filters;
