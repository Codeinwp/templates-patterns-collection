import classnames from 'classnames';

import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

const CategoryButtons = ( { categories, onClick, category, setCurrentCategory } ) => {
	return (
		<div className="category-tabs">
			{ Object.keys( categories ).map( ( key, index ) => {
				const classes = classnames( [
					'tab',
					key,
					{ active: key === category },
				] );

				return (
					<button
						className={ classes }
						key={ index }
						onClick={ () => {
							setCurrentCategory( key );
							if ( onClick ) {
								onClick();
							}
						} }
					>
						{ categories[ key ] }
					</button>
				);
			} ) }
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getCurrentCategory } = select( 'neve-onboarding' );
		return {
			category: getCurrentCategory(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setCurrentCategory } = dispatch( 'neve-onboarding' );
		return {
			setCurrentCategory: ( category ) => {
				setCurrentCategory( category );
			},
		};
	} )
)( CategoryButtons );
