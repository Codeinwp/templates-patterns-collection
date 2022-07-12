/* global tiobDash */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button, Dashicon, Popover } from '@wordpress/components';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import classnames from 'classnames';
import { isTabbedEditor } from '../utils/common';

const Search = ( {
	count,
	categories,
	editors,
	onSearch,
	category,
	editor,
	onlyProSites,
	setCurrentCategory,
	setCurrentEditor,
	query,
	className,
	showCount = false,
} ) => {
	const [ open, setOpen ] = useState( false );
	const toggleDropdown = () => setOpen( ! open );
	const CategoriesDropdown = () => {
		return (
			<div className="ob-dropdown categories-selector">
				<Button
					onClick={ toggleDropdown }
					className="select ob-dropdown"
				>
					{ categories[ category ] }
					<Dashicon
						size={ 14 }
						icon={ open ? 'arrow-up-alt2' : 'arrow-down-alt2' }
					/>
					{ open && (
						<Popover
							position="bottom center"
							onClose={ toggleDropdown }
							noArrow
						>
							{ open && (
								<ul className="options">
									{ Object.keys( categories ).map(
										( key, index ) => {
											if ( key === category ) {
												return null;
											}
											if (
												'free' === key &&
												count.all === count[ key ]
											) {
												return null;
											}
											return (
												<li key={ index }>
													<a
														href="#"
														onClick={ ( e ) => {
															e.preventDefault();
															setCurrentCategory(
																key
															);
															setOpen( false );
														} }
													>
														<span>
															{
																categories[
																	key
																]
															}
														</span>
														{ showCount && (
															<span className="count">
																{ count[ key ] }
															</span>
														) }
													</a>
												</li>
											);
										}
									) }
								</ul>
							) }
						</Popover>
					) }
				</Button>
			</div>
		);
	};
	const EditorDropdown = () => {
		return (
			<div className="ob-dropdown categories-selector">
				<Button
					onClick={ toggleDropdown }
					className="select ob-dropdown"
				>
					<span className="label-editor">
						<span className="icon-wrap">
							<img
								className="editor-icon"
								src={
									tiobDash.assets +
									'img/' +
									editors[ editor ].icon
								}
								alt={ __(
									'Builder Logo',
									'templates-patterns-collection'
								) }
							/>
						</span>
						{ onlyProSites.includes( editor ) && (
							<Dashicon
								icon="lock"
								style={ {
									fontSize: '16px',
									width: '16px',
									height: '16px',
									marginLeft: '0',
								} }
							/>
						) }
						{ editors[ editor ].niceName }
					</span>
					<Dashicon
						size={ 14 }
						icon={ open ? 'arrow-up-alt2' : 'arrow-down-alt2' }
					/>
					{ open && (
						<Popover
							position="bottom center"
							onClose={ toggleDropdown }
							noArrow
						>
							{ open && (
								<ul className="options">
									{ Object.keys( editors ).map(
										( key, index ) => {
											if ( key === editor ) {
												return null;
											}
											return (
												<li key={ index }>
													<a
														href="#"
														onClick={ ( e ) => {
															e.preventDefault();
															setCurrentEditor(
																key
															);
															setOpen( false );
														} }
													>
														<span className="label-editor">
															<span className="icon-wrap">
																<img
																	className="editor-icon"
																	src={
																		tiobDash.assets +
																		'img/' +
																		editors[
																			key
																		].icon
																	}
																	alt={ __(
																		'Builder Logo',
																		'templates-patterns-collection'
																	) }
																/>
															</span>
															{ onlyProSites.includes(
																key
															) && (
																<Dashicon
																	icon="lock"
																	style={ {
																		fontSize:
																			'16px',
																		width:
																			'16px',
																		height:
																			'16px',
																	} }
																/>
															) }
															{
																editors[ key ]
																	.niceName
															}
														</span>
														{ showCount && (
															<span className="count">
																{ count[ key ] }
															</span>
														) }
													</a>
												</li>
											);
										}
									) }
								</ul>
							) }
						</Popover>
					) }
				</Button>
			</div>
		);
	};

	const wrapClasses = classnames( className, 'header-form' );

	return (
		<div className={ wrapClasses }>
			<div className="search">
				<img
					src={ tiobDash.assets + '/img/search.svg' }
					alt={ __( 'Search Icon' ) }
				/>
				<input
					onChange={ ( e ) => {
						onSearch( e.target.value );
					} }
					type="search"
					value={ query }
					placeholder={
						__(
							'Search for a starter site',
							'templates-patterns-collection'
						) + '...'
					}
				/>
				{ isTabbedEditor && <CategoriesDropdown /> }
				{ ! isTabbedEditor && <EditorDropdown /> }
			</div>
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getCurrentCategory, getCurrentEditor, getSearchQuery } = select(
			'neve-onboarding'
		);
		return {
			editor: getCurrentEditor(),
			category: getCurrentCategory(),
			query: getSearchQuery(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setCurrentCategory,
			setCurrentEditor,
			setSearchQuery,
		} = dispatch( 'neve-onboarding' );
		return {
			setCurrentCategory: ( category ) => setCurrentCategory( category ),
			setCurrentEditor: ( editor ) => setCurrentEditor( editor ),
			onSearch: ( query ) => setSearchQuery( query ),
		};
	} )
)( Search );
