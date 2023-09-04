import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import classnames from 'classnames';

const CategoryButtons = ( { category, categories, onClick, style } ) => {
	return (
		<div className="ob-cat-wrap" style={ style }>
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
						onClick={ () => onClick( key ) }
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
		const { setOnboardingStep, setCategory } = dispatch( 'ti-onboarding' );
		return {
			onClick: ( newCategory ) => {
				setCategory( newCategory );
				setOnboardingStep( 2 );
			},
		};
	} )
)( CategoryButtons );
