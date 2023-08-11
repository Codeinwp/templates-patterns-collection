import { __ } from '@wordpress/i18n';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Button } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { get } from '../../utils/rest';
import { trailingSlashIt } from '../../utils/common';
import PaletteControl from "./PaletteControl";

export const PreviewSettings = ( { handlePrevStepClick, siteData } ) => {
	const [ palette, setPalette ] = useState( 'base' );

	return (
		<div className="ob-preview-settings">
			<Button
				className="back"
				type="link"
				onClick={ handlePrevStepClick }
			>
				{ __( 'Go back', 'templates-patterns-collection' ) }
			</Button>
			<h2>
				{ __( 'Customise design', 'templates-patterns-collection' ) }
			</h2>
			<p>
				{ __(
					'Customise the design of your site, such as color and typography.',
					'templates-patterns-collection'
				) }
			</p>
			<PaletteControl palette={ palette } setPalette={ setPalette } />
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
)( PreviewSettings );
