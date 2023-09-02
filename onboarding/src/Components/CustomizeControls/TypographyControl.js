/* global tiobDash */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import classnames from 'classnames';
import SVG from '../../utils/svg';
import { sendPostMessage } from '../../utils/common';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

const TypographyControl = ( { siteStyle, handleFontClick } ) => {
	const { font } = siteStyle;

	if ( ! tiobDash || ! tiobDash.fontParings ) {
		return;
	}

	return (
		<div className="ob-ctrl">
			<div className="ob-ctrl-head">
				<h3>{ __( 'Typography', 'templates-patterns-collection' ) }</h3>
				<Button
					icon={ SVG.redo }
					onClick={ () => handleFontClick( 'default' ) }
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
							className={ classnames( [
								'ob-font-pair',
								{ 'ob-active': slug === font },
							] ) }
							style={ headingStyle }
							title={ `${ headingFont.font } / ${ bodyFont.font }` }
							onClick={ () => handleFontClick( slug ) }
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
		const { getImportData } = select( 'ti-onboarding' );
		return {
			importData: getImportData(),
		};
	} ),
	withDispatch( ( dispatch, { importData, siteStyle, setSiteStyle } ) => {
		const { setImportData } = dispatch( 'ti-onboarding' );

		return {
			handleFontClick: ( fontKey ) => {
				const newStyle = {
					...siteStyle,
					font: fontKey,
				};
				setSiteStyle( newStyle );
				const { bodyFont, headingFont } = tiobDash.fontParings[
					fontKey
				];

				const newImportData = {
					...importData,
					theme_mods: {
						...importData.theme_mods,
						neve_body_font_family: bodyFont.font,
						neve_headings_font_family: headingFont.font,
					},
				};
				setImportData( newImportData );

				sendPostMessage( {
					type: 'styleChange',
					data: newStyle,
				} );
			},
		};
	} )
)( TypographyControl );
