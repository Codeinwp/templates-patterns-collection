/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { parse } = wp.blocks;

const { BlockPreview } = wp.blockEditor;

const { Button, Placeholder, Spinner } = wp.components;

const { useViewportMatch } = wp.compose;

const { useDispatch, useSelect } = wp.data;

const { useEffect, useState } = wp.element;

/**
 * Internal dependencies
 */
import { importTemplate } from './../data/templates-cloud/index.js';

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
		importBlocks( content );
	};

	return (
		<div className="wp-block-ti-tpc-templates-cloud__modal-content">
			<div className="wp-block-ti-tpc-templates-cloud__modal-content__preview-header">
				<div className="wp-block-ti-tpc-templates-cloud__modal-content__preview-header__left">
					{ item.template_name || __( 'Template' ) }
				</div>

				<div className="wp-block-ti-tpc-templates-cloud__modal-content__preview-header__right">
					<Button isSecondary isLarge onClick={ togglePreview }>
						{ __( 'Close Preview' ) }
					</Button>

					<Button
						isPrimary
						isLarge
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
				<div className="wp-block-ti-tpc-templates-cloud__modal-content__preview-content">
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
