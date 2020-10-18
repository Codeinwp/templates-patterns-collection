/**
 * External dependencies
 */
import {

	// cloudUpload,
	check,
	edit,
	group,
	page,
	trash,
	update
} from '@wordpress/icons';

import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
	Button,
	Icon,
	TextControl
} = wp.components;

const { useDispatch } = wp.data;

const { useState } = wp.element;

/**
 * Internal dependencies
 */
import {
	updateTemplate,
	deleteTemplate,
	duplicateTemplate,
	importTemplate
} from './../data/templates-cloud/index.js';

const ListItem = ({
	item,
	importBlocks
}) => {
	const {
		togglePreview,
		setPreviewData
	} = useDispatch( 'tpc/block-editor' );

	const [ isLoading, setLoading ] = useState( false );
	const [ isEditing, setEditing ] = useState( false );
	const [ itemName, setItemName ] = useState( item.template_name );

	const importItem = async() => {
		setLoading( 'importing' );
		const data = await importTemplate( item.template_id );

		if ( data.__file && data.content && 'wp_export' === data.__file ) {
			importBlocks( data.content );
		}
		setLoading( false );
	};

	const updateItem = async() => {
		setLoading( 'updating' );
		await updateTemplate({
			'template_id': item.template_id,
			'template_name': itemName || item.template_name
		});
		setLoading( false );
		setEditing( ! isEditing );
	};

	const duplicateItem = async() => {
		setLoading( 'duplicating' );
		await duplicateTemplate( item.template_id );
		setLoading( false );
	};

	const deleteItem = async() => {
		if ( ! confirm( __( 'Are you sure you want to delete this template?' ) ) ) {
			return false;
		}

		setLoading( 'deleting' );
		await deleteTemplate( item.template_id );
		setLoading( false );
	};

	const importPreview = async() => {
		togglePreview();
		setPreviewData({
			type: 'library',
			item
		});
	};

	return (
		<div
			key={ item.template_id }
			className="wp-block-themeisle-blocks-templates-cloud__modal-content__table_row"
		>
			<div className="wp-block-themeisle-blocks-templates-cloud__modal-content__table_row__title">
				<Icon icon={ page } />
				{ isEditing ? (
					<TextControl
						label={ __( 'Template Name' ) }
						hideLabelFromVision
						value={ itemName }
						onChange={ setItemName }
					/>
				) : item.template_name  }
			</div>

			<div className="wp-block-themeisle-blocks-templates-cloud__modal-content__table_row__controls">
				<Button
					label={ isEditing ? __( 'Update' ) : __( 'Edit' ) }
					icon={ isEditing ? ( 'updating' === isLoading ? update : check ) : edit }
					disabled={ false !== isLoading }
					className={ classnames(
						{
							'is-loading': 'updating' === isLoading
						}
					) }
					onClick={ isEditing ? updateItem : () => setEditing( ! isEditing ) }
				/>

				<Button
					label={ __( 'Duplicate' ) }
					icon={ 'duplicating' === isLoading ? update : group }
					disabled={ false !== isLoading }
					className={ classnames(
						{
							'is-loading': 'duplicating' === isLoading
						}
					) }
					onClick={ duplicateItem }
				/>

				<Button
					label={ __( 'Delete' ) }
					icon={ 'deleting' === isLoading ? update : trash }
					disabled={ false !== isLoading }
					className={ classnames(
						{
							'is-loading': 'deleting' === isLoading
						}
					) }
					onClick={ deleteItem }
				/>

				{/* <Button
					label={ __( 'Sync' ) }
					icon={ cloudUpload }
					onClick={ () => console.log( 'Upload to cloud.' ) }
				/> */}
			</div>

			<div className="wp-block-themeisle-blocks-templates-cloud__modal-content__table_row__actions">
				<Button
					isSecondary
					isLarge
					disabled={ false !== isLoading }
					onClick={ importPreview }
				>
					{ __( 'Preview' ) }
				</Button>

				<Button
					isPrimary
					isLarge
					isBusy={ 'importing' === isLoading }
					disabled={ false !== isLoading }
					onClick={ importItem }
				>
					{ __( 'Import' ) }
				</Button>
			</div>
		</div>
	);
};

export default ListItem;
