/* global elementor, $e, elementorCommon */
import { Fragment } from '@wordpress/element';
import { withDispatch } from '@wordpress/data';

import Header from './components/header.js';
import Content from './components/content.js';
import { importTemplate } from './data/templates-cloud/index.js';

const TemplateLibrary = ( { setFetching } ) => {
	const onImport = async ( { id, title } ) => {
		setFetching( true );
		const data = await importTemplate( id );

		if ( ! data ) {
			return setFetching( false );
		}

		const history = $e.internal( 'document/history/start-log', {
			type: 'add',
			title: `${ window.tiTpc.library.historyMessage } ${ title }`,
		} );

		let index = Number( window.tiTpc.placeholder );

		const content = data.content;

		for ( let i = 0; i < content.length; i++ ) {
			content[ i ].id = elementorCommon.helpers.getUniqueId();
			$e.run( 'document/elements/create', {
				container: elementor.getPreviewContainer(),
				model: content[ i ],
				options: index >= 0 ? { at: index++ } : {},
			} );
		}

		$e.internal( 'document/history/end-log', {
			id: history,
		} );

		window.tiTpcModal.hide();

		setFetching( false );
	};

	return (
		<Fragment>
			<Header onImport={ onImport } />
			<Content onImport={ onImport } />
		</Fragment>
	);
};

export default withDispatch( ( dispatch ) => {
	const { setFetching } = dispatch( 'tpc/elementor' );

	return {
		setFetching,
	};
} )( TemplateLibrary );
