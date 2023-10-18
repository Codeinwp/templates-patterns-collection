// PublishButton.js
import { Button } from '@wordpress/components';
import classnames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

const PublishButton = ({ templateData, setLoading, createSuccessNotice, createErrorNotice, saveSettings, settingId }) => {
	const onPublish = async () => {
		setLoading('publishing');
		try {
			// Implement the publishTemplate and getTemplate functions or import them from the original file
			// ...

			await publishTemplate(
				templateData._ti_tpc_template_id,
				templateData._ti_tpc_site_slug,
				templateData._ti_tpc_screenshot_url,
				!templateData._ti_tpc_published,
				'https://cadourilafix.ro'
			).then(async (r) => {
				if (r.success) {
					await getTemplate(templateData._ti_tpc_template_id).then((results) => {
						if (templateData._ti_tpc_template_id === results.template_id) {
							const newTemplateData = {
								...templateData,
								_ti_tpc_screenshot_url: results.template_thumbnail,
								_ti_tpc_published: !templateData._ti_tpc_published,
							};

							setTemplateData(newTemplateData);
							saveSettings(settingId, newTemplateData);
							createSuccessNotice(
								newTemplateData._ti_tpc_published
									? __('Template Unpublished.', 'templates-patterns-collection')
									: __('Template Published.', 'templates-patterns-collection'),
								{
									type: 'snackbar',
								}
							);
						}
					});
				}
			});
		} catch (error) {
			createErrorNotice(
				__('Something happened when publishing the template.', 'templates-patterns-collection')
			);
		}
		setLoading(false);
	};

	return (
		<Button
			isSecondary
			onClick={onPublish}
			disabled={false !== isLoading}
			className={classnames({
				'is-loading': 'publishing' === isLoading,
			})}
		>
			{templateData._ti_tpc_published &&
				('publishing' === isLoading
					? __('Unpublishing', 'templates-patterns-collection')
					: __('Unpublish', 'templates-patterns-collection'))}
			{!templateData._ti_tpc_published &&
				('publishing' === isLoading
					? __('Publishing', 'templates-patterns-collection')
					: __('Publish', 'templates-patterns-collection'))}
		</Button>
	);
};

export default PublishButton;
