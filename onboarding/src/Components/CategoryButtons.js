import { useSelect, useDispatch } from '@wordpress/data';
import classnames from 'classnames';
import { useMemo, useEffect } from '@wordpress/element';

const CategoryButtons = ( { categories, style } ) => {
	const data = useSelect( ( select ) => ( {
		category: select( 'ti-onboarding' ).getCurrentCategory(),
		sitesMetadata: select( 'ti-onboarding' ).getSites(),
		editor: select( 'ti-onboarding' ).getCurrentEditor(),
	} ) );

	const { setCategory } = useDispatch( 'ti-onboarding' );

	const availableCategories = useMemo( () => {
		return Object.keys( categories )
			.filter(
				( key ) =>
					// Show "All" and "Free" categories after user selection.
					data.category || ( key !== 'all' && key !== 'free' )
			)
			.filter( ( key ) => {
				// Hide "Free" is there is not free template available on the selected editor.
				if ( key !== 'free' ) {
					return true;
				}
				return Object.values( data.sitesMetadata.sites?.[ data.editor ] )?.some(
					( site ) => ! site?.upsell
				);
			} );
	}, [ categories, data.category, data.sitesMetadata, data.editor ] );

	const onClick = ( newCategory ) => {
		setCategory( newCategory );
	};

	/**
	 * Default the category to 'all' when the current category is unavailable.
	 */
	useEffect( () => {
		if ( data.category && ! availableCategories.includes( data.category ) ) {
			setCategory( 'all' );
		}
	}, [ data.category, availableCategories, setCategory ] );

	return (
		<div className="ob-cat-wrap" style={ style }>
			{ availableCategories.map( ( catSlug ) => {
				const classes = classnames( {
					cat: true,
					[ catSlug ]: true,
					active: catSlug === data.category,
				} );

				return (
					<button
						className={ classes }
						key={ catSlug }
						onClick={ () => onClick( catSlug ) }
					>
						{ categories[ catSlug ] }
					</button>
				);
			} ) }
		</div>
	);
};

export default CategoryButtons;
