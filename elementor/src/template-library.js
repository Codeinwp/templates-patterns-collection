import { Fragment } from '@wordpress/element';
import Header from './components/header.js';
import Content from './components/content.js';

const TemplateLibrary = () => {
	return (
		<Fragment>
			<Header />
			<Content />
		</Fragment>
	);
};

export default TemplateLibrary;
