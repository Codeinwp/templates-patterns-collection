import { check, edit, group, page, trash, update } from '@wordpress/icons';

import classnames from 'classnames';
import { stringifyUrl } from 'query-string';
import { v4 as uuidv4 } from 'uuid';

import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { Button, Popover, Icon, TextControl } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

const ListItem = ( { item, loadTemplates, userTemplate, grid } ) => {
	// const { togglePreview, setPreviewData } = useDispatch( 'tpc/block-editor' );

	const [ isLoading, setLoading ] = useState( false );
	const [ isEditing, setEditing ] = useState( false );
	const [ itemName, setItemName ] = useState( item.template_name );

	// const importItem = async () => {
	// 	setLoading( 'importing' );
	// 	const data = await importTemplate( item.template_id );

	// 	if ( data.__file && data.content && 'wp_export' === data.__file ) {
	// 		importBlocks( data.content );
	// 	}
	// 	setLoading( false );
	// };

	const updateItem = async () => {
		setLoading( 'updating' );

		const url = stringifyUrl( {
			url: window.tiobDash.endpoint + item.template_id,
			query: {
				cache: window.localStorage.getItem( 'tpcCacheBuster' ),
				...window.tiobDash.params,
			},
		} );

		try {
			await apiFetch( {
				url,
				method: 'POST',
				data: {
					template_id: item.template_id,
					template_name: itemName || item.template_name,
				},
			} );

			window.localStorage.setItem( 'tpcCacheBuster', uuidv4() );

			await loadTemplates();
		} catch ( error ) {
			if ( error.message ) {
				console.log( error.message );
			}
		}

		setLoading( false );
		setEditing( ! isEditing );
	};

	const duplicateItem = async () => {
		setLoading( 'duplicating' );

		const url = stringifyUrl( {
			url: window.tiobDash.endpoint + item.template_id + '/clone',
			query: {
				cache: window.localStorage.getItem( 'tpcCacheBuster' ),
				...window.tiobDash.params,
			},
		} );

		try {
			await apiFetch( {
				url,
				method: 'POST',
			} );

			window.localStorage.setItem( 'tpcCacheBuster', uuidv4() );

			await loadTemplates();
		} catch ( error ) {
			if ( error.message ) {
				console.log( error.message );
			}
		}

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

		const url = stringifyUrl( {
			url: window.tiobDash.endpoint + item.template_id,
			query: {
				cache: window.localStorage.getItem( 'tpcCacheBuster' ),
				_method: 'DELETE',
				...window.tiobDash.params,
			},
		} );

		try {
			await apiFetch( { url, method: 'POST' } );
			window.localStorage.setItem( 'tpcCacheBuster', uuidv4() );

			await loadTemplates();
		} catch ( error ) {
			if ( error.message ) {
				console.log( error.message );
			}
		}

		setLoading( false );
	};

	// const importPreview = async () => {
	// 	togglePreview();
	// 	setPreviewData( {
	// 		type: 'library',
	// 		item,
	// 	} );
	// };
	if ( grid ) {
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
						{ ! userTemplate && (
							<Button
								isSecondary
								disabled={ false !== isLoading }
								// onClick={ importPreview }
							>
								{ __( 'Preview' ) }
							</Button>
						) }
						<Button
							isPrimary
							isBusy={ 'importing' === isLoading }
							disabled={ false !== isLoading }
							// onClick={ importItem }
						>
							{ __( 'Import' ) }
						</Button>

						{ userTemplate && (
							<div className="preview-controls">
								<Button
									label={ __( 'Edit' ) }
									icon={
										'updating' === isLoading ? update : edit
									}
									disabled={
										isEditing || false !== isLoading
									}
									className={ classnames( {
										'is-loading': 'updating' === isLoading,
									} ) }
									onClick={ () => setEditing( ! isEditing ) }
								/>

								<Button
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
								/>

								<Button
									label={ __( 'Delete' ) }
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
					{ isEditing ? (
						<>
							{ ' ' }
							<TextControl
								value={ itemName }
								onChange={ setItemName }
							/>
							<Button
								label={ __( 'Update' ) }
								icon={
									'updating' === isLoading ? update : check
								}
								disabled={ false !== isLoading }
								className={ classnames( {
									'is-loading': 'updating' === isLoading,
								} ) }
								onClick={ updateItem }
							/>
						</>
					) : (
						<p>{ item.template_name }</p>
					) }
				</div>
			</div>
		);
	}

	return (
		<div key={ item.template_id } className="table-row">
			<div className="title">
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

			{ userTemplate && (
				<div className="controls">
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
							isEditing
								? updateItem
								: () => setEditing( ! isEditing )
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
				</div>
			) }

			<div className="actions">
				{ ! userTemplate && (
					<Button
						isSecondary
						disabled={ false !== isLoading }
						// onClick={ importPreview }
					>
						{ __( 'Preview' ) }
					</Button>
				) }

				<Button
					isPrimary
					isBusy={ 'importing' === isLoading }
					disabled={ false !== isLoading }
					// onClick={ importItem }
				>
					{ __( 'Import' ) }
				</Button>
			</div>
		</div>
	);
};

export default ListItem;
