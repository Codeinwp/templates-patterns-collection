import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { trailingSlashIt } from '../../utils/common';
import { get } from '../../utils/rest';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import classnames from 'classnames';

const PaletteControl = ( { siteData, setPalette, palette } ) => {
	const [ palettes, setPalettes ] = useState( null );

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
		setPalette( paletteKey );
	};

	return (
		<div className="ob-palette-selector">
			<h3>{ __( 'Color Palette', 'templates-patterns-collection' ) }</h3>
			{ palettes &&
				Object.keys( palettes ).map( ( paletteKey ) => (
					<button
						className={ classnames( [
							'ob-palette',
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
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getCurrentSite } = select( 'neve-onboarding' );
		return {
			siteData: getCurrentSite(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setOnboardingStep } = dispatch( 'neve-onboarding' );
		return {
			handlePrevStepClick: () => {
				setOnboardingStep( 2 );
			},
		};
	} )
)( PaletteControl );
