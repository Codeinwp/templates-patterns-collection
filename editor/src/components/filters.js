/**
 * External dependencies
 */
import { alignJustify, grid } from '@wordpress/icons';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { Button } = wp.components;

const Filters = ( { layout, setLayout } ) => {
	return (
		<div className="wp-block-ti-tpc-templates-cloud__modal-content__filters">
			<div className="wp-block-ti-tpc-templates-cloud__modal-content__filters__display">
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
