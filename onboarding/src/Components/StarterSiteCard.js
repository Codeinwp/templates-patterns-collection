/* global tiobDash */
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { useEffect, useMemo, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { track } from '../utils/rest';

const hashColor = ( value = '' ) => {
	let hash = 0;
	for ( let index = 0; index < value.length; index++ ) {
		hash = value.charCodeAt( index ) + ( ( hash * 32 ) - hash );
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

const StarterSiteCard = ( {
	data,
	setSite,
	handleNextStep,
	trackingId,
	editor
} ) => {
	const {
		upsell,
		screenshot,
		title,
		category,
		query,
		site_description: siteDescription,
		description,
	} = data;
	const cardDescription = ( siteDescription || description || '' ).trim();
	const pageShots = useMemo( () => {
		if ( ! Array.isArray( data?.page_shots ) || ! data.page_shots.length ) {
			return screenshot
				? [
						{
							key: 'home',
							label: __( 'Home', 'templates-patterns-collection' ),
							screenshot,
						},
				  ]
				: [];
		}

		return data.page_shots
			.filter( ( shot ) => shot && shot.screenshot )
			.map( ( shot ) => ( {
				key: shot.key || shot.label || 'page',
				label: shot.label || shot.key || __( 'Page', 'templates-patterns-collection' ),
				screenshot: shot.screenshot,
			} ) );
	}, [ data?.page_shots, screenshot ] );
	const colorOptions = useMemo( () => {
		const colors = Array.isArray( data?.colors ) ? data.colors.filter( Boolean ) : [];
		const screenshotMap =
			data?.screenshots_by_color && typeof data.screenshots_by_color === 'object'
				? data.screenshots_by_color
				: {};

		return colors.map( ( color ) => ( {
			slug: color,
			label: color.replace( /[-_]/g, ' ' ),
			screenshot: screenshotMap[ color ] || screenshot,
		} ) );
	}, [ data?.colors, data?.screenshots_by_color, screenshot ] );
	const previewColors = colorOptions.slice( 0, 2 );
	const [ activePage, setActivePage ] = useState( pageShots[0]?.key || 'home' );
	const [ activeColor, setActiveColor ] = useState( colorOptions[0]?.slug || '' );
	const [ isColorExpanded, setIsColorExpanded ] = useState( false );

	useEffect( () => {
		setActivePage( pageShots[0]?.key || 'home' );
	}, [ pageShots ] );

	useEffect( () => {
		setActiveColor( colorOptions[0]?.slug || '' );
	}, [ colorOptions ] );

	const activePageShot =
		pageShots.find( ( shot ) => shot.key === activePage ) || pageShots[0] || null;
	const activeColorOption =
		colorOptions.find( ( option ) => option.slug === activeColor ) || colorOptions[0] || null;
	const activeScreenshot =
		activePage === 'home'
			? activeColorOption?.screenshot || activePageShot?.screenshot || screenshot
			: activePageShot?.screenshot || activeColorOption?.screenshot || screenshot;

	const launchPreview = () => {
		setSite( {
			...data,
			preview_screenshot: activeScreenshot,
			preview_color: activeColor,
			preview_page: activePage,
		} );
		handleNextStep();
		const trackData = {
			slug: 'neve',
			license_id: tiobDash.license,
			site: tiobDash.onboarding.homeUrl || '',
			step_id: 2,
			step_status: 'completed',
			selected_template: title,
			editor,
			search: query,
			cat: category,
		};
		track( trackingId, trackData ).catch( ( error ) => {
			// eslint-disable-next-line no-console
			console.error( error );
		} );
	};

	return (
		<div className="ss-card-wrap">
			<div
				className="ss-card"
				role="button"
				tabIndex={0}
				onClick={(e) => {
					e.preventDefault();
					launchPreview();
				}}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						launchPreview();
					}
				}}
			>
				{ upsell && (
					<span className="ss-badge">
						<span>
							{ __( 'PRO', 'templates-patterns-collection' ) }
						</span>
					</span>
				) }

				{ activeScreenshot && (
					<div
						className="ss-image"
						style={ {
							backgroundImage: `url("${ activeScreenshot }")`,
						} }
					>
						{ pageShots.length > 1 && (
							<div className="ss-page-shots">
								{ pageShots.map( ( shot ) => (
									<button
										type="button"
										key={ shot.key }
										className={
											shot.key === activePage
												? 'ss-page-shot is-active'
												: 'ss-page-shot'
										}
										onClick={ ( event ) => {
											event.preventDefault();
											event.stopPropagation();
											setActivePage( shot.key );
										} }
									>
										{ shot.label }
									</button>
								) ) }
							</div>
						) }
						{ colorOptions.length > 0 && (
							<div
								className={
									isColorExpanded
										? 'ss-color-summary is-expanded'
										: 'ss-color-summary'
								}
								onMouseEnter={ () => setIsColorExpanded( true ) }
								onMouseLeave={ () => setIsColorExpanded( false ) }
								onFocus={ () => setIsColorExpanded( true ) }
								onBlur={ ( event ) => {
									if ( ! event.currentTarget.contains( event.relatedTarget ) ) {
										setIsColorExpanded( false );
									}
								} }
							>
								{ ! isColorExpanded ? (
									<div className="ss-color-summary__collapsed">
										<div className="ss-color-summary__swatches">
											{ previewColors.map( ( option ) => (
												<span
													key={ option.slug }
													className="ss-color-dot"
													style={ {
														background: swatchBackground( option.slug ),
													} }
													aria-hidden="true"
													title={ option.label }
												/>
											) ) }
										</div>
										{ colorOptions.length > 2 && (
											<span className="ss-color-summary__count">
												+{ colorOptions.length - 2 }
											</span>
										) }
									</div>
								) : (
									<div className="ss-color-summary__expanded">
										{ colorOptions.map( ( option ) => (
											<button
												type="button"
												key={ option.slug }
												className={
													option.slug === activeColor
														? 'ss-color-swatch is-active'
														: 'ss-color-swatch'
												}
												onClick={ ( event ) => {
													event.preventDefault();
													event.stopPropagation();
													setActiveColor( option.slug );
												} }
												aria-label={ sprintf(
													/* translators: %s is a color label. */
													__(
														'Preview %s color',
														'templates-patterns-collection'
													),
													option.label
												) }
												title={ option.label }
											>
												<span
													className="ss-color-dot"
													style={ {
														background: swatchBackground( option.slug ),
													} }
													aria-hidden="true"
												/>
											</button>
										) ) }
									</div>
								) }
							</div>
						) }
					</div>
				) }
			</div>
			<div className="ss-copy">
				<p className="ss-title">{ title }</p>
				{ cardDescription && (
					<p className="ss-description">{ cardDescription }</p>
				) }
			</div>
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const {
			getTrackingId,
			getCurrentEditor,
			getCurrentCategory,
			getSearchQuery,
		} = select( 'ti-onboarding' );
		return {
			trackingId: getTrackingId(),
			editor: getCurrentEditor(),
			category: getCurrentCategory(),
			query: getSearchQuery(),
		};
	} ),
	withDispatch( ( dispatch, { data } ) => {
		const { setCurrentSite, setOnboardingStep } =
			dispatch( 'ti-onboarding' );
		return {
			setSite: ( nextSite = data ) => setCurrentSite( nextSite ),
			handleNextStep: () => setOnboardingStep( 3 ),
		};
	} )
)( StarterSiteCard );
