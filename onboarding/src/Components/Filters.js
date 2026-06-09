import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import Search from './Search';
import CategoryButtons from './CategoryButtons';
import { ONBOARDING_CAT } from '../utils/common';

const hashColor = ( value = '' ) => {
	let hash = 0;
	for ( let index = 0; index < value.length; index++ ) {
		hash = value.charCodeAt( index ) + ( ( hash << 5 ) - hash );
	}

	return Math.abs( hash );
};

const swatchBackground = ( colorSlug = '' ) => {
	const normalized = String( colorSlug ).trim().toLowerCase();
	if ( ! normalized ) {
		return 'linear-gradient(135deg, #cbd5e1 0%, #64748b 100%)';
	}

	if (
		/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test( normalized ) ||
		/^(rgb|rgba|hsl|hsla)\(/i.test( normalized )
	) {
		return normalized;
	}

	if (
		typeof window !== 'undefined' &&
		window.CSS &&
		typeof window.CSS.supports === 'function' &&
		window.CSS.supports( 'color', normalized )
	) {
		return normalized;
	}

	const hue = hashColor( normalized ) % 360;
	const hueShift = ( hue + 24 ) % 360;

	return `linear-gradient(135deg, hsl(${ hue } 72% 72%) 0%, hsl(${ hueShift } 72% 44%) 100%)`;
};

const Filters = () => {
	const [ isColorOpen, setIsColorOpen ] = useState( false );
	const colorFilterRef = useRef( null );
	const { sortBy, searchQuery, editor, sites, selectedColors } = useSelect( ( select ) => ( {
		sortBy: select( 'ti-onboarding' ).getSortBy(),
		searchQuery: select( 'ti-onboarding' ).getSearchQuery(),
		editor: select( 'ti-onboarding' ).getCurrentEditor(),
		sites: select( 'ti-onboarding' ).getSites(),
		selectedColors: select( 'ti-onboarding' ).getSelectedColors(),
	} ) );
	const { setSortBy, setSelectedColors } = useDispatch( 'ti-onboarding' );

	const categories = {
		all: __( 'All', 'templates-patterns-collection' ),
		free: __( 'Free', 'templates-patterns-collection' ),
		...ONBOARDING_CAT,
	};

	const trimmed = ( searchQuery || '' ).trim();
	const showHint =
		trimmed.length > 0 && trimmed.length <= 12 && ! trimmed.includes( ' ' );
	const availableColors = useMemo( () => {
		const builderSites = Object.values( sites?.sites?.[ editor ] || {} );
		const seen = new Set();
		const colors = [];

		builderSites.forEach( ( site ) => {
			if ( ! Array.isArray( site?.colors ) ) {
				return;
			}

			site.colors.forEach( ( color ) => {
				const normalized = String( color || '' ).trim().toLowerCase();
				if ( ! normalized || seen.has( normalized ) ) {
					return;
				}

				seen.add( normalized );
				colors.push( normalized );
			} );
		} );

		return colors;
	}, [ sites, editor ] );
	const sortOptions = [
		{
			label: __( 'Recommended', 'templates-patterns-collection' ),
			value: 'recommended',
		},
		{
			label: __( 'Popular', 'templates-patterns-collection' ),
			value: 'popular',
		},
		...( editor === 'gutenberg'
			? [
					{
						label: __( 'New first', 'templates-patterns-collection' ),
						value: 'new',
					},
			  ]
			: [] ),
	];

	useEffect( () => {
		if ( ! isColorOpen ) {
			return undefined;
		}

		const handleOutsideClick = ( event ) => {
			if ( colorFilterRef.current?.contains( event.target ) ) {
				return;
			}

			setIsColorOpen( false );
		};

		document.addEventListener( 'mousedown', handleOutsideClick );

		return () => {
			document.removeEventListener( 'mousedown', handleOutsideClick );
		};
	}, [ isColorOpen ] );

	return (
		<div className="ob-filters">
			<div className="ob-search-row">
				<Search
					placeholder={ __(
						'Describe your site — e.g. "law firm for personal injury cases"',
						'templates-patterns-collection'
					) }
				/>
				{ showHint && (
					<p className="ob-search-hint">
						{ __(
							'Add a detail or two for sharper matches — try what you do, who it\'s for, or where.',
							'templates-patterns-collection'
						) }
					</p>
				) }
			</div>
			<div className="ob-filters-bar">
				<CategoryButtons categories={ categories } />
				{ availableColors.length > 0 && (
					<div
						ref={ colorFilterRef }
						className={
							isColorOpen ? 'ob-color-filter is-open' : 'ob-color-filter'
						}
					>
						<button
							type="button"
							className={
								selectedColors.length
									? 'ob-color-filter__trigger has-selection'
									: 'ob-color-filter__trigger'
							}
							aria-expanded={ isColorOpen }
							onClick={ () => setIsColorOpen( ( open ) => ! open ) }
						>
							<span className="ob-color-filter__wheel" aria-hidden="true" />
							<span className="ob-color-filter__label">
								{ selectedColors.length
									? `${ selectedColors.length } ${ __(
											'selected',
											'templates-patterns-collection'
									  ) }`
									: __( 'Color', 'templates-patterns-collection' ) }
							</span>
							<span className="ob-color-filter__chevron" aria-hidden="true">
								▾
							</span>
						</button>
						<div className="ob-color-filter__panel">
							{ availableColors.map( ( color ) => (
								<button
									type="button"
									key={ color }
									className={
										selectedColors.includes( color )
											? 'ob-color-filter__option is-active'
											: 'ob-color-filter__option'
									}
									onClick={ () => {
										setSelectedColors(
											selectedColors.includes( color )
												? selectedColors.filter( ( item ) => item !== color )
												: [ ...selectedColors, color ]
										);
									} }
								>
									<span
										className="ob-color-filter__swatch"
										style={ {
											background: swatchBackground( color ),
										} }
									/>
									<span className="ob-color-filter__name">{ color }</span>
								</button>
							) ) }
							{ selectedColors.length > 0 && (
								<button
									type="button"
									className="ob-color-filter__clear"
									onClick={ () => {
										setSelectedColors( [] );
										setIsColorOpen( false );
									} }
								>
									{ __( 'Clear', 'templates-patterns-collection' ) }
								</button>
							) }
						</div>
					</div>
				) }
				<SelectControl
					className="ob-sort-select"
					label={ __( 'Sort', 'templates-patterns-collection' ) }
					hideLabelFromVision
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					value={ searchQuery ? 'recommended' : sortBy }
					options={ sortOptions }
					onChange={ setSortBy }
					disabled={ !! searchQuery }
				/>
			</div>
		</div>
	);
};

export default Filters;
