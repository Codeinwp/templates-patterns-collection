/* global tiobDash */
import classnames from 'classnames';
import { alignJustify, closeSmall, grid, search } from '@wordpress/icons';
import { ENTER } from '@wordpress/keycodes';
import { __ } from '@wordpress/i18n';
import { Button, ToggleControl, Dashicon, Popover } from '@wordpress/components';
import {useState} from '@wordpress/element';

const sortByOptions = {
	date: __( 'Date', 'templates-patterns-collection' ),
	template_name: __( 'Name', 'templates-patterns-collection' ),
	modified: __( 'Last Modified', 'templates-patterns-collection' ),
};

const EditorSelector = ( { type, setType } ) => {
	const [ open, setOpen ] = useState( false );
	const toggleDropdown = () => setOpen( ! open );

	const EDITOR_MAP = {
		gutenberg: {
			label: __( 'Gutenberg', 'templates-patterns-collection' ),
			icon: 'gutenberg.jpg',
		},
		elementor: {
			label: __( 'Elementor', 'templates-patterns-collection' ),
			icon: 'elementor.jpg',
		},
		beaver: {
			label: __( 'Beaver', 'templates-patterns-collection' ),
			icon: 'beaver.jpg',
		},
	};

	const editorMapFiltered = Object.keys( EDITOR_MAP ).filter( ( key ) => {
		return key !== type;
	});

	const wrapClasses = classnames( [
		'ob-dropdown',
		'editor-selector',
		'filter-selector',
	] );
	return (
		<div className={ wrapClasses }>
			<Button onClick={ toggleDropdown } className="select ob-dropdown">
				<Dashicon
					size={ 14 }
					icon={ open ? 'arrow-up-alt2' : 'arrow-down-alt2' }
				/>
				<img
					className="editor-icon"
					src={ tiobDash.assets + 'img/' + EDITOR_MAP[ type ].icon }
					alt={ __(
						'Builder Logo',
						'templates-patterns-collection'
					) }
				/>
				{ open && (
					<Popover
						position="bottom center"
						onClose={ toggleDropdown }
						noArrow
						inline
					>
						{ open && (
							<ul className="options">
								{ editorMapFiltered.map( ( key, index ) => {
									return (
										<li key={ index }>
											<a
												href="#"
												onClick={ ( e ) => {
													e.preventDefault();
													setType( key );
													setOpen( false );
												} }
											>
												<img
													className="editor-icon"
													src={
														tiobDash.assets +
														'img/' +
														EDITOR_MAP[ key ].icon
													}
													alt={ EDITOR_MAP[ key ].label }
												/>
											</a>
										</li>
									);
								} ) }
							</ul>
						) }
					</Popover>
				) }
			</Button>
		</div>
	);
};

const Filters = ( {
	isGrid,
	setGrid,
	isSearch,
	searchQuery,
	setSearchQuery,
	onSearch,
	sortingOrder,
	setSortingOrder,
	changeOrder,
	EDITOR_MAP,
	type,
	setType,
	showFSE,
	setShowFSE,
} ) => {
	return (
		<div className="filters">
			<div className="header-form">
				<div className="display-sorting">
					<div className="sorting-label">{ __( 'Sort by', 'templates-patterns-collection' ) }</div>

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
					{ type === 'gutenberg' && tiobDash.isFSETheme && (
						<div className="filter-fse">
							<ToggleControl
								label={ __( 'Show FSE Templates', 'templates-patterns-collection' ) }
								onChange={ setShowFSE }
								checked={ showFSE }
							/>
						</div>
					) }
				</div>

				<div className="display-filters">
					<div className="display-filters__search">
						<input
							placeholder={ __( 'Search', 'templates-patterns-collection' ) }
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

						{ isSearch ? (
							<Button
								label={ __( 'Clear search query', 'templates-patterns-collection' ) }
								icon={ closeSmall }
								onClick={ () => {
									setSearchQuery( '' );
									onSearch( '' );
								} }
							/>
						) : (
							<Button
								label={ __( 'Search', 'templates-patterns-collection' ) }
								icon={ search }
								onClick={ () => onSearch() }
							/>
						) }
					</div>

					<Button
						label={ __( 'List View', 'templates-patterns-collection' ) }
						icon={ alignJustify }
						onClick={ () => setGrid( false ) }
						isPressed={ ! isGrid }
					/>

					<Button
						label={ __( 'Grid View', 'templates-patterns-collection' ) }
						icon={ grid }
						onClick={ () => setGrid( true ) }
						isPressed={ isGrid }
					/>
					<EditorSelector EDITOR_MAP={EDITOR_MAP} type={ type } setType={ setType } />
				</div>
			</div>
		</div>
	);
};

export default Filters;
