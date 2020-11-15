import classnames from 'classnames';

import { Fragment } from '@wordpress/element';
import { Dashicon, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const ImportModalNote = ( { data, externalInstalled } ) => {
	const external = data.external_plugins || null;
	const classes = classnames( [ 'well' ] );
	return (
		<div className={ classes }>
			{ external && ! externalInstalled && (
				<h3 style={ { marginTop: 15 } }>
					<Dashicon icon="info" />
					<span>
						{ __(
							'To import this demo you have to install the following plugins',
							'neve'
						) }
					</span>
				</h3>
			) }
			<ul>
				{ external && ! externalInstalled ? (
					external.map( ( plugin, index ) => (
						<li key={ index }>
							<Button isLink href={ plugin.author_url }>
								{ plugin.name }
							</Button>
						</li>
					) )
				) : (
					<Fragment>
						<li>
							{ __(
								'We recommend you backup your website content before attempting a full site import.',
								'neve'
							) }
						</li>
						<li>
							{ __(
								'Some of the demo images will not be imported and will be replaced by placeholder images.',
								'neve'
							) }
						</li>
					</Fragment>
				) }
			</ul>
		</div>
	);
};

export default ImportModalNote;
