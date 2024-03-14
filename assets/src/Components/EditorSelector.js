import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button, Dashicon, Popover } from '@wordpress/components';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

const EditorSelector = ( {
	EDITOR_MAP,
	count,
	editor,
	setCurrentEditor,
	sites,
	isSmall,
} ) => {
	const [ open, setOpen ] = useState( false );
	const editorsOrderedFromAPI = Object.keys( sites );
	const toggleDropdown = () => setOpen( ! open );
	const wrapClasses = classnames( [
		'ob-dropdown',
		'editor-selector',
		{ small: isSmall },
	] );
	return (
		<div className={ wrapClasses }>
			<Button onClick={ toggleDropdown } className="select ob-dropdown">
				<img
					className="editor-icon"
					src={ tiobDash.assets + 'img/' + EDITOR_MAP[ editor ].icon }
					alt={ __(
						'Builder Logo',
						'templates-patterns-collection'
					) }
				/>
				{ ! isSmall && <span>{ EDITOR_MAP[ editor ].niceName }</span> }
				<span className="count">{ count[ editor ] }</span>
				<Dashicon
					size={ 14 }
					icon={ open ? 'arrow-up-alt2' : 'arrow-down-alt2' }
				/>
				{ open && (
					<Popover
						position="bottom center"
						onClose={ toggleDropdown }
						inline
						noArrow
						inline
					>
						{ open && (
							<ul className="options">
								{ editorsOrderedFromAPI.map( ( key, index ) => {
									if ( key === editor ) {
										return null;
									}
									return (
										<li key={ index }>
											<a
												href="#"
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
												<span>
													{
														EDITOR_MAP[ key ]
															.niceName
													}
												</span>
												<span className="count">
													{ count[ key ] }
												</span>
											</a>
										</li>
									);
								} ) }
							</ul>
						) }
					</Popover>
				) }
			</Button>
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getCurrentEditor, getSites } = select( 'neve-onboarding' );
		return {
			editor: getCurrentEditor(),
			sites: getSites().sites,
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setCurrentEditor } = dispatch( 'neve-onboarding' );
		return {
			setCurrentEditor: ( editor ) => setCurrentEditor( editor ),
		};
	} )
)( EditorSelector );
