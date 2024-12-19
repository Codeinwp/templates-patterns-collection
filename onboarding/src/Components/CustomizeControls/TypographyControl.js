/* global tiobDash */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import classnames from 'classnames';
import SVG from '../../utils/svg';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { useState } from '@wordpress/element';

const TypographyControl = ( { siteStyle, handleFontClick, importData } ) => {
	const themeMods = importData?.theme_mods;

	const [ defaultBodyFont ] = useState(
		themeMods?.neve_body_font_family || 'Arial, Helvetica, sans-serif'
	);

	const [ defaultHeadingsFont ] = useState(
		themeMods?.neve_headings_font_family || 'Arial, Helvetica, sans-serif'
	);

	const { font } = siteStyle;
	if ( ! tiobDash || ! tiobDash.fontParings ) {
		return;
	}

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

				{ Object.keys( tiobDash.fontParings ).map( ( slug ) => {
					const { headingFont, bodyFont } =
						tiobDash.fontParings[ slug ];
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
			{
				importData,
				siteStyle,
				setSiteStyle,
				defaultBodyFont,
				defaultHeadingsFont,
			}
		) => {
			const { setImportData, setRefresh } = dispatch( 'ti-onboarding' );

			return {
				handleFontClick: ( fontKey ) => {
					const newStyle = {
						...siteStyle,
						font: fontKey,
					};
					setSiteStyle( newStyle );

					const { bodyFont, headingFont } =
						fontKey !== 'default'
							? tiobDash.fontParings[ fontKey ]
							: {
									bodyFont: { font: defaultBodyFont },
									headingFont: { font: defaultHeadingsFont },
							  };

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
