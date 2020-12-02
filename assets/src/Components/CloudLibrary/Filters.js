/* global tiobDash */
import classnames from 'classnames';
import { alignJustify, check, grid } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { Button, Dropdown, MenuItem, TextControl } from '@wordpress/components';

const sortingOptions = {
	DESC: __( 'Descending' ),
	ASC: __( 'Ascending' ),
};

const sortByOptions = {
	date: __( 'by creation date' ),
	modified: __( 'by modification date' ),
	template_name: __( 'by template name' ),
};

const Filters = ( {
	currentTab,
	isGrid,
	setGrid,
	searchQuery,
	setSearchQuery,
	onSearch,
	sortingOrder,
	setSortingOrder,
	changeOrder,
} ) => {
	const onSubmit = ( e ) => {
		e.preventDefault();
		onSearch();
	};

	const getSortingItems = ( { onToggle } ) => {
		const items = [];

		for ( const [ key, value ] of Object.entries( sortingOptions ) ) {
			const item = (
				<MenuItem
					key={ key }
					icon={ key === sortingOrder.order && check }
					isSelected={ key === sortingOrder.order }
					onClick={ () => {
						setSortingOrder( {
							order: key,
							orderby: sortingOrder.orderby,
						} );

						changeOrder( {
							order: key,
							orderby: sortingOrder.orderby,
						} );

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

	const getSortByItems = ( { onToggle } ) => {
		const items = [];

		for ( const [ key, value ] of Object.entries( sortByOptions ) ) {
			const item = (
				<MenuItem
					key={ key }
					icon={ key === sortingOrder.orderby && check }
					isSelected={ key === sortingOrder.orderby }
					onClick={ () => {
						setSortingOrder( {
							order: sortingOrder.order,
							orderby: key,
						} );

						changeOrder( {
							order: sortingOrder.order,
							orderby: key,
						} );

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
			<div className="header-form">
				<form className="search" onSubmit={ onSubmit }>
					<img
						src={ tiobDash.assets + '/img/search.svg' }
						alt={ __( 'Search Icon' ) }
					/>
					<TextControl
						type="search"
						className={ classnames( {
							'has-filters': 'starterSites' !== currentTab,
						} ) }
						value={ searchQuery }
						onChange={ setSearchQuery }
						placeholder={ __( 'Search for a template' ) + '…' }
					/>
				</form>

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
							{ sortingOptions[ sortingOrder.order ] }
						</Button>
					) }
					renderContent={ getSortingItems }
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
							{ sortByOptions[ sortingOrder.orderby ] }
						</Button>
					) }
					renderContent={ getSortByItems }
				/>

				<div className="display-filters">
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
