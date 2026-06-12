/* global tiobDash */
import { __ } from '@wordpress/i18n';
import {
	createInterpolateElement,
	useEffect,
	useState,
} from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import Toast from '../Toast';
import Filters from '../Filters';
import Sites from '../Sites';
import EditorSelector from '../EditorSelector';
import OnboardingPromoNotice from '../OnboardingPromoNotice';
import SVG from '../../utils/svg';
import { get, track } from '../../utils/rest';

const { onboarding } = tiobDash;

// Guards tracking-session init against firing twice while the first request is in flight.
let trackingInitStarted = false;

const SiteList = ( {
	showToast,
	setShowToast,
	editor,
	searchQuery,
	trackingId,
	setTrackingId,
	setRankedOrder,
	setSearchOrder,
	setSearchFailed,
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

	useEffect( () => {
		if ( showToast === 'dismissed' ) {
			return;
		}

		const timeoutId = setTimeout( () => {
			setShowToast( true );
		}, 1000 );

		if ( trackingId || trackingInitStarted ) {
			return () => clearTimeout( timeoutId );
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
				trackingInitStarted = false;
			} );

		return () => clearTimeout( timeoutId );
	}, [ showToast, trackingId, setShowToast, setTrackingId ] );

	useEffect( () => {
		if ( ! editor || ! onboarding?.root ) {
			return undefined;
		}

		let active = true;
		let safety;
		const reveal = setTimeout( () => {
			if ( active ) {
				setPersonalizing( true );
			}
		}, 300 );
		const done = () => {
			if ( active ) {
				clearTimeout( reveal );
				clearTimeout( safety );
				setPersonalizing( false );
			}
		};

		safety = setTimeout( done, 9000 );
		get(
			onboarding.root +
				'/starter_order?builder=' +
				encodeURIComponent( editor )
		)
			.then( ( res ) => {
				if ( active && res && Array.isArray( res.order ) && res.order.length ) {
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
	}, [ editor, setRankedOrder ] );

	useEffect( () => {
		if ( ! editor || ! onboarding?.root ) {
			return undefined;
		}

		setSearchOrder( [] );
		setSearchFailed( false );

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
		const fail = () => {
			if ( active ) {
				setSearchFailed( true );
			}
			done();
		};

		const timer = setTimeout( () => {
			if ( ! active ) {
				return;
			}

			setSearching( true );
			safety = setTimeout( fail, 9000 );
			get(
				onboarding.root +
					'/starter_search?builder=' +
					encodeURIComponent( editor ) +
					'&q=' +
					encodeURIComponent( q )
			)
				.then( ( res ) => {
					if ( ! active ) {
						return;
					}

					if ( res && Array.isArray( res.order ) && res.order.length ) {
						setSearchOrder( res.order );
						done();
						return;
					}

					fail();
				} )
				.catch( fail );
		}, 600 );

		return () => {
			active = false;
			clearTimeout( timer );
			clearTimeout( safety );
		};
	}, [ searchQuery, editor, setSearchFailed, setSearchOrder ] );

	return (
		<div className="ob-container">
			<div className="ob-container-inner">
				<div className="ob-title-wrap">
					<h1>
						{ __( 'Choose a design', 'templates-patterns-collection' ) }
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
							{ searching || ( searchQuery || '' ).trim().length >= 3
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
		trackingId: select( 'ti-onboarding' ).getTrackingId(),
	} ) ),
	withDispatch( ( dispatch ) => {
		const {
			setTrackingId,
			setRankedOrder,
			setSearchOrder,
			setSearchFailed,
		} = dispatch( 'ti-onboarding' );

		return {
			setTrackingId,
			setRankedOrder,
			setSearchOrder,
			setSearchFailed,
		};
	} )
)( SiteList );
