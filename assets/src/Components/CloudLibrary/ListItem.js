/* eslint-disable camelcase */

import { check, edit, page, trash, update } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { Button, Icon, TextControl, Tooltip } from '@wordpress/components';
import api from '@wordpress/api';

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

	/**
	 * Remove the template from the global option.
	 *
	 * @param {string} templateId The template ID.
	 */
	const removeFromFseGlobalOption = ( templateId ) => {
		const settings = new api.models.Settings();

		settings.fetch().then( ( response ) => {
			const newSettings = Object.keys(
				response.templates_patterns_collection_fse_templates
			).reduce( ( acc, key ) => {
				const template =
					response.templates_patterns_collection_fse_templates[ key ];
				const updatedTemplate = { ...template };

				if ( template._ti_tpc_template_id === templateId ) {
					// Skip the item you want to delete
					return acc;
				}

				acc[ key ] = updatedTemplate;
				return acc;
			}, {} );

			settings.save( {
				templates_patterns_collection_fse_templates: newSettings,
			} );
		} );
	};

	const deleteItem = async () => {
		if (
			! window.confirm(
				__( 'Are you sure you want to delete this template?', 'templates-patterns-collection' )
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
				if ( item.template_type === 'fse' ) {
					removeFromFseGlobalOption( item.template_id );
				}
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
								{ __( 'Preview', 'templates-patterns-collection' ) }
							</Button>
						) }
						{ ! upsell && (
							<Button
								isPrimary
								isBusy={ 'importing' === isLoading }
								disabled={ false !== isLoading }
								onClick={ onImport }
							>
								{ __( 'Import', 'templates-patterns-collection' ) }
							</Button>
						) }

						{ userTemplate && (
							<div className="preview-controls">
								{ ! item.link && (
									<Button
										label={ __( 'Edit', 'templates-patterns-collection' ) }
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
									label={ __( 'Delete', 'templates-patterns-collection' ) }
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
								label={ __( 'Update', 'templates-patterns-collection' ) }
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
						<>
							<p>{ itemName }</p>
							{ item.template_type === 'fse' && (
								<div className="type-label">FSE</div>
							) }
						</>
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
						label={ __( 'Template Name', 'templates-patterns-collection' ) }
						hideLabelFromVision
						value={ itemName }
						onChange={ setItemName }
					/>
				) : (
					itemName
				) }
			</div>

			{ item.template_type === 'fse' && (
				<div className="type">
					<div className="type-label">FSE</div>
				</div>
			) }

			{ userTemplate && (
				<div className="controls">
					{ item.link ? (
						<Tooltip
							text={ __( 'This template is synced to a page.', 'templates-patterns-collection' ) }
						>
							<Button
								label={ __( 'Edit', 'templates-patterns-collection' ) }
								icon={ edit }
								disabled={ true }
							>
								{ __( 'Edit', 'templates-patterns-collection' ) }
							</Button>
						</Tooltip>
					) : (
						<Button
							label={ isEditing ? __( 'Update', 'templates-patterns-collection' ) : __( 'Edit', 'templates-patterns-collection' ) }
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
							onClick={ ( e ) => {
								if ( isEditing ) {
									updateItem( e ).then( () =>
										setEditing( ! isEditing )
									);
									return;
								}
								setEditing( ! isEditing );
							} }
						>
							{ isEditing ? __( 'Update', 'templates-patterns-collection' ) : __( 'Edit', 'templates-patterns-collection' ) }
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
						label={ __( 'Delete', 'templates-patterns-collection' ) }
						icon={ 'deleteing' === isLoading ? update : trash }
						disabled={ false !== isLoading }
						className={ classnames( {
							'is-loading': 'deleteing' === isLoading,
						} ) }
						onClick={ deleteItem }
					>
						{ 'deleting' === isLoading
							? __( 'Deleting', 'templates-patterns-collection' ) + '...'
							: __( 'Delete', 'templates-patterns-collection' ) }
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
						{ __( 'Preview', 'templates-patterns-collection' ) }
					</Button>
				) }

				<Button
					isPrimary
					isBusy={ 'importing' === isLoading }
					onClick={ onImport }
					disabled={ false !== isLoading }
				>
					{ __( 'Import', 'templates-patterns-collection' ) }
				</Button>
			</div>
		</div>
	);
};

export default ListItem;
