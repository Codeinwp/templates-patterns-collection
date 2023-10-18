/* global tiobDash */
import { Dashicon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { getLogsFromServer } from '../utils/rest';
import { textToFileURL } from '../utils/common';

const ImportError = ( { message, code } ) => {
	const [ logs, setLogs ] = useState( {} );

	useEffect( () => {
		getLogsFromServer( {
			success( response ) {
				setLogs( {
					raw: response,
					url: textToFileURL( response ),
				} );
			},
		} );

		return () => {
			if ( logs?.url ) {
				URL.revokeObjectURL( logs.url );
			}
		};
	}, [] );

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
					<a download={ 'ti_theme_onboarding.log' } href={ logs.url }>
						{ __(
							'Download Logs File',
							'templates-patterns-collection'
						) }
					</a>
					<details>
						<summary>
							{ __(
								'See logs',
								'templates-patterns-collection'
							) }
						</summary>
						<div>{ logs.raw }</div>
					</details>
				</li>
			</ul>
		</div>
	);
};

export default ImportError;
