/* global tiobDash */
import { Button, Dashicon } from '@wordpress/components';

const Notification = ( { editor, data } ) => {
	const { text, cta, url } = data;

	const UpsellNotification = () => {
		return (
			<div className="notification">
				<p>{ text }</p>
				{ url && cta && (
					<Button
						target="_blank"
						isSecondary
						href={ url
							.replace( '<builder_name>', editor )
							.replace( ' ', '' ) }
					>
						{ cta } <Dashicon icon="external" />
					</Button>
				) }
			</div>
		);
	};

	return <UpsellNotification />;
};

export default Notification;
