import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { trailingSlashIt } from '../../utils/common';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Button } from '@wordpress/components';
import classnames from 'classnames';
import { get } from '../../utils/rest';
import SVG from '../../utils/svg';

const TypographyControl = ( { siteData, setPalette, palette } ) => {
  const [ fontParings, setFontParings ] = useState( null );

  console.log( tiobDash.fontParings );
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
        console.log( themeMods.neve_font_pairings );
        if ( themeMods && themeMods.neve_font_pairings ) {
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
      <div className="ob-palette-header-wrap">
        <h3>{ __( 'Typography Palette', 'templates-patterns-collection' ) }</h3>
        <Button icon={SVG.redo} onClick={() => setPalette('base')} />
      </div>
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
)( TypographyControl );
