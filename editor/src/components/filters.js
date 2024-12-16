/* global tiTpc */
import classnames from 'classnames';
import { alignJustify, closeSmall, grid, search } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { Button, ToggleControl } from '@wordpress/components';
import { ENTER } from '@wordpress/keycodes';

const sortByOptions = {
	date: __( 'Date', 'templates-patterns-collection' ),
	template_name: __( 'Name', 'templates-patterns-collection' ),
	modified: __( 'Last Modified', 'templates-patterns-collection' ),
};

const Filters = ( {
	showFSE,
	onFSEChange,
	layout,
	sortingOrder,
	setLayout,
	isSearch,
	searchQuery,
	onSearch,
	setSearchQuery,
	setSortingOrder,
	changeOrder,
} ) => {
	return (
		<div className="filters">
			<div className="display-sorting">
				<div className="sorting-label">{ __( 'Sort by','templates-patterns-collection' ) }</div>

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
				{ tiTpc.params.type === 'gutenberg' && tiTpc.isFSETheme && (
					<div className="filter-fse">
						<ToggleControl
							label={ __(
								'Show FSE Templates',
								'templates-patterns-collection'
							) }
							onChange={ onFSEChange }
							checked={ showFSE }
						/>
					</div>
				) }
			</div>

			<div className="view-filters">
				<div className="search-filters">
					<input
						placeholder={ __(
							'Search for a template…',
							'templates-patterns-collection'
						) }
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
							label={ __(
								'Clear search query',
								'templates-patterns-collection'
							) }
							icon={ closeSmall }
							onClick={ () => {
								setSearchQuery( '' );
								onSearch( '' );
							} }
						/>
					) : (
						<Button
							label={ __(
								'Search',
								'templates-patterns-collection'
							) }
							icon={ search }
							onClick={ () => onSearch() }
						/>
					) }
				</div>

				<Button
					label={ __( 'List View', 'templates-patterns-collection' ) }
					icon={ alignJustify }
					onClick={ () => setLayout( 'list' ) }
					isPressed={ 'list' === layout }
				/>

				<Button
					label={ __( 'Grid View', 'templates-patterns-collection' ) }
					icon={ grid }
					onClick={ () => setLayout( 'grid' ) }
					isPressed={ 'grid' === layout }
				/>
			</div>
		</div>
	);
};

export default Filters;
