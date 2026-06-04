/* global tiobDash */
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import { track } from '../utils/rest';
import { colorScreenshot } from '../utils/search';
import { ONBOARDING_COLORS } from '../utils/common';

// ONBOARDING_COLORS is an array of {key,label,hex}; reduce to a key lookup once.
const COLOR_MAP = ONBOARDING_COLORS.reduce( ( map, c ) => {
	map[ c.key ] = c;
	return map;
}, {} );

const MAX_DOTS = 6;
const preloaded = new Set(); // de-dupe variant/page preloads across all cards

const preloadUrl = ( url ) => {
	if ( url && ! preloaded.has( url ) ) {
		preloaded.add( url );
		const img = new window.Image();
		img.src = url;
	}
};

const StarterSiteCard = ( {
	data,
	setSite,
	handleNextStep,
	trackingId,
	editor,
	selectedColors,
} ) => {
	const { upsell, title, category, query } = data;

	// Card-local hover state (never mutates other cards / the store).
	const [ previewColor, setPreviewColor ] = useState( null );
	// Inner-page hover-peek index (0 = home / default).
	const [ peekIdx, setPeekIdx ] = useState( 0 );
	// Keep per-card color preview in sync with the global Color filter.
	useEffect( () => {
		setPreviewColor( null );
	}, [ selectedColors ] );

	// Color families the site ships (drives the count badge + hover dots).
	const families = Array.isArray( data.colors )
		? data.colors.filter( ( k ) => COLOR_MAP[ k ] )
		: [];
	const hasVariants = families.length > 1;
	const activeFamily = previewColor || families[ 0 ];

	// Inner-page peek — only sites with captured page_shots.
	const pageShots = Array.isArray( data.page_shots ) ? data.page_shots : [];
	const hasPeek = pageShots.length > 1;

	// Image precedence: peeking an inner page wins; else the color preview/global filter.
	const screenshot =
		hasPeek && peekIdx > 0
			? pageShots[ peekIdx ].screenshot
			: colorScreenshot(
					data,
					previewColor ? [ previewColor ] : selectedColors
			  );

	const launchPreview = () => {
		setSite();
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
				tabIndex={ 0 }
				onClick={ ( e ) => {
					// A tap on a color dot / page pip must never trigger import.
					if ( e.target.closest( '.ss-dots, .ss-peek' ) ) {
						return;
					}
					e.preventDefault();
					launchPreview();
				} }
				onMouseLeave={ () => hasPeek && setPeekIdx( 0 ) }
				onKeyDown={ ( e ) => {
					if ( e.key === 'Enter' || e.key === ' ' ) {
						e.preventDefault();
						launchPreview();
					}
				} }
			>
				{ upsell && (
					<span className="ss-badge">
						<span>
							{ __( 'PRO', 'templates-patterns-collection' ) }
						</span>
					</span>
				) }

				{ screenshot && (
					<div
						className="ss-image"
						style={ {
							backgroundImage: `url("${ screenshot }")`,
						} }
					/>
				) }

				{ /* Inner-page hover-peek: small dots reveal on hover; hovering one swaps the thumbnail. */ }
				{ hasPeek && peekIdx > 0 && (
					<span className="ss-peek-label" aria-hidden="true">
						{ pageShots[ peekIdx ].label }
					</span>
				) }

				{ hasPeek && (
					<div
						className="ss-peek"
						role="presentation"
						aria-hidden="true"
						onMouseLeave={ () => setPeekIdx( 0 ) }
					>
						{ pageShots.map( ( pg, i ) => (
							<button
								key={ pg.key || i }
								type="button"
								tabIndex={ -1 }
								aria-hidden="true"
								title={ pg.label }
								className={ classnames( 'ss-pip', {
									'is-active': i === peekIdx,
								} ) }
								onMouseEnter={ () => {
									setPeekIdx( i );
									if ( pg.screenshot ) {
										preloadUrl( pg.screenshot );
									}
								} }
							/>
						) ) }
					</div>
				) }

				{ /* Color badge: count pill at rest; dots reveal on hover and recolor the card. */ }
				{ hasVariants && (
					<span className="ss-count-badge" aria-hidden="true">
						{ families.slice( 0, 3 ).map( ( k ) => (
							<i
								key={ k }
								className="ss-cdot"
								style={ { background: COLOR_MAP[ k ].hex } }
							/>
						) ) }
						{ families.length > 3 && (
							<em>+{ families.length - 3 }</em>
						) }
					</span>
				) }

				{ hasVariants && (
					<div
						className="ss-dots"
						role="presentation"
						aria-hidden="true"
						onMouseLeave={ () => setPreviewColor( null ) }
					>
						{ families.slice( 0, MAX_DOTS ).map( ( k ) => (
							<button
								key={ k }
								type="button"
								tabIndex={ -1 }
								aria-hidden="true"
								title={ COLOR_MAP[ k ].label }
								className={ classnames( 'ss-dot', {
									'is-active': activeFamily === k,
								} ) }
								style={ { background: COLOR_MAP[ k ].hex } }
								onMouseEnter={ () => {
									setPreviewColor( k );
									preloadUrl( colorScreenshot( data, [ k ] ) );
								} }
								onClick={ ( e ) => {
									e.stopPropagation();
									e.preventDefault();
									setPreviewColor( k );
								} }
							/>
						) ) }
						{ families.length > MAX_DOTS && (
							<span className="ss-dots__more">
								+{ families.length - MAX_DOTS }
							</span>
						) }
					</div>
				) }
			</div>
			<p className="ss-title">{ title }</p>
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
			getSelectedColors,
		} = select( 'ti-onboarding' );
		return {
			trackingId: getTrackingId(),
			editor: getCurrentEditor(),
			category: getCurrentCategory(),
			query: getSearchQuery(),
			selectedColors: getSelectedColors(),
		};
	} ),
	withDispatch( ( dispatch, { data } ) => {
		const { setCurrentSite, setOnboardingStep } =
			dispatch( 'ti-onboarding' );
		return {
			setSite: () => setCurrentSite( data ),
			handleNextStep: () => setOnboardingStep( 3 ),
		};
	} )
)( StarterSiteCard );
