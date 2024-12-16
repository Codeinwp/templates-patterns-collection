/* eslint-disable camelcase */
import classnames from 'classnames';

import {
	// cloudUpload,
	check,
	edit,
	page,
	trash,
	update,
} from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import {
	Button,
	Icon,
	Popover,
	TextControl,
	Tooltip,
} from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

import {
	updateTemplate,
	deleteTemplate,
	// duplicateTemplate,
	importTemplate,
	fetchLibrary,
} from './../data/templates-cloud/index';

const ListItem = ( {
	sortingOrder,
	layout,
	item,
	importBlocks,
	deletable,
} ) => {
	const { togglePreview, setPreviewData } = useDispatch( 'tpc/block-editor' );
	const [ isLoading, setLoading ] = useState( false );
	const [ isEditing, setEditing ] = useState( false );
	const [ itemName, setItemName ] = useState( item.template_name );

	const importItem = async () => {
		setLoading( 'importing' );
		const data = await importTemplate( item.template_id );

		if ( data.__file && data.content && 'wp_export' === data.__file ) {
			importBlocks( data.content, item.meta || [], item.template_type );
		}
		setLoading( false );
	};

	const updateItem = async () => {
		setLoading( 'updating' );
		await updateTemplate(
			{
				template_id: item.template_id,
				template_name: itemName || item.template_name,
			},
			sortingOrder
		);
		await fetchLibrary( sortingOrder );
		setLoading( false );
		setEditing( ! isEditing );
	};

	/*	const duplicateItem = async () => {
		setLoading( 'duplicating' );
		await duplicateTemplate( item.template_id );
		setLoading( false );
	};*/

	const deleteItem = async () => {
		if (
			! window.confirm(
				__(
					'Are you sure you want to delete this template?',
					'templates-patterns-collection'
				)
			)
		) {
			return false;
		}

		setLoading( 'deleting' );
		await deleteTemplate( item.template_id, sortingOrder );
		setLoading( false );
	};

	const importPreview = async () => {
		togglePreview();
		setPreviewData( {
			type: 'library',
			item,
		} );
	};

	if ( 'grid' === layout ) {
		const style = { backgroundImage: `url(${ item.template_thumbnail })` };

		return (
			<div key={ item.template_id } className="table-grid">
				<div
					style={ style }
					className={ classnames( 'grid-preview', {
						'is-loading': isEditing || false !== isLoading,
					} ) }
				>
					<div className="preview-actions">
						<Button
							isSecondary
							disabled={ false !== isLoading }
							onClick={ importPreview }
						>
							{ __( 'Preview', 'templates-patterns-collection' ) }
						</Button>
						<Button
							isPrimary
							isBusy={ 'importing' === isLoading }
							disabled={ false !== isLoading }
							onClick={ importItem }
						>
							{ __( 'Import', 'templates-patterns-collection' ) }
						</Button>

						{ deletable && (
							<div className="preview-controls">
								{ ! item.link && (
									<Button
										label={ __(
											'Edit',
											'templates-patterns-collection'
										) }
										icon={
											'updating' === isLoading
												? update
												: edit
										}
										disabled={
											isEditing || false !== isLoading
										}
										className={ classnames( {
											'is-loading':
												'updating' === isLoading,
										} ) }
										onClick={ () =>
											setEditing( ! isEditing )
										}
									>
										{ isEditing && (
											<Popover
												onFocusOutside={ () =>
													setEditing( ! isEditing )
												}
												className="controls-popover"
												inline
											>
												<div className="popover-content">
													<TextControl
														label={ __(
															'Template Name',
															'templates-patterns-collection'
														) }
														value={ itemName }
														onChange={ setItemName }
													/>

													<Button
														label={ __(
															'Update',
															'templates-patterns-collection'
														) }
														icon={
															'updating' ===
															isLoading
																? update
																: check
														}
														disabled={
															false !== isLoading
														}
														className={ classnames(
															{
																'is-loading':
																	'updating' ===
																	isLoading,
															}
														) }
														onClick={ updateItem }
													/>
												</div>
											</Popover>
										) }
									</Button>
								) }

								{ /*<Button
									label={ __( 'Duplicate' ) }
									icon={
										'duplicating' === isLoading
											? update
											: group
									}
									disabled={ false !== isLoading }
									className={ classnames( {
										'is-loading':
											'duplicating' === isLoading,
									} ) }
									onClick={ duplicateItem }
								/>*/ }

								<Button
									label={ __(
										'Delete',
										'templates-patterns-collection'
									) }
									icon={
										'deleting' === isLoading
											? update
											: trash
									}
									disabled={ false !== isLoading }
									className={ classnames( {
										'is-loading': 'deleting' === isLoading,
									} ) }
									onClick={ deleteItem }
								/>
							</div>
						) }
					</div>
				</div>

				<div className="card-footer">
					<p>{ item.template_name }</p>
					{ item.template_type === 'fse' && (
						<div className="type-label">FSE</div>
					) }
				</div>
			</div>
		);
	}

	const actionClasses = classnames( 'actions', {
		'no-controls': ! deletable,
	} );

	return (
		<div key={ item.template_id } className="table-row">
			<div className="row-title">
				<Icon icon={ page } />
				{ isEditing ? (
					<TextControl
						label={ __(
							'Template Name',
							'templates-patterns-collection'
						) }
						hideLabelFromVision
						value={ itemName }
						onChange={ setItemName }
					/>
				) : (
					item.template_name
				) }
			</div>

			{ item.template_type === 'fse' && (
				<div className="row-type">
					<div className="type-label">FSE</div>
				</div>
			) }

			{ deletable && (
				<div className="row-controls">
					{ item.link ? (
						<Tooltip
							text={ __( 'This template is synced to a page.', 'templates-patterns-collection' ) }
						>
							<Button
								label={ __(
									'Edit',
									'templates-patterns-collection'
								) }
								icon={ edit }
								disabled={ true }
							>
								{ __(
									'Edit',
									'templates-patterns-collection'
								) }
							</Button>
						</Tooltip>
					) : (
						<Button
							label={
								isEditing
									? __(
											'Update',
											'templates-patterns-collection'
									  )
									: __(
											'Edit',
											'templates-patterns-collection'
									  )
							}
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
								isEditing
									? updateItem
									: () => setEditing( ! isEditing )
							}
						>
							{ isEditing
								? __(
										'Update',
										'templates-patterns-collection'
								  )
								: __(
										'Edit',
										'templates-patterns-collection'
								  ) }
						</Button>
					) }

					{ /*<Button
						label={ __( 'Duplicate' ) }
						icon={ 'duplicating' === isLoading ? update : group }
						disabled={ false !== isLoading }
						className={ classnames( {
							'is-loading': 'duplicating' === isLoading,
						} ) }
						onClick={ duplicateItem }
					/>*/ }

					<Button
						label={ __(
							'Delete',
							'templates-patterns-collection'
						) }
						icon={ 'deleting' === isLoading ? update : trash }
						disabled={ false !== isLoading }
						className={ classnames( {
							'is-loading': 'deleting' === isLoading,
						} ) }
						onClick={ deleteItem }
					>
						{ 'deleting' === isLoading
							? __(
									'Deleting',
									'templates-patterns-collection'
							  ) + '...'
							: __( 'Delete', 'templates-patterns-collection' ) }
					</Button>
					{ /* <Button
					label={ __( 'Sync' ) }
					icon={ cloudUpload }
					onClick={ () => console.log( 'Upload to cloud.' ) }
				/> */ }
				</div>
			) }
			<div className={ actionClasses }>
				<Button
					isSecondary
					disabled={ false !== isLoading }
					onClick={ importPreview }
				>
					{ __( 'Preview', 'templates-patterns-collection' ) }
				</Button>

				<Button
					isPrimary
					isBusy={ 'importing' === isLoading }
					disabled={ false !== isLoading }
					onClick={ importItem }
				>
					{ __( 'Import', 'templates-patterns-collection' ) }
				</Button>
			</div>
		</div>
	);
};

export default ListItem;
