/**
 * WordPress dependencies
 */
import { Notice } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';

const Notices = () => {
	const notices = useSelect( ( select ) =>
		select( 'core/notices' ).getNotices(
			'themeisle-blocks/notices/templates-cloud'
		)
	);

	const { removeNotice } = useDispatch( 'core/notices' );

	return (
		<div className="notices">
			{ notices.map( ( notice ) => (
				<Notice
					key={ notice.id }
					status={ notice.status }
					isDismissible={ notice.isDismissible }
					onRemove={ () =>
						removeNotice(
							notice.id,
							'themeisle-blocks/notices/templates-cloud'
						)
					}
					actions={ notice.actions }
				>
					{ notice.content }
				</Notice>
			) ) }
		</div>
	);
};

export default Notices;
