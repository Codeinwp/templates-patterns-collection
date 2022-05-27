import classnames from 'classnames';

import { __ } from '@wordpress/i18n';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

import { Dashicon } from '@wordpress/components';
const EditorTabs = ( {
	EDITOR_MAP,
	count,
	onlyProSites,
	editor,
	setCurrentEditor,
	sites,
} ) => {
	const editorsOrderedFromAPI = Object.keys( sites );
	return (
		<div className="editor-tabs">
			{ editorsOrderedFromAPI.map( ( key, index ) => {
				const classes = classnames( [
					'tab',
					key,
					{ active: key === editor },
				] );
				return (
					<a
						key={ index }
						href="#"
						className={ classes }
						onClick={ ( e ) => {
							e.preventDefault();
							setCurrentEditor( key );
						} }
					>
						<span className="icon-wrap">
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
						</span>
						<span className="editor">
							{ onlyProSites.includes( key ) && (
								<Dashicon
									icon="lock"
									style={ {
										fontSize: '16px',
										width: '16px',
										height: '16px',
									} }
								/>
							) }
							{ EDITOR_MAP[ key ].niceName }
						</span>
						<span className="count">{ count[ key ] }</span>
					</a>
				);
			} ) }
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
)( EditorTabs );
