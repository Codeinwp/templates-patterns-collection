import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import FeaturesList from '../FeaturesList';

const FeaturesControl = ( { importData, togglePluginInstall } ) => {
	return (
		<div className="ob-ctrl">
			<div className="ob-ctrl-wrap input">
				<FeaturesList requiredPlugins={importData?.mandatory_plugins ?? {}} onToggle={togglePluginInstall} />
			</div>
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getImportData, getPluginOptions } =
			select( 'ti-onboarding' );
		return {
			importData: getImportData(),
			pluginOptions: getPluginOptions(),
		};
	} ),
	withDispatch(
		( dispatch, { pluginOptions } ) => {
			const { setPluginOptions } = dispatch( 'ti-onboarding' );

			return {
				togglePluginInstall: (pluginSlug, value) => {
					setPluginOptions({
						...pluginOptions,
						[ pluginSlug ]: value
					});
				}
			};
		}
	)
)( FeaturesControl );
