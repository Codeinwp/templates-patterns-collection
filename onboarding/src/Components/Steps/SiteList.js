/* global tiobDash */
import { __ } from '@wordpress/i18n';
import {
	createInterpolateElement,
	useEffect,
	useState,
} from '@wordpress/element';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import Toast from '../Toast';
import Filters from '../Filters';
import Sites from '../Sites';
import EditorSelector from '../EditorSelector';
import OnboardingPromoNotice from '../OnboardingPromoNotice';
import SVG from '../../utils/svg';
import { get, track } from '../../utils/rest';
import { countStrongMatches, matchesCategory, SEARCH_USE_FUSE } from '../../utils/search';

const { onboarding } = tiobDash;

// Module-scoped so it survives SiteList unmount/remount (step 2 ⇄ 3): guards the
// tracking-session init against firing twice while the first request is in flight.
let trackingInitStarted = false;

const SiteList = ( {
	showToast,
	setShowToast,
	editor,
	searchQuery,
	category,
	trackingId,
	setTrackingId,
	setRankedOrder,
	setSearchOrder,
	sitesData,
} ) => {
	const [ personalizing, setPersonalizing ] = useState( false );
	const [ searching, setSearching ] = useState( false );
	const toastMessage = createInterpolateElement(
		__(
			'Unlock Access to all premium templates with Neve Business plan. <a></a>.',
			'templates-patterns-collection'
		),
		{
			a: (
				<a
					href={ tiobDash.onboardingUpsell.upgradeToast }
					target="_blank"
					rel="external noreferrer noopener"
				>
					{ __( 'Get Started', 'templates-patterns-collection' ) }
				</a>
			),
		}
	);

	const handleShowToast = () => {
		if ( showToast === 'dismissed' ) {
			return;
		}

		// Automatically hide the toast after a certain duration (e.g., 5 seconds)
		setTimeout( () => {
			setShowToast( true );
		}, 1000 );
	};

	// Initialise the tracking session on first load — this used to happen on the
	// (now-removed) Welcome step, so impression/preview/import events stay attributed.
	useEffect( () => {
		handleShowToast();
		if ( trackingId || trackingInitStarted ) {
			return;
		}
		trackingInitStarted = true;
		track( '', {
			slug: 'neve',
			license_id: tiobDash.license,
			site: tiobDash.onboarding.homeUrl || '',
		} )
			.then( ( id ) => {
				if ( id ) {
					setTrackingId( id );
				}
			} )
			.catch( () => {
				// Let a genuinely failed init retry on a later mount.
				trackingInitStarted = false;
			} );
	}, [] );

	// Fetch the AI-personalized order for the active builder and apply it to the
	// grid. Fail-open: any error leaves the curated (sheet) order untouched.
	useEffect( () => {
		if ( ! editor || ! onboarding || ! onboarding.root ) {
			return undefined;
		}
		let active = true;
		let safety;
		// Avoid a loader flash when the order is already cached (resolves in a few
		// ms): only reveal it once the request has been pending more than 300ms.
		const reveal = setTimeout(
			() => active && setPersonalizing( true ),
			300
		);
		const done = () => {
			if ( active ) {
				clearTimeout( reveal );
				clearTimeout( safety );
				setPersonalizing( false );
			}
		};
		// Safety net: if the request hangs (stalled connection — no response and no
		// error), resolve the loader anyway so the pill can't spin forever.
		safety = setTimeout( done, 9000 );
		get(
			onboarding.root +
				'/starter_order?builder=' +
				encodeURIComponent( editor )
		)
			.then( ( res ) => {
				if (
					active &&
					res &&
					Array.isArray( res.order ) &&
					res.order.length
				) {
					setRankedOrder( editor, res.order );
				}
				done();
			} )
			.catch( done );
		return () => {
			active = false;
			clearTimeout( reveal );
			clearTimeout( safety );
			setPersonalizing( false );
		};
	}, [ editor ] );

	// LLM semantic search (debounced) for natural-language / intent queries,
	// layered over the instant client-side Fuse search. Fail-open: errors or
	// short queries leave only the Fuse results.
	useEffect( () => {
		if ( ! editor || ! onboarding || ! onboarding.root ) {
			return undefined;
		}
		// Clear any prior matches immediately so a stale boost never shows after an
		// editor/query change (searchOrder is global); the fetch below repopulates it.
		setSearchOrder( [] );
		const q = ( searchQuery || '' ).trim();
		if ( q.length < 3 ) {
			setSearching( false );
			return undefined;
		}
		let active = true;
		let safety;
		const done = () => {
			if ( active ) {
				clearTimeout( safety );
				setSearching( false );
			}
		};
		const timer = setTimeout( () => {
			if ( ! active ) {
				return;
			}
			// Fuse-first: only call the (slower, paid) LLM to "personalize the rest"
			// when Fuse doesn't already cover the query with >= 9 strongly-relevant
			// (is-a) matches IN THE ACTIVE CATEGORY — matching what the user sees.
			const builderItems = Object.values(
				( sitesData && sitesData.sites && sitesData.sites[ editor ] ) ||
					{}
			).filter( ( site ) => matchesCategory( site, category ) );
			if ( SEARCH_USE_FUSE && countStrongMatches( builderItems, q ) >= 9 ) {
				// Fuse already covers it — clear any lingering loader and skip the LLM.
				setSearching( false );
				return;
			}
			setSearching( true );
			// Safety net for a hung request (see the order effect).
			safety = setTimeout( done, 9000 );
			get(
				onboarding.root +
					'/starter_search?builder=' +
					encodeURIComponent( editor ) +
					'&q=' +
					encodeURIComponent( q )
			)
				.then( ( res ) => {
					if ( active && res && Array.isArray( res.order ) ) {
						setSearchOrder( res.order );
					}
					done();
				} )
				.catch( done );
		}, 600 );
		// NB: cleanup does NOT clear `searching` — doing so would blink the pill off
		// for 600ms on every keystroke while a search is in flight. The next fetch's
		// done(), the <3-char early return, or the safety net resolve it instead.
		return () => {
			active = false;
			clearTimeout( timer );
			clearTimeout( safety );
		};
	}, [ searchQuery, editor, category ] );

	return (
		<div className="ob-container">
			<div className="ob-container-inner">
				<div className="ob-title-wrap">
					<h1>
						{ __(
							'Choose a design',
							'templates-patterns-collection'
						) }
					</h1>
					<EditorSelector />
				</div>
				<Filters />
				<OnboardingPromoNotice />
				{ ( personalizing || searching ) && (
					<div
						className="ob-ranking-loader"
						role="status"
						aria-live="polite"
					>
						<span className="ob-ranking-loader__dots">
							<span />
							<span />
							<span />
						</span>
						<span className="ob-ranking-loader__text">
							{ searching ||
							( searchQuery || '' ).trim().length >= 3
								? __(
										'Showing your matches — personalizing the rest in real time…',
										'templates-patterns-collection'
								  )
								: __(
										'Personalizing your starter sites…',
										'templates-patterns-collection'
								  ) }
						</span>
					</div>
				) }
				<Sites />
				{ ! tiobDash.isValidLicense && (
					<Toast
						setShowToast={ setShowToast }
						svgIcon={ SVG.logo }
						className={ showToast === true ? 'show' : '' }
						message={ toastMessage }
					/>
				) }
			</div>
		</div>
	);
};

export default compose(
	withSelect( ( select ) => ( {
		editor: select( 'ti-onboarding' ).getCurrentEditor(),
		searchQuery: select( 'ti-onboarding' ).getSearchQuery(),
		category: select( 'ti-onboarding' ).getCurrentCategory(),
		trackingId: select( 'ti-onboarding' ).getTrackingId(),
		sitesData: select( 'ti-onboarding' ).getSites(),
	} ) ),
	withDispatch( ( dispatch ) => {
		const { setTrackingId, setRankedOrder, setSearchOrder } =
			dispatch( 'ti-onboarding' );
		return {
			setTrackingId,
			setRankedOrder,
			setSearchOrder,
		};
	} )
)( SiteList );
