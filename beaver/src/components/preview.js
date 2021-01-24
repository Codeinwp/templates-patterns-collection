import { __ } from '@wordpress/i18n';
import { Button, Placeholder, Spinner } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';

// import { importTemplate } from './../data/templates-cloud/index';

const Preview = ( { isFetching, importBlocks } ) => {
	const { togglePreview } = useDispatch( 'tpc/beaver' );

	const { item } = useSelect( ( select ) =>
		select( 'tpc/beaver' ).getPreview()
	);

	const importItem = () => {
		togglePreview();
		// importTemplate();
		// importBlocks( content );
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
				</div>
			) }
		</div>
	);
};

export default Preview;
