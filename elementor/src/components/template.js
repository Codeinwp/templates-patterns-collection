/* global moment */
import { Button, DropdownMenu } from '@wordpress/components';
import { withDispatch } from '@wordpress/data';
import { Fragment, useState } from '@wordpress/element';
import { moreHorizontalMobile, edit, stack, trash } from '@wordpress/icons';

const Template = ( {
	table = false,
	item,
	id,
	title,
	meta,
	thumbnail,
	onImport,
	onUpdateTemplate,
	onDelete,
	onDuplicate,
	togglePreview,
	setPreviewData,
} ) => {
	const [ isEditing, setEditing ] = useState( false );

	const [ itemTitle, setItemTitle ] = useState( title );

	if ( table ) {
		return (
			<div className="ti-tpc-template-library-templates-table-item">
				<div className="ti-tpc-template-library-templates-table-column">
					{ isEditing ? (
						<Fragment>
							<input
								type="text"
								value={ itemTitle }
								onChange={ ( e ) =>
									setItemTitle( e.target.value )
								}
							/>

							<Button
								className="elementor-button"
								onClick={ () =>
									onUpdateTemplate( id, itemTitle )
								}
							>
								<i
									className="eicon-check"
									aria-hidden="true"
									title={ window.tiTpc.library.actions.save }
								></i>
								<span className="elementor-button-title elementor-hidden">
									{ window.tiTpc.library.actions.save }
								</span>
							</Button>

							<Button
								className="elementor-button"
								onClick={ () => setEditing( false ) }
							>
								<i
									className="eicon-editor-close"
									aria-hidden="true"
									title={
										window.tiTpc.library.actions.cancel
									}
								></i>
								<span className="elementor-button-title elementor-hidden">
									{ window.tiTpc.library.actions.cancel }
								</span>
							</Button>
						</Fragment>
					) : (
						title
					) }
				</div>
				<div className="ti-tpc-template-library-templates-table-column">
					{ moment( item.date ).format( 'MMMM D, YYYY' ) }
				</div>
				<div className="ti-tpc-template-library-templates-table-column">
					{ moment( item.modified ).format( 'MMMM D, YYYY' ) }
				</div>
				<div className="ti-tpc-template-library-templates-table-column">
					<Button
						className="elementor-button elementor-button-success"
						onClick={ () => onImport( { id, title, meta } ) }
					>
						<i
							className="eicon-file-download"
							aria-hidden="true"
						></i>
						<span className="elementor-button-title">
							{ window.tiTpc.library.actions.insert }
						</span>
					</Button>

					<DropdownMenu
						icon={ moreHorizontalMobile }
						label={
							window.tiTpc.library.filters.sortLabels.actions
						}
						popoverProps={ {
							position: 'bottom right',
							noArrow: false,
						} }
						controls={ [
							{
								title: window.tiTpc.library.actions.edit,
								icon: edit,
								isDisabled: item.link ? true : false,
								onClick: () => setEditing( true ),
							},
							{
								title: window.tiTpc.library.actions.duplicate,
								icon: stack,
								onClick: () => onDuplicate( id ),
							},
							{
								title: window.tiTpc.library.actions.delete,
								icon: trash,
								onClick: () => onDelete( id ),
							},
						] }
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="ti-tpc-template-library-template">
			<div className="ti-tpc-template-library-template-body">
				<div
					className="ti-tpc-template-library-template-screenshot"
					style={ {
						backgroundImage: `url( ${ thumbnail })`,
					} }
				></div>
				<Button
					className="ti-tpc-template-library-template-preview"
					onClick={ () => {
						togglePreview();
						setPreviewData( { ...item } );
					} }
				>
					<i className="eicon-zoom-in-bold" aria-hidden="true"></i>
				</Button>
			</div>

			<div className="ti-tpc-template-library-template-footer">
				<Button
					className="ti-tpc-template-library-template-action elementor-button"
					onClick={ () => onImport( { id, title, meta } ) }
				>
					<i className="eicon-file-download" aria-hidden="true"></i>
					<span>{ window.tiTpc.library.actions.insert }</span>
				</Button>

				<div className="ti-tpc-template-library-template-name">
					{ title }
				</div>
			</div>
		</div>
	);
};

export default withDispatch( ( dispatch ) => {
	const { togglePreview, setPreviewData } = dispatch( 'tpc/elementor' );

	return {
		togglePreview,
		setPreviewData,
	};
} )( Template );
