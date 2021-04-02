/* eslint-disable camelcase */

import { check, edit, page, trash, update } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { Button, Icon, TextControl, Tooltip } from '@wordpress/components';

import { useState } from '@wordpress/element';
import classnames from 'classnames';

import {
	updateTemplate,
	// duplicateTemplate,
	deleteTemplate,
} from './common';

const ListItem = ( {
	sortingOrder,
	item,
	loadTemplates,
	userTemplate,
	grid,
	onPreview,
	onImport,
	upsell = false,
} ) => {
	const [ isLoading, setLoading ] = useState( false );
	const [ isEditing, setEditing ] = useState( false );
	const [ itemName, setItemName ] = useState( item.template_name );

	const updateItem = async ( e ) => {
		e.preventDefault();
		const { template_id, template_name } = item;
		setLoading( 'updating' );
		await updateTemplate( template_id, itemName || template_name ).then(
			( r ) => {
				if ( r.success ) {
					setEditing( ! isEditing );
					setLoading( false );
				}
			}
		);
	};

	/*const duplicateItem = async () => {
		setLoading( 'duplicating' );
		await duplicateTemplate( item.template_id ).then( ( r ) => {
			if ( r.success ) {
				loadTemplates();
			}
		} );
		setLoading( false );
	};*/

	const deleteItem = async () => {
		if (
			! window.confirm(
				__( 'Are you sure you want to delete this template?' )
			)
		) {
			return false;
		}

		setLoading( 'deleteing' );

		deleteTemplate( item.template_id ).then( ( r ) => {
			if ( r.success ) {
				loadTemplates( {
					page: 0,
					...sortingOrder,
				} );
				setLoading( false );
			}
		} );
	};

	const handlePreview = () => {
		onPreview( item.link );
	};

	const actionClasses = classnames( 'actions', {
		'no-controls': ! userTemplate,
	} );

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
						{ ! userTemplate && item.link && (
							<Button
								isSecondary
								disabled={ false !== isLoading }
								onClick={ handlePreview }
							>
								{ __( 'Preview' ) }
							</Button>
						) }
						{ ! upsell && (
							<Button
								isPrimary
								isBusy={ 'importing' === isLoading }
								disabled={ false !== isLoading }
								onClick={ onImport }
							>
								{ __( 'Import' ) }
							</Button>
						) }

						{ userTemplate && (
							<div className="preview-controls">
								{ ! item.link && (
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
									/>
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
									label={ __( 'Delete' ) }
									icon={
										'deleteing' === isLoading
											? update
											: trash
									}
									disabled={ false !== isLoading }
									className={ classnames( {
										'is-loading': 'deleteing' === isLoading,
									} ) }
									onClick={ deleteItem }
								/>
							</div>
						) }
					</div>
				</div>

				<div className="card-footer">
					{ isEditing ? (
						<form onSubmit={ updateItem }>
							<TextControl
								value={ itemName }
								onChange={ setItemName }
							/>
							<Button
								type="submit"
								label={ __( 'Update' ) }
								icon={
									'updating' === isLoading ? update : check
								}
								disabled={ false !== isLoading }
								className={ classnames( {
									'is-loading': 'updating' === isLoading,
								} ) }
							/>
						</form>
					) : (
						<p>{ itemName }</p>
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
					itemName
				) }
			</div>

			{ userTemplate && (
				<div className="controls">
					{ item.link ? (
						<Tooltip text={ __( 'This template is synced to a page.' ) }>
							<Button
								label={ __( 'Edit' ) }
								icon={ edit }
								disabled={ true }
							>
								{ __( 'Edit' ) }
							</Button>
						</Tooltip>
					) : (
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
							onClick={ () => isEditing ? updateItem : setEditing( ! isEditing ) }
						>
							{ isEditing ? __( 'Update' ) : __( 'Edit' ) }
						</Button>
					) }

					{ /*	<Button
						label={ __( 'Duplicate' ) }
						icon={ 'duplicating' === isLoading ? update : group }
						disabled={ false !== isLoading }
						className={ classnames( {
							'is-loading': 'duplicating' === isLoading,
						} ) }
						onClick={ duplicateItem }
					/>
					*/ }
					<Button
						label={ __( 'Delete' ) }
						icon={ 'deleteing' === isLoading ? update : trash }
						disabled={ false !== isLoading }
						className={ classnames( {
							'is-loading': 'deleteing' === isLoading,
						} ) }
						onClick={ deleteItem }
					>
						{ 'deleting' === isLoading
							? __( 'Deleting' ) + '...'
							: __( 'Delete' ) }
					</Button>
				</div>
			) }

			<div className={ actionClasses }>
				{ ! userTemplate && item.link && (
					<Button
						isSecondary
						disabled={ false !== isLoading }
						onClick={ handlePreview }
					>
						{ __( 'Preview' ) }
					</Button>
				) }

				<Button
					isPrimary
					isBusy={ 'importing' === isLoading }
					onClick={ onImport }
					disabled={ false !== isLoading }
				>
					{ __( 'Import' ) }
				</Button>
			</div>
		</div>
	);
};

export default ListItem;
