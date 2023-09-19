import { Icon } from '@wordpress/components';

const DocNotice = ( { data } ) => {
	const { text, url } = data;

	if ( ! text ) {
		return null;
	}

	return (
		<div className="doc-notice">
			{ url ? (
				<a
					href={ url }
					target="_blank"
					rel="external noreferrer noopener"
				>
					<Icon icon="external" /> { text }
				</a>
			) : (
				<p>{ text }</p>
			) }
		</div>
	);
};

export default DocNotice;
