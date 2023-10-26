/**
 * WordPress dependencies
 */
import { createPortal, useLayoutEffect, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * A wrapper for the TPC templates button that renders it inside post header center.
 */
function WrappedTPCTemplatesButton() {
	const root = useRef( null );
	const referenceNode = useRef( null );

	const { isEditedPostSaveable, isViewable } = useSelect(
		( select ) => ( {
			isEditedPostSaveable: select(
				'core/editor'
			).isEditedPostSaveable(),
			isViewable: select( 'core' ).getPostType(
				select( 'core/editor' ).getEditedPostAttribute( 'type' )
			)?.viewable,
		} ),
		[]
	);

	useLayoutEffect( () => {
		referenceNode.current = document.querySelector(
			'.edit-post-header__center'
		);

		if ( referenceNode.current ) {
			if ( ! root.current ) {
				root.current = document.createElement( 'div' );
				root.current.className = 'ti-tpc-templates-button-wrapper';
			}

			referenceNode.current.appendChild( root.current );
		}

		return () => {
			if ( referenceNode.current && root.current ) {
				referenceNode.current.removeChild( root.current );
				referenceNode.current = null;
			}
		};
	}, [ isEditedPostSaveable, isViewable ] );

	return root.current
		? createPortal( <button>Hi</button>, root.current )
		: null;
}

export const render = WrappedTPCTemplatesButton;
