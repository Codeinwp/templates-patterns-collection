import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { Button } from '@wordpress/components';
import classnames from 'classnames';
import SVG from '../../utils/svg';

const PaletteControl = ( { importData, siteStyle, handlePaletteClick } ) => {
	const themeMods = importData?.theme_mods;
	const allPalettes = themeMods?.neve_global_colors?.palettes;
	const { palette } = siteStyle;

	const renderColorDivs = ( currentPalette ) => {
		if ( ! currentPalette.colors ) {
			return null;
		}

		const colorKeys = Object.keys( currentPalette.colors );
		const excludedColorKeys = colorKeys.slice( 0, colorKeys.length - 2 );

		return (
			<>
				{ excludedColorKeys.map( ( colorKey ) => (
					<div
						className="color"
						key={ colorKey }
						style={ {
							backgroundColor: currentPalette.colors[ colorKey ],
						} }
					></div>
				) ) }
			</>
		);
	};

	return (
		allPalettes && (
			<div className="ob-ctrl">
				<div className="ob-ctrl-head small-gap">
					<h3>
						{ __(
							'Color Palette',
							'templates-patterns-collection'
						) }
					</h3>
					<Button
						icon={ SVG.redo }
						onClick={ () => handlePaletteClick( 'base' ) }
					/>
				</div>
				<div className="ob-ctrl-wrap palette">
					{ allPalettes &&
						Object.keys( allPalettes ).map( ( paletteKey ) => (
							<button
								className={ classnames( [
									'ob-palette',
									{ 'ob-active': paletteKey === palette },
								] ) }
								title={ allPalettes[ paletteKey ].name }
								data-slug={ paletteKey }
								key={ paletteKey }
								onClick={ () =>
									handlePaletteClick( paletteKey )
								}
							>
								{ renderColorDivs( allPalettes[ paletteKey ] ) }
							</button>
						) ) }
				</div>
			</div>
		)
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getImportData } = select( 'ti-onboarding' );
		return {
			importData: getImportData(),
		};
	} ),
	withDispatch( ( dispatch, { importData, siteStyle, setSiteStyle } ) => {
		const { setImportData, setRefresh } = dispatch( 'ti-onboarding' );

		return {
			handlePaletteClick: ( paletteKey ) => {
				const newStyle = {
					...siteStyle,
					palette: paletteKey,
				};
				setSiteStyle( newStyle );

				const newImportData = {
					...importData,
					theme_mods: {
						...importData.theme_mods,
						neve_global_colors: {
							...importData.theme_mods.neve_global_colors,
							activePalette: paletteKey,
						},
					},
				};
				setImportData( newImportData );
				setRefresh( true );
			},
		};
	} )
)( PaletteControl );
