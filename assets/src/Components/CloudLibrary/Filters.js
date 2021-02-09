import classnames from 'classnames';
import { alignJustify, grid, search } from '@wordpress/icons';
import { ENTER } from '@wordpress/keycodes';
import { __ } from '@wordpress/i18n';
import { Button, Icon } from '@wordpress/components';

const sortByOptions = {
	date: __( 'Date' ),
	template_name: __( 'Name' ),
	modified: __( 'Last Modified' ),
};

const Filters = ( {
	isGrid,
	setGrid,
	searchQuery,
	setSearchQuery,
	onSearch,
	sortingOrder,
	setSortingOrder,
	changeOrder,
} ) => {
	return (
		<div className="filters">
			<div className="header-form">
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

				<div className="display-filters">
					<div className="display-filters__search">
						<input
							placeholder={ __( 'Search' ) }
							value={ searchQuery }
							onChange={ ( e ) =>
								setSearchQuery( e.target.value )
							}
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
						onClick={ () => setGrid( false ) }
						isPressed={ ! isGrid }
					/>

					<Button
						label={ __( 'Grid View' ) }
						icon={ grid }
						onClick={ () => setGrid( true ) }
						isPressed={ isGrid }
					/>
				</div>
			</div>
		</div>
	);
};

export default Filters;
