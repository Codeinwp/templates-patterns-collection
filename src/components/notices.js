/**
 * WordPress dependencies
 */
const { Notice } = wp.components;

const {
	useDispatch,
	useSelect
} = wp.data;

const Notices = () => {
	const notices = useSelect( select => select( 'core/notices' ).getNotices( 'themeisle-blocks/notices/templates-cloud' ) );

	const { removeNotice } = useDispatch( 'core/notices' );

	return (
		<div className="wp-block-themeisle-blocks-templates-cloud__modal-content__notices">
			{ notices.map( notice => (
				<Notice
					status={ notice.status }
					isDismissible={ notice.isDismissible }
					onRemove={ () => removeNotice( notice.id, 'themeisle-blocks/notices/templates-cloud' ) }
					actions={ notice.actions }
				>
					{ notice.content }
				</Notice>
			) ) }
		</div>
	);
};

export default Notices;
