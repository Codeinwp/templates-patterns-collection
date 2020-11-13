/* global tiobDash */
import { alignJustify, grid } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { Button, TextControl } from '@wordpress/components';

const Filters = ( {
	isGrid,
	setGrid,
	searchQuery,
	setSearchQuery,
	onSearch,
} ) => {
	const onSubmit = ( e ) => {
		e.preventDefault();
		onSearch();
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
						value={ searchQuery }
						onChange={ setSearchQuery }
						placeholder={ __( 'Search for a template' ) + '…' }
					/>
				</form>
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
