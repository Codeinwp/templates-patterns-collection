import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { Dropdown, Button } from '@wordpress/components';
import classnames from 'classnames';
import { useMemo } from '@wordpress/element';
import { ONBOARDING_COLORS } from '../utils/common';

/*
 * Color-family filter (recolor-the-thumbnails). Single compact "Color" control in the
 * filter bar that opens a swatch popover — deliberately NOT a second row of category-
 * style pills. Single-select: picking a family narrows the grid to demos that ship it
 * and recolors their cards (StarterSiteCard); picking the active one (or "Any color")
 * clears. Renders nothing until the catalog carries per-site `colors` (zero-regression).
 */
const ColorButtons = () => {
	const { selectedColors, sitesMetadata, editor } = useSelect( ( select ) => ( {
		selectedColors: select( 'ti-onboarding' ).getSelectedColors(),
		sitesMetadata: select( 'ti-onboarding' ).getSites(),
		editor: select( 'ti-onboarding' ).getCurrentEditor(),
	} ) );
	const { setColors } = useDispatch( 'ti-onboarding' );

	// Families actually present in the current editor's catalog — others render disabled.
	const availableColors = useMemo( () => {
		const present = new Set();
		const bucket = sitesMetadata?.sites?.[ editor ] || {};
		Object.values( bucket ).forEach( ( site ) => {
			if ( Array.isArray( site?.colors ) ) {
				site.colors.forEach( ( c ) => present.add( c ) );
			}
		} );
		return present;
	}, [ sitesMetadata, editor ] );

	if ( availableColors.size === 0 ) {
		return null;
	}

	const selected = selectedColors[ 0 ] || null;
	const selectedDef = ONBOARDING_COLORS.find( ( c ) => c.key === selected );

	const pick = ( key, onClose ) => {
		setColors( selected === key ? [] : [ key ] ); // single-select toggle
		if ( onClose ) {
			onClose();
		}
	};

	return (
		<Dropdown
			className="ob-color-dd"
			contentClassName="ob-color-pop"
			popoverProps={ { placement: 'bottom-start' } }
			renderToggle={ ( { isOpen, onToggle } ) => (
				<Button
					className={ classnames( 'ob-color-toggle', {
						active: !! selectedDef,
					} ) }
					onClick={ onToggle }
					aria-expanded={ isOpen }
				>
					<span
						className={ classnames( 'ob-color-toggle-dot', {
							rainbow: ! selectedDef,
						} ) }
						style={
							selectedDef
								? { background: selectedDef.hex }
								: undefined
						}
					/>
					{ selectedDef
						? selectedDef.label
						: __( 'Color', 'templates-patterns-collection' ) }
					<span className="ob-color-caret" aria-hidden="true">
						▾
					</span>
				</Button>
			) }
			renderContent={ ( { onClose } ) => (
				<div className="ob-color-grid" role="group">
					{ ONBOARDING_COLORS.map( ( { key, label, hex } ) => {
						const disabled = ! availableColors.has( key );
						const active = selected === key;
						return (
							<button
								key={ key }
								type="button"
								disabled={ disabled }
								aria-pressed={ active }
								title={ label }
								className={ classnames( 'ob-color-opt', {
									active,
									disabled,
								} ) }
								onClick={ () => ! disabled && pick( key, onClose ) }
							>
								<span
									className="ob-color-dot"
									style={ { background: hex } }
								/>
								<span className="ob-color-label">{ label }</span>
							</button>
						);
					} ) }
					{ selected && (
						<button
							type="button"
							className="ob-color-any"
							onClick={ () => {
								setColors( [] );
								onClose();
							} }
						>
							{ __( 'Any color', 'templates-patterns-collection' ) }
						</button>
					) }
				</div>
			) }
		/>
	);
};

export default ColorButtons;
