/* global tiobDash */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import classnames from 'classnames';
import SVG from '../../utils/svg';
import { sendPostMessage } from '../../utils/common';

const TypographyControl = ( {
	setImportData,
	siteStyle,
	setSiteStyle,
} ) => {
	const { font } = siteStyle;

	const handleFontClick = ( fontKey ) => {
		const newStyle = {
			...siteStyle,
			font: fontKey,
		};
		setSiteStyle( newStyle );
		const { bodyFont, headingFont } = tiobDash.fontParings[ fontKey ];

		setImportData( ( prevData ) => ( {
			...prevData,
			theme_mods: {
				...prevData.theme_mods,
				neve_body_font_family: bodyFont.font,
				neve_headings_font_family: headingFont.font,
			},
		} ) );

		sendPostMessage( {
			type: 'styleChange',
			data: newStyle,
		} );
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
					onClick={ () => handleFontClick( '' ) }
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

export default TypographyControl;
