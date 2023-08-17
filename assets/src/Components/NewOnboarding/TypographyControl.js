import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { trailingSlashIt } from '../../utils/common';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Button } from '@wordpress/components';
import classnames from 'classnames';
import { get } from '../../utils/rest';
import SVG from '../../utils/svg';

const TypographyControl = ( { importSettings, handleFontChange } ) => {

  const { font } = importSettings;

  const handleFontClick = ( event ) => {
    const fontKey = event.currentTarget.getAttribute( 'data-slug' );
    handleFontChange( fontKey );
  };

  if ( ! tiobDash || ! tiobDash.fontParings ) {
    return ;
  }

  return (
    <div className="ob-control">
      <div className="header-wrap">
        <h3>{ __( 'Typography', 'templates-patterns-collection' ) }</h3>
        <Button icon={SVG.redo} onClick={() => handleFontChange('')} />
      </div>
      <div className="container type-fonts">
      {
        Object.keys(tiobDash.fontParings).map((slug) => {
          const { headingFont, bodyFont } = tiobDash.fontParings[slug];
          const headingStyle = {
            fontFamily: headingFont.font,
          };
          const bodyStyle = {
            fontFamily: bodyFont.font,
          };

          return (
            <Button
              key={slug}
              data-slug={slug}
              className={ classnames( [
                'font-pair',
                { active: slug === font },
              ] ) }
              style={headingStyle}
              title={`${headingFont.font} / ${bodyFont.font}`}
              onClick={ handleFontClick }
            >
              Abc
            </Button>
          );
      })}
      </div>
    </div>
  );
};

export default compose(
  withSelect( ( select ) => {
    const { getImportSettings } = select( 'neve-onboarding' );
    return {
      importSettings: getImportSettings(),
    };
  } ),
  withDispatch( ( dispatch, { importSettings } ) => {
    const { setOnboardingStep, setImportSettings } = dispatch( 'neve-onboarding' );
    return {
      handleFontChange: ( newFont ) => {
        const updatedSettings = {
          ...importSettings,
          font: newFont,
        };
        setImportSettings(updatedSettings);
      }
    };
  } )
)( TypographyControl );
