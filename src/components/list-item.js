/**
 * External dependencies
 */
import {
	cloudUpload,
	edit,
	group,
	page,
	trash
} from '@wordpress/icons';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
	Button,
	Icon
} = wp.components;

const { useState } = wp.element;

/**
 * Internal dependencies
 */
import {
	deleteTemplate,
	duplicateTemplate,
	importTemplate
} from './../data/templates-cloud/index.js';

const ListItem = ({
	template,
	importBlocks
}) => {
	const [ isLoading, setLoading ] = useState( false );

	const importItem = async() => {
		setLoading( ! isLoading );
		try {
			const data = await importTemplate( template.template_id );

			if ( data.__file && data.content && 'wp_export' === data.__file ) {
				importBlocks( data.content );
			}
		} catch ( error ) {
			console.log( error );
		}
		setLoading( ! isLoading );
	};

	const deleteItem = async() => {
		if ( ! confirm( __( 'Are you sure you want to delete this template?' ) ) ) {
			return false;
		}

		try {
			await deleteTemplate( template.template_id );
		} catch ( error ) {
			console.log( error );
		}
	};

	return (
		<div className="wp-block-themeisle-blocks-templates-cloud__modal-content__table_row">
			<div className="wp-block-themeisle-blocks-templates-cloud__modal-content__table_row__title">
				<Icon icon={ page } />
				{ template.template_name }
			</div>

			<div className="wp-block-themeisle-blocks-templates-cloud__modal-content__table_row__controls">
				<Button
					label={ __( 'Edit' ) }
					icon={ edit }
					isDisabled
					onClick={ () => console.log( 'Edit action.' ) }
				/>

				<Button
					label={ __( 'Duplicate' ) }
					icon={ group }
					onClick={ () => duplicateTemplate( template.template_id ) }
				/>

				<Button
					label={ __( 'Delete' ) }
					icon={ trash }
					onClick={ deleteItem }
				/>

				<Button
					label={ __( 'Sync' ) }
					icon={ cloudUpload }
					onClick={ () => console.log( 'Upload to cloud.' ) }
				/>
			</div>

			<div className="wp-block-themeisle-blocks-templates-cloud__modal-content__table_row__actions">
				<Button
					isSecondary
					isLarge
					onClick={ () => console.log( 'Upload to cloud.' ) }
				>
					{ __( 'Preview' ) }
				</Button>

				<Button
					isPrimary
					isLarge
					isBusy={ isLoading }
					onClick={ importItem }
				>
					{ __( 'Import' ) }
				</Button>
			</div>
		</div>
	);
};

export default ListItem;
