/* eslint-disable camelcase */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { getTemplate, publishTemplate } from '../data/templates-cloud';
import classnames from 'classnames';

const PublishButton = ( {
	canPredefine,
	setLoading,
	templateData,
	setScreenshotURL,
	setPublished,
	saveMeta,
	createSuccessNotice,
	published,
	createErrorNotice,
	isLoading,
} ) => {
	if ( ! canPredefine ) {
		return null;
	}

	const {
		_ti_tpc_template_id,
		_ti_tpc_site_slug,
		_ti_tpc_screenshot_url,
		_ti_tpc_published,
		link,
	} = templateData;

	const onPublish = async () => {
		setLoading( 'publishing' );
		try {
			await publishTemplate(
				_ti_tpc_template_id,
				_ti_tpc_site_slug,
				_ti_tpc_screenshot_url,
				! _ti_tpc_published,
				link
			).then( async ( r ) => {
				if ( r.success ) {
					await getTemplate( _ti_tpc_template_id ).then(
						( results ) => {
							if ( _ti_tpc_template_id === results.template_id ) {
								setScreenshotURL( results.template_thumbnail );
								setPublished( ! published );
								saveMeta( {
									...templateData,
									_ti_tpc_published: ! published,
								} );
								if ( published ) {
									createSuccessNotice(
										__(
											'Template Unpublished.',
											'templates-patterns-collection'
										),
										{
											type: 'snackbar',
										}
									);
								} else {
									createSuccessNotice(
										__(
											'Template Published.',
											'templates-patterns-collection'
										),
										{
											type: 'snackbar',
										}
									);
								}
							}
						}
					);
				}
			} );
		} catch ( error ) {
			createErrorNotice(
				__(
					'Something happened when publishing the template.',
					'templates-patterns-collection'
				)
			);
		}
		setLoading( false );
	};

	return (
		<Button
			isSecondary
			onClick={ onPublish }
			disabled={ false !== isLoading }
			className={ classnames( {
				'is-loading': 'publishing' === isLoading,
			} ) }
		>
			{ published &&
				( 'publishing' === isLoading
					? __( 'Unpublishing', 'templates-patterns-collection' )
					: __( 'Unpublish', 'templates-patterns-collection' ) ) }
			{ ! published &&
				( 'publishing' === isLoading
					? __( 'Publishing', 'templates-patterns-collection' )
					: __( 'Publish', 'templates-patterns-collection' ) ) }
		</Button>
	);
};

export default PublishButton;
