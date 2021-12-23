import { Button } from '@wordpress/components';

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
						{ cta }
					</Button>
				) }
			</div>
		);
	};

	return <UpsellNotification />;
};

export default Notification;
