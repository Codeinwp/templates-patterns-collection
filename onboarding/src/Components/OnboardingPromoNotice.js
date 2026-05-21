/* global tiobDash */
import { __, sprintf } from '@wordpress/i18n';
import { createInterpolateElement, useState } from '@wordpress/element';
import { ajaxAction } from '../utils/rest';

const OnboardingPromoNotice = () => {
	const shouldShowNotice = Boolean( tiobDash.onboardingPromoNotice?.show );
	const showProMessage = Boolean( tiobDash.onboardingShowProNoticeText );

	const emailBody = sprintf(
		/* translators: %s: double line break in the starter site request email template */
		__(
			'Hi Neve team,%1$sI\'m looking for a starter site for the following project:%1$sProject type: (e.g. Restaurant, Law Firm, SaaS)%1$sKey pages needed: (e.g. Home, About, Services, Contact)%1$sStyle preference: (e.g. Minimal, Bold, Corporate)%1$sAny references: (optional)%1$sThanks',
			'templates-patterns-collection'
		),
		'\n\n'
	);

	const requestSiteLink =
		'mailto:contact@themeisle.com?subject=' +
		encodeURIComponent(
			__( 'Starter Site Request', 'templates-patterns-collection' )
		) +
		'&body=' +
		encodeURIComponent( emailBody );

	const noticeMessage = showProMessage
		? createInterpolateElement(
				__(
					'Fresh designs built for every niche. Can\'t find what you\'re looking for? As a Pro user, <requestSiteLink>request a site</requestSiteLink> and we\'ll build it for you.',
					'templates-patterns-collection'
				),
				{
					requestSiteLink: (
						/* eslint-disable-next-line jsx-a11y/anchor-has-content */
						<a
							href={ requestSiteLink }
							className="ob-onboarding-promo-link"
						/>
					),
				}
		  )
		: __(
				'From free to pro, fresh designs built for every niche. More coming soon.',
				'templates-patterns-collection'
		  );

	const [ isVisible, setIsVisible ] = useState( shouldShowNotice );

	if ( ! isVisible ) {
		return null;
	}

	const dismissNotice = () => {
		setIsVisible( false );
		ajaxAction(
			tiobDash.onboardingPromoNotice.ajaxURL,
			'dismiss_onboarding_promo_notice',
			tiobDash.onboardingPromoNotice.nonce
		).catch( () => null );
	};

	return (
		<div className="ob-onboarding-promo" role="status">
			<div className="ob-onboarding-promo-badge">
				{ __( 'New', 'templates-patterns-collection' ) }
			</div>
			<div className="ob-onboarding-promo-content">
				<h3>
					{ sprintf(
						/* translators: %s: number of new starter sites */
						__(
							'%s new starter sites, just landed.',
							'templates-patterns-collection'
						),
						'80+'
					) }
				</h3>
				<p>{ noticeMessage }</p>
			</div>
			<button
				type="button"
				className="ob-onboarding-promo-close"
				onClick={ dismissNotice }
				aria-label={ __(
					'Dismiss notice',
					'templates-patterns-collection'
				) }
			>
				×
			</button>
		</div>
	);
};

export default OnboardingPromoNotice;
