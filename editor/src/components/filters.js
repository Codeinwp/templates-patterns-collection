import { alignJustify, grid } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

const Filters = ( { layout, setLayout } ) => {
	return (
		<div className="filters">
			<div className="display-filters">
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
