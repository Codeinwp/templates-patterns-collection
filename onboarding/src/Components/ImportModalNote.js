import classnames from 'classnames';

import { Dashicon, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const ImportModalNote = ( { data, externalInstalled } ) => {
	const external = data.external_plugins || null;
	const classes = classnames( [ 'well' ] );
	return external && ! externalInstalled ? (
		<div className={ classes }>
			<span>
				<Dashicon icon="info" />
				{ __(
					'To import this demo you have to install the following plugins',
					'templates-patterns-collection'
				) }
			</span>
			<ul>

				{ external.map( ( plugin, index ) => (
					<li key={ index }>
						<Button isLink href={ plugin.author_url }>
							{ plugin.name }
						</Button>
					</li>
				) ) }
			</ul>
		</div>
	) : (
		''
	);
};

export default ImportModalNote;
