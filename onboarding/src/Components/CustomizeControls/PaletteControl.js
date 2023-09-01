import { __ } from '@wordpress/i18n';
import { sendPostMessage } from '../../utils/common';
import { withDispatch } from '@wordpress/data';
import { Button } from '@wordpress/components';
import classnames from 'classnames';
import SVG from '../../utils/svg';

const PaletteControl = ( {
	importData,
	setImportData,
	siteStyle,
	setSiteStyle,
} ) => {
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

	const handlePaletteClick = ( paletteKey ) => {
		const newStyle = {
			...siteStyle,
			palette: paletteKey,
		};

		setSiteStyle( newStyle );

		setImportData( ( prevData ) => ( {
			...prevData,
			theme_mods: {
				...prevData.theme_mods,
				neve_global_colors: {
					...prevData.theme_mods.neve_global_colors,
					activePalette: paletteKey,
				},
			},
		} ) );

		sendPostMessage( {
			type: 'styleChange',
			data: newStyle,
		} );
	};

	return (
		allPalettes && (
			<div className="ob-ctrl">
				<div className="ob-ctrl-head">
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

export default withDispatch( ( dispatch ) => {
	const { setOnboardingStep } = dispatch( 'ti-onboarding' );
	return {
		handlePrevStepClick: () => {
			setOnboardingStep( 2 );
		},
	};
} )( PaletteControl );
