import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import classnames from 'classnames';

const CategoryButtons = ( {
	categories,
	onClick,
	category,
	setCurrentCategory,
} ) => {
	return (
		<div className="ob-cat-wrap">
			{ Object.keys( categories ).map( ( key, index ) => {
				const classes = classnames( {
					cat: true,
					[ key ]: true,
					active: key === category,
				} );

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
		const { getCurrentCategory } = select( 'ti-onboarding' );
		return {
			category: getCurrentCategory(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setCurrentCategory } = dispatch( 'ti-onboarding' );
		return {
			setCurrentCategory: ( category ) => {
				setCurrentCategory( category );
			},
		};
	} )
)( CategoryButtons );
