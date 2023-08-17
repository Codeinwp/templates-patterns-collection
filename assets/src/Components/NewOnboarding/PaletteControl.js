import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { trailingSlashIt } from '../../utils/common';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Button } from '@wordpress/components';
import classnames from 'classnames';
import { get } from '../../utils/rest';
import SVG from '../../utils/svg';

const PaletteControl = ( { siteData, importSettings, handlePaletteChange } ) => {
	const [ palettes, setPalettes ] = useState( null );
	const { palette } = importSettings;

	useEffect( () => {
		const fetchAddress = siteData.url || siteData.remote_url;
		const url = new URL(
			`${ trailingSlashIt( fetchAddress ) }wp-json/ti-demo-data/data`
		);
		get( url, true, false ).then( ( response ) => {
			if ( ! response.ok ) {
				return;
			}

			response.json().then( ( result ) => {
				const themeMods = result.theme_mods;
				if ( themeMods && themeMods.neve_global_colors ) {
					setPalettes( themeMods.neve_global_colors.palettes );
				}
			} );
		} );
	}, [] );

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
		handlePaletteChange( paletteKey );
	};

	return (
		palettes &&
		<div className="ob-control">
			<div className="header-wrap">
				<h3>{ __( 'Color Palette', 'templates-patterns-collection' ) }</h3>
				<Button icon={SVG.redo} onClick={() => handlePaletteChange( 'base' )} />
			</div>
			<div className="container type-color">
			{ palettes &&
				Object.keys( palettes ).map( ( paletteKey ) => (
					<button
						className={ classnames( [
							'palette',
							{ active: paletteKey === palette },
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
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getCurrentSite, getImportSettings } = select( 'neve-onboarding' );
		return {
			siteData: getCurrentSite(),
			importSettings: getImportSettings(),
		};
	} ),
	withDispatch( ( dispatch, { importSettings } ) => {
		const { setOnboardingStep, setImportSettings } = dispatch( 'neve-onboarding' );
		return {
			handlePrevStepClick: () => {
				setOnboardingStep( 2 );
			},
			handlePaletteChange: ( newPalette ) => {
				const updatedSettings = {
					...importSettings,
					palette: newPalette,
				};
				setImportSettings(updatedSettings);
			}
		};
	} )
)( PaletteControl );
