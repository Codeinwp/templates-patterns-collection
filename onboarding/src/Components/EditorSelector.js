/* global tiobDash */
import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
import { Button, Dashicon } from '@wordpress/components';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import classnames from 'classnames';
import { EDITOR_MAP } from '../utils/common';

const EditorSelector = ( { editor, setCurrentEditor, sites } ) => {
	const [ open, setOpen ] = useState( false );
	const editorsOrderedFromAPI = Object.keys( sites );
	const dropdownRef = useRef();

	const toggleDropdown = () => setOpen( ! open );

	const handleOutsideClick = ( e ) => {
		if (
			dropdownRef.current &&
			! dropdownRef.current.contains( e.target )
		) {
			setOpen( false );
		}
	};

	useEffect( () => {
		const win = document.defaultView;
		win.addEventListener( 'click', handleOutsideClick );

		return () => {
			win.removeEventListener( 'click', handleOutsideClick );
		};
	}, [] );

	const toggleButtonClasses = classnames(
		'select',
		'ob-dropdown',
		open ? 'active' : ''
	);

	return (
		<div className="ob-editor-selector" ref={ dropdownRef }>
			<Button
				onClick={ toggleDropdown }
				className={ toggleButtonClasses }
			>
				<span className="ob-current-editor">
					<img
						className="editor-icon"
						src={
							tiobDash.assets + 'img/' + EDITOR_MAP[ editor ].icon
						}
						alt={ __(
							'Builder Logo',
							'templates-patterns-collection'
						) }
					/>
					<Dashicon
						size={ 14 }
						icon={ open ? 'arrow-up-alt2' : 'arrow-down-alt2' }
					/>
				</span>
				{ open && (
					<span className="ob-editor-options">
						<ul className="options">
							{ editorsOrderedFromAPI.map( ( key, index ) => {
								if ( key === editor ) {
									return null;
								}
								return (
									<li key={ index }>
										<button
											className="ob-editor-option"
											onClick={ ( e ) => {
												e.preventDefault();
												setCurrentEditor( key );
												setOpen( false );
											} }
										>
											<img
												className="editor-icon"
												src={
													tiobDash.assets +
													'img/' +
													EDITOR_MAP[ key ].icon
												}
												alt={ __(
													'Builder Logo',
													'templates-patterns-collection'
												) }
											/>
										</button>
									</li>
								);
							} ) }
						</ul>
					</span>
				) }
			</Button>
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getCurrentEditor, getSites } = select( 'ti-onboarding' );
		return {
			editor: getCurrentEditor(),
			sites: getSites().sites,
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setCurrentEditor } = dispatch( 'ti-onboarding' );
		return {
			setCurrentEditor: ( editor ) => setCurrentEditor( editor ),
		};
	} )
)( EditorSelector );
