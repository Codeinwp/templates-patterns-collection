/* global tiobDash */
import classnames from 'classnames';

import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

const CategoriesTabs = ( {
	categories,
	count,
	category,
	setCurrentCategory,
	showCount = false,
} ) => {
	return (
		<div className="editor-tabs">
			{ Object.keys( categories ).map( ( key, index ) => {
				if ( 1 > count[ key ] ) {
					return null;
				}
				if (
					tiobDash &&
					tiobDash.isValidLicense === '1' &&
					'free' === key
				) {
					return null;
				}
				const classes = classnames( [
					'tab',
					key,
					{ active: key === category },
				] );
				return (
					<a
						key={ index }
						href="#"
						className={ classes }
						onClick={ ( e ) => {
							e.preventDefault();
							setCurrentCategory( key );
						} }
					>
						<span className="editor">{ categories[ key ] }</span>
						{ showCount && (
							<span className="count">{ count[ key ] }</span>
						) }
					</a>
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
			setCurrentCategory: ( category ) => setCurrentCategory( category ),
		};
	} )
)( CategoriesTabs );
