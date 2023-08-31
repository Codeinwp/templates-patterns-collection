/* global tiobDash */
import { __ } from '@wordpress/i18n';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Button } from '@wordpress/components';
import classnames from 'classnames';
import SVG from '../../utils/svg';
import { sendPostMessage } from '../../utils/common';

const TypographyControl = ( {
	importSettings,
	handleFontChange,
	setImportData,
} ) => {
	const { font } = importSettings;

	const handleFontClick = ( event ) => {
		const fontKey = event.currentTarget.getAttribute( 'data-slug' );
		const { bodyFont, headingFont } = tiobDash.fontParings[ fontKey ];
		setImportData( ( prevData ) => ( {
			...prevData,
			theme_mods: {
				...prevData.theme_mods,
				neve_body_font_family: bodyFont.font,
				neve_headings_font_family: headingFont.font,
			},
		} ) );
		handleFontChange( fontKey );
	};

	if ( ! tiobDash || ! tiobDash.fontParings ) {
		return;
	}

	return (
		<div className="ob-ctrl">
			<div className="ob-ctrl-head">
				<h3>{ __( 'Typography', 'templates-patterns-collection' ) }</h3>
				<Button
					icon={ SVG.redo }
					onClick={ () => handleFontChange( '' ) }
				/>
			</div>
			<div className="ob-ctrl-wrap font">
				{ Object.keys( tiobDash.fontParings ).map( ( slug ) => {
					const { headingFont, bodyFont } = tiobDash.fontParings[
						slug
					];
					const headingStyle = {
						fontFamily: headingFont.font,
					};

					return (
						<Button
							key={ slug }
							data-slug={ slug }
							className={ classnames( [
								'ob-font-pair',
								{ active: slug === font },
							] ) }
							style={ headingStyle }
							title={ `${ headingFont.font } / ${ bodyFont.font }` }
							onClick={ handleFontClick }
						>
							Abc
						</Button>
					);
				} ) }
			</div>
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getImportSettings } = select( 'ti-onboarding' );
		return {
			importSettings: getImportSettings(),
		};
	} ),
	withDispatch( ( dispatch, { importSettings } ) => {
		const { setImportSettings } = dispatch( 'ti-onboarding' );
		return {
			handleFontChange: ( newFont ) => {
				const updatedSettings = {
					...importSettings,
					font: newFont,
				};
				setImportSettings( updatedSettings );
				sendPostMessage( {
					type: 'styleChange',
					data: updatedSettings,
				} );
			},
		};
	} )
)( TypographyControl );
