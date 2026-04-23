/* global tiobDash */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import classnames from 'classnames';
import SVG from '../../utils/svg';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

const FALLBACK_FONT = 'Arial, Helvetica, sans-serif';

const getFontPairs = ( importData ) => {
	if ( importData && importData.font_pairs && Object.keys( importData.font_pairs ).length ) {
		return importData.font_pairs;
	}
	if ( tiobDash && tiobDash.fontParings ) {
		return tiobDash.fontParings;
	}
	return null;
};

const getDefaultFonts = ( importDataDefault ) => {
	const themeMods = importDataDefault?.theme_mods;
	return {
		body: themeMods?.neve_body_font_family || FALLBACK_FONT,
		heading: themeMods?.neve_headings_font_family || FALLBACK_FONT,
	};
};

const TypographyControl = ( {
	siteStyle,
	handleFontClick,
	importData,
	importDataDefault,
} ) => {
	const fontPairs = getFontPairs( importData );
	if ( ! fontPairs ) {
		return null;
	}

	const { body: defaultBodyFont, heading: defaultHeadingsFont } =
		getDefaultFonts( importDataDefault );
	const { font } = siteStyle;

	return (
		<div className="ob-ctrl">
			<div className="ob-ctrl-head small-gap">
				<h3>{ __( 'Typography', 'templates-patterns-collection' ) }</h3>
				<Button
					icon={ SVG.redo }
					onClick={ () => handleFontClick( 'default' ) }
				/>
			</div>
			<div className="ob-ctrl-wrap font">
				<Button
					className={ classnames( [
						'ob-font-pair',
						'ob-font-default',
						{ 'ob-active': 'default' === font },
					] ) }
					title={ `${ defaultHeadingsFont } / ${ defaultBodyFont }` }
					onClick={ () => handleFontClick( 'default' ) }
				>
					{ __( 'Default', 'templates-patterns-collection' ) }
				</Button>

				{ Object.keys( fontPairs ).map( ( slug ) => {
					const { headingFont, bodyFont } = fontPairs[ slug ];
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
	withDispatch(
		(
			dispatch,
			{ importData, importDataDefault, siteStyle, setSiteStyle }
		) => {
			const { setImportData, setRefresh } = dispatch( 'ti-onboarding' );
			const fontPairs = getFontPairs( importData );
			const { body: defaultBodyFont, heading: defaultHeadingsFont } =
				getDefaultFonts( importDataDefault );

			return {
				handleFontClick: ( fontKey ) => {
					const newStyle = {
						...siteStyle,
						font: fontKey,
					};
					setSiteStyle( newStyle );

					const pair =
						fontKey !== 'default' && fontPairs && fontPairs[ fontKey ]
							? fontPairs[ fontKey ]
							: {
									bodyFont: { font: defaultBodyFont },
									headingFont: { font: defaultHeadingsFont },
							  };

					const { bodyFont, headingFont } = pair;

					const newImportData = {
						...importData,
						theme_mods: {
							...importData.theme_mods,
							neve_body_font_family: bodyFont.font,
							neve_headings_font_family: headingFont.font,
						},
					};
					setImportData( newImportData );
					setRefresh( true );
				},
			};
		}
	)
)( TypographyControl );
