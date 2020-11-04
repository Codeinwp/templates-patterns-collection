import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	// cloudUpload,
	check,
	edit,
	group,
	page,
	trash,
	update,
} from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { Button, Icon, Popover, TextControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	updateTemplate,
	deleteTemplate,
	duplicateTemplate,
	importTemplate,
	publishTemplate,
} from './../data/templates-cloud/index.js';

const ListItem = ( { layout, item, importBlocks } ) => {
	const { togglePreview, setPreviewData } = useDispatch( 'tpc/block-editor' );
	const [ isLoading, setLoading ] = useState( false );
	const [ isEditing, setEditing ] = useState( false );
	const [ itemName, setItemName ] = useState( item.template_name );
	const { canPredefine } = window.tiTpc;

	const { meta } = useSelect( ( select ) => ( {
		meta: select( 'core/editor' ).getEditedPostAttribute( 'meta' ),
	} ) );

	const importItem = async () => {
		setLoading( 'importing' );
		const data = await importTemplate( item.template_id );

		if ( data.__file && data.content && 'wp_export' === data.__file ) {
			importBlocks( data.content );
		}
		setLoading( false );
	};

	const updateItem = async () => {
		setLoading( 'updating' );
		await updateTemplate( {
			template_id: item.template_id,
			template_name: itemName || item.template_name,
		} );
		setLoading( false );
		setEditing( ! isEditing );
	};

	const duplicateItem = async () => {
		setLoading( 'duplicating' );
		await duplicateTemplate( item.template_id );
		setLoading( false );
	};

	const deleteItem = async () => {
		if (
			! window.confirm(
				__( 'Are you sure you want to delete this template?' )
			)
		) {
			return false;
		}

		setLoading( 'deleting' );
		await deleteTemplate( item.template_id );
		setLoading( false );
	};

	const importPreview = async () => {
		togglePreview();
		setPreviewData( {
			type: 'library',
			item,
		} );
	};

	const onPublish = async () => {
		setLoading( 'publishing' );
		console.log( meta );
		// await publishTemplate( item.template_id, 'general', 'https://' );
		setLoading( false );
	};

	if ( 'grid' === layout ) {
		return (
			<div
				key={ item.template_id }
				className="wp-block-ti-tpc-templates-cloud__modal-content__table_grid"
			>
				<div
					className={ classnames(
						'wp-block-ti-tpc-templates-cloud__modal-content__table_grid__preview',
						{ 'is-loading': isEditing || false !== isLoading }
					) }
				>
					<div className="wp-block-ti-tpc-templates-cloud__modal-content__table_grid__preview_actions">
						{ canPredefine && (
							<Button
								isSecondary
								isLarge
								onClick={ onPublish }
								disabled={ false !== isLoading }
								className={ classnames( {
									'is-loading': 'publishing' === isLoading,
								} ) }
							>
								{ 'publishing' === isLoading
									? __( 'Publishing' )
									: __( 'Publish' ) }
							</Button>
						) }
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

						<div className="wp-block-ti-tpc-templates-cloud__modal-content__table__grid__preview_controls">
							<Button
								label={ __( 'Edit' ) }
								icon={
									'updating' === isLoading ? update : edit
								}
								disabled={ isEditing || false !== isLoading }
								className={ classnames( {
									'is-loading': 'updating' === isLoading,
								} ) }
								onClick={ () => setEditing( ! isEditing ) }
							>
								{ isEditing && (
									<Popover
										onFocusOutside={ () =>
											setEditing( ! isEditing )
										}
										className="wp-block-ti-tpc-templates-cloud__preview_controls__popver"
									>
										<div className="wp-block-ti-tpc-templates-cloud__preview_controls__popver_content">
											<TextControl
												label={ __( 'Template Name' ) }
												value={ itemName }
												onChange={ setItemName }
											/>

											<Button
												label={ __( 'Update' ) }
												icon={
													'updating' === isLoading
														? update
														: check
												}
												disabled={ false !== isLoading }
												className={ classnames( {
													'is-loading':
														'updating' ===
														isLoading,
												} ) }
												onClick={ updateItem }
											/>
										</div>
									</Popover>
								) }
							</Button>

							<Button
								label={ __( 'Duplicate' ) }
								icon={
									'duplicating' === isLoading ? update : group
								}
								disabled={ false !== isLoading }
								className={ classnames( {
									'is-loading': 'duplicating' === isLoading,
								} ) }
								onClick={ duplicateItem }
							/>

							<Button
								label={ __( 'Delete' ) }
								icon={
									'deleting' === isLoading ? update : trash
								}
								disabled={ false !== isLoading }
								className={ classnames( {
									'is-loading': 'deleting' === isLoading,
								} ) }
								onClick={ deleteItem }
							/>
						</div>
					</div>
				</div>

				<div className="wp-block-ti-tpc-templates-cloud__modal-content__table_grid__footer">
					<p>{ item.template_name }</p>
				</div>
			</div>
		);
	}

	return (
		<div
			key={ item.template_id }
			className="wp-block-ti-tpc-templates-cloud__modal-content__table_row"
		>
			<div className="wp-block-ti-tpc-templates-cloud__modal-content__table_row__title">
				<Icon icon={ page } />
				{ isEditing ? (
					<TextControl
						label={ __( 'Template Name' ) }
						hideLabelFromVision
						value={ itemName }
						onChange={ setItemName }
					/>
				) : (
					item.template_name
				) }
			</div>

			<div className="wp-block-ti-tpc-templates-cloud__modal-content__table_row__controls">
				<Button
					label={ isEditing ? __( 'Update' ) : __( 'Edit' ) }
					icon={
						isEditing
							? 'updating' === isLoading
								? update
								: check
							: edit
					}
					disabled={ false !== isLoading }
					className={ classnames( {
						'is-loading': 'updating' === isLoading,
					} ) }
					onClick={
						isEditing ? updateItem : () => setEditing( ! isEditing )
					}
				/>

				<Button
					label={ __( 'Duplicate' ) }
					icon={ 'duplicating' === isLoading ? update : group }
					disabled={ false !== isLoading }
					className={ classnames( {
						'is-loading': 'duplicating' === isLoading,
					} ) }
					onClick={ duplicateItem }
				/>

				<Button
					label={ __( 'Delete' ) }
					icon={ 'deleting' === isLoading ? update : trash }
					disabled={ false !== isLoading }
					className={ classnames( {
						'is-loading': 'deleting' === isLoading,
					} ) }
					onClick={ deleteItem }
				/>

				{ /* <Button
					label={ __( 'Sync' ) }
					icon={ cloudUpload }
					onClick={ () => console.log( 'Upload to cloud.' ) }
				/> */ }
			</div>

			<div className="wp-block-ti-tpc-templates-cloud__modal-content__table_row__actions">
				{ canPredefine && (
					<Button
						isSecondary
						isLarge
						onClick={ onPublish }
						disabled={ false !== isLoading }
						className={ classnames( {
							'is-loading': 'publishing' === isLoading,
						} ) }
					>
						{ 'publishing' === isLoading
							? __( 'Publishing' )
							: __( 'Publish' ) }
					</Button>
				) }
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
