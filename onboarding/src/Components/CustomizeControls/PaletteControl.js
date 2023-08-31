import { __ } from '@wordpress/i18n';
import { sendPostMessage } from '../../utils/common';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Button } from '@wordpress/components';
import classnames from 'classnames';
import SVG from '../../utils/svg';

const PaletteControl = ( {
	importSettings,
	handlePaletteChange,
	palettes,
	setImportData,
} ) => {
	const { palette } = importSettings;

	const renderColorDivs = ( currentPalette ) => {
		if ( ! currentPalette.colors ) {
			return null; // Skip palettes with null colors
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

	const handlePaletteClick = ( event ) => {
		const paletteKey = event.currentTarget.getAttribute( 'data-slug' );
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
		handlePaletteChange( paletteKey );
	};

	return (
		palettes && (
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
						onClick={ () => handlePaletteChange( 'base' ) }
					/>
				</div>
				<div className="ob-ctrl-wrap palette">
					{ palettes &&
						Object.keys( palettes ).map( ( paletteKey ) => (
							<button
								className={ classnames( [
									'ob-palette',
									{ 'ob-active': paletteKey === palette },
								] ) }
								title={ palettes[ paletteKey ].name }
								data-slug={ paletteKey }
								key={ paletteKey }
								onClick={ handlePaletteClick }
							>
								{ renderColorDivs( palettes[ paletteKey ] ) }
							</button>
						) ) }
				</div>
			</div>
		)
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getCurrentSite, getImportSettings } = select( 'ti-onboarding' );
		return {
			siteData: getCurrentSite(),
			importSettings: getImportSettings(),
		};
	} ),
	withDispatch( ( dispatch, { importSettings } ) => {
		const { setOnboardingStep, setImportSettings } = dispatch(
			'ti-onboarding'
		);
		return {
			handlePrevStepClick: () => {
				setOnboardingStep( 2 );
			},
			handlePaletteChange: ( newPalette ) => {
				const updatedSettings = {
					...importSettings,
					palette: newPalette,
				};
				setImportSettings( updatedSettings );
				sendPostMessage( {
					type: 'styleChange',
					data: updatedSettings,
				} );
			},
		};
	} )
)( PaletteControl );
