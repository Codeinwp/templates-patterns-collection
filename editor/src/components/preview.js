import { __ } from '@wordpress/i18n';
import { parse } from '@wordpress/blocks';
import { Button, Placeholder, Spinner } from '@wordpress/components';
import { useViewportMatch } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { BlockPreview } from '@wordpress/block-editor';

import { importTemplate } from './../data/templates-cloud/index';

const Preview = ( { isFetching, importBlocks } ) => {
	const isLarger = useViewportMatch( 'large', '>=' );
	const isLarge = useViewportMatch( 'large', '<=' );
	const isSmall = useViewportMatch( 'small', '>=' );
	const isSmaller = useViewportMatch( 'small', '<=' );

	let viewportWidth = 1400;

	const isTablet = ! isLarger && ! isLarge && isSmall && ! isSmaller;
	const isMobile = ! isLarger && ! isLarge && ! isSmall && ! isSmaller;

	if ( isTablet ) {
		viewportWidth = 960;
	} else if ( isMobile ) {
		viewportWidth = 600;
	}

	const { setFetching, togglePreview } = useDispatch( 'tpc/block-editor' );

	const { item } = useSelect( ( select ) =>
		select( 'tpc/block-editor' ).getPreview()
	);

	useEffect( () => {
		init();
	}, [] );

	const [ content, setContent ] = useState( '' );

	const init = async () => {
		setFetching( true );
		await importContent();
		setFetching( false );
	};

	const importContent = async () => {
		setFetching( true );
		const data = await importTemplate( item.template_id );

		if ( data.__file && data.content && 'wp_export' === data.__file ) {
			setContent( data.content );
		}
		setFetching( false );
	};

	const importItem = () => {
		togglePreview();
		importBlocks( content, item.meta || [] );
	};

	return (
		<div className="tpc-modal-content">
			<div className="preview-header">
				<div className="left">
					{ item.template_name || __( 'Template' ) }
				</div>

				<div className="right">
					<Button isSecondary onClick={ togglePreview }>
						{ __( 'Close Preview' ) }
					</Button>

					<Button
						isPrimary
						isBusy={ isFetching }
						disabled={ isFetching }
						onClick={ importItem }
					>
						{ __( 'Import' ) }
					</Button>
				</div>
			</div>

			{ isFetching ? (
				<Placeholder>
					<Spinner />
				</Placeholder>
			) : (
				<div className="preview-content">
					<BlockPreview
						blocks={ parse( content ) }
						viewportWidth={ viewportWidth }
					/>
				</div>
			) }
		</div>
	);
};

export default Preview;
