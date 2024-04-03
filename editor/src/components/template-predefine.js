import { __ } from '@wordpress/i18n';
import { Button, TextControl, PanelBody } from '@wordpress/components';
import classnames from 'classnames';
import PublishButton from './publish-button';
import { getTemplate } from '../data/templates-cloud';
import Notices from './notices';

const TemplatePredefine = ( {
	templateData,
	setTemplateData,
	canPredefine,
	setLoading,
	createErrorNotice,
	createSuccessNotice,
	isLoading,
	saveMeta,
} ) => {
	/**
	 * Set the screenshot URL.
	 *
	 * @param {string} url Screenshot URL.
	 */
	const setScreeShotUrl = ( url ) => {
		setTemplateData( {
			...templateData,
			_ti_tpc_screenshot_url: url,
		} );
	};

	/**
	 * Set the published status.
	 *
	 * @param {boolean} published Published status.
	 */
	const setPublished = ( published ) => {
		setTemplateData( {
			...templateData,
			_ti_tpc_published: published,
		} );
	};

	/**
	 * Refresh the template data.
	 *
	 * @return {Promise<void>}
	 */
	const refreshData = async () => {
		setLoading( 'publishing' );
		try {
			await getTemplate( templateData._ti_tpc_template_id ).then(
				( results ) => {
					if (
						templateData._ti_tpc_template_id === results.template_id
					) {
						if ( results.template_thumbnail ) {
							setScreeShotUrl( results.template_thumbnail );
							saveMeta( {
								...templateData,
								_ti_tpc_screenshot_url:
									results.template_thumbnail,
							} );
						}
						createSuccessNotice(
							__(
								'Template Data Refreshed.',
								'templates-patterns-collection'
							),
							{
								type: 'snackbar',
							}
						);
					}
				}
			);
		} catch ( error ) {
			createErrorNotice(
				__(
					'Something happened when refreshing the template data.',
					'templates-patterns-collection'
				)
			);
		}
		setLoading( false );
	};

	return (
		<PanelBody>
			<h4>
				{ __( 'Publish Settings', 'templates-patterns-collection' ) }
			</h4>
			<TextControl
				label={ __(
					'Screenshot URL',
					'templates-patterns-collection'
				) }
				value={ templateData._ti_tpc_screenshot_url || '' }
				help={ __(
					'Use `{generate_ss}` to publish this and have a screenshot automatically generated. Otherwise use the url to point to an image location for the template preview.',
					'templates-patterns-collection'
				) }
				type="url"
				onChange={ setScreeShotUrl }
			/>
			<TextControl
				label={ __( 'Site Slug', 'templates-patterns-collection' ) }
				value={ templateData._ti_tpc_site_slug }
				help={ __(
					'Use `general` to publish this as a global template. Otherwise use the starter site slug to make it available as a single page for the starter site.',
					'templates-patterns-collection'
				) }
				type="url"
				onChange={ ( newValue ) =>
					setTemplateData( {
						...templateData,
						_ti_tpc_site_slug: newValue,
					} )
				}
			/>
			<TextControl
				label={ __( 'Previewer URL', 'templates-patterns-collection' ) }
				value={ templateData._ti_tpc_previewer_url || '' }
				help={ __(
					'Provide a URL to a previewer for this template. This will be used to display a preview of the template in the editor.',
					'templates-patterns-collection'
				) }
				type="url"
				onChange={ ( newValue ) =>
					setTemplateData( {
						...templateData,
						_ti_tpc_previewer_url: newValue,
					} )
				}
			/>
			<PublishButton
				canPredefine={ canPredefine }
				setLoading={ setLoading }
				templateData={ {
					...templateData,
					link: templateData._ti_tpc_previewer_url,
				} }
				setScreenshotURL={ setScreeShotUrl }
				setPublished={ setPublished }
				saveMeta={ saveMeta }
				published={ templateData._ti_tpc_published || false }
				createErrorNotice={ createErrorNotice }
				createSuccessNotice={ createSuccessNotice }
				isLoading={ isLoading }
			/>
			{ templateData._ti_tpc_published && (
				<Button
					isLink
					icon="image-rotate"
					onClick={ refreshData }
					disabled={ false !== isLoading }
					className={ classnames( {
						'is-loading': 'publishing' === isLoading,
					} ) }
					style={ {
						marginLeft: '12px',
						textDecoration: 'none',
					} }
				>
					{ __( 'Refresh', 'templates-patterns-collection' ) }
				</Button>
			) }
			<Notices />
		</PanelBody>
	);
};

export default TemplatePredefine;
