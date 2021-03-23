import { __ } from '@wordpress/i18n';
import { Button, Icon, Placeholder, Spinner } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { rotateRight } from '@wordpress/icons';

const Preview = ( { isFetching, importTemplate } ) => {
	const { togglePreview } = useDispatch( 'tpc/beaver' );

	const { item } = useSelect( ( select ) =>
		select( 'tpc/beaver' ).getPreview()
	);

	const importItem = () => {
		togglePreview();
		importTemplate( item.template_id );
	};

	return (
		<div className="tpc-modal-content">
			<div className="preview-header">
				<div className="left">
					{ item.template_name || __( 'Template' ) }
				</div>

				<div className="right">
					<Button isSecondary onClick={ togglePreview }>
						{ __( 'Close Preview' ) }
					</Button>

					<Button
						isPrimary
						isBusy={ isFetching }
						disabled={ isFetching }
						onClick={ importItem }
					>
						{ __( 'Import' ) }
					</Button>
				</div>
			</div>

			{ isFetching ? (
				<Placeholder>
					<Spinner />
				</Placeholder>
			) : (
				<div className="preview-content">
					<iframe
						src={ item.link || '' }
						title={ item.template_name || '' }
					/>

					<div className="is-loading">
						<Icon icon={ rotateRight } />
					</div>
				</div>
			) }
		</div>
	);
};

export default Preview;
