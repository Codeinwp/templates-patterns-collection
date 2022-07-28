/* global tiobDash */
import classnames from 'classnames';
import { useState } from '@wordpress/element';
import { Button, Dashicon, Popover } from '@wordpress/components';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

const CategorySelector = ( {
	categories,
	count,
	category,
	setCurrentCategory,
	showCount = false,
} ) => {
	const [ open, setOpen ] = useState( false );
	const toggleDropdown = () => setOpen( ! open );
	const wrapClasses = classnames( [
		'ob-dropdown',
		'editor-selector',
		{ small: true },
	] );
	return (
		<div className={ wrapClasses }>
			<Button onClick={ toggleDropdown } className="select ob-dropdown">
				<span>{ categories[ category ] }</span>
				<span className="count">{ showCount ? count[ category ] : '' }</span>
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
											tiobDash &&
											tiobDash.isValidLicense === '1' &&
											'free' === key
										) {
											return null;
										}
										if ( 1 > count[ key ] ) {
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
														{ categories[ key ] }
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

export default compose(
	withSelect( ( select ) => {
		const { getCurrentCategory } = select( 'neve-onboarding' );
		return {
			category: getCurrentCategory(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setCurrentCategory } = dispatch( 'neve-onboarding' );
		return {
			setCurrentCategory: ( category ) => setCurrentCategory( category ),
		};
	} )
)( CategorySelector );
