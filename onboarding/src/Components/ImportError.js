/* global tiobDash */
import { Dashicon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const ImportError = ( { message, code } ) => {
	return (
		<div className="ob-error-wrap">
			{ message && (
				<h2>
					<Dashicon icon="warning" />
					<span>{ message }</span>
				</h2>
			) }
			<ul>
				<li
					dangerouslySetInnerHTML={ {
						__html: tiobDash.onboarding.i18n.troubleshooting,
					} }
				/>
				<li
					dangerouslySetInnerHTML={ {
						__html: tiobDash.onboarding.i18n.support,
					} }
				/>
				{ code && (
					<li>
						{ __( 'Error code', 'templates-patterns-collection' ) }:{ ' ' }
						<code>{ code }</code>
					</li>
				) }
				<li>
					{ __( 'Error log', 'templates-patterns-collection' ) }:{ ' ' }
					<a href={ tiobDash.onboarding.logUrl }>
						{ tiobDash.onboarding.logUrl }
						<Dashicon icon="external" />
					</a>
				</li>
			</ul>
		</div>
	);
};

export default ImportError;
