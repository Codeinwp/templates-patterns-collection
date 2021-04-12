/* eslint-disable no-undef */
/* eslint-disable camelcase */
import classnames from 'classnames';

import { check, edit, page, trash, update } from '@wordpress/icons';
import { Button, Icon, TextControl, Tooltip } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

import {
	updateTemplate,
	deleteTemplate,
	fetchLibrary,
} from './../data/templates-cloud/index';

const ListItem = ( { layout, item, importTemplate, deletable } ) => {
	const { togglePreview, setPreviewData } = useDispatch( 'tpc/beaver' );
	const [ isLoading, setLoading ] = useState( false );
	const [ isEditing, setEditing ] = useState( false );
	const [ itemName, setItemName ] = useState( item.template_name );

	const updateItem = async () => {
		setLoading( 'updating' );
		await updateTemplate( {
			template_id: item.template_id,
			template_name: itemName || item.template_name,
		} );
		await fetchLibrary();
		setLoading( false );
		setEditing( ! isEditing );
	};

	const deleteItem = async () => {
		if ( ! window.confirm( window.tiTpc.library.deleteItem ) ) {
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
						{ ! deletable && item.link && (
							<Button
								isSecondary
								disabled={ false !== isLoading }
								onClick={ importPreview }
							>
								{ window.tiTpc.library.actions.preview }
							</Button>
						) }

						<Button
							isPrimary
							isBusy={ 'importing' === isLoading }
							disabled={ false !== isLoading }
							onClick={ () => importTemplate( item.template_id ) }
						>
							{ window.tiTpc.library.actions.import }
						</Button>

						{ deletable && (
							<div className="preview-controls">
								<Button
									label={
										window.tiTpc.library.actions.delete
									}
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
						label={ window.tiTpc.exporter.textLabel }
						hideLabelFromVision
						value={ itemName }
						onChange={ setItemName }
					/>
				) : (
					item.template_name
				) }
			</div>

			{ deletable && (
				<div className="row-controls">
					{ item.link ? (
						<Tooltip text={ window.tiTpc.library.synced }>
							<Button
								label={ window.tiTpc.library.actions.edit }
								icon={ edit }
								disabled={ true }
							>
								{ window.tiTpc.library.actions.edit }
							</Button>
						</Tooltip>
					) : (
						<Button
							label={
								isEditing
									? window.tiTpc.library.actions.update
									: window.tiTpc.library.actions.edit
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
								? window.tiTpc.library.actions.update
								: window.tiTpc.library.actions.edit }
						</Button>
					) }

					<Button
						label={ window.tiTpc.library.actions.delete }
						icon={ 'deleting' === isLoading ? update : trash }
						disabled={ false !== isLoading }
						className={ classnames( {
							'is-loading': 'deleting' === isLoading,
						} ) }
						onClick={ deleteItem }
					>
						{ 'deleting' === isLoading
							? window.tiTpc.library.actions.deleting + '...'
							: window.tiTpc.library.actions.delete }
					</Button>
				</div>
			) }
			<div className={ actionClasses }>
				{ ! deletable && item.link && (
					<Button
						isSecondary
						disabled={ false !== isLoading }
						onClick={ importPreview }
					>
						{ window.tiTpc.library.actions.preview }
					</Button>
				) }

				<Button
					isPrimary
					isBusy={ 'importing' === isLoading }
					disabled={ false !== isLoading }
					onClick={ () => importTemplate( item.template_id ) }
				>
					{ window.tiTpc.library.actions.import }
				</Button>
			</div>
		</div>
	);
};

export default ListItem;
