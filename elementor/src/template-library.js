/* global elementor, $e, elementorCommon */
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Fragment, useState } from '@wordpress/element';

import Header from './components/header.js';
import Content from './components/content.js';
import { importTemplate } from './data/templates-cloud/index.js';

const TemplateLibrary = ( { currentTab, setFetching } ) => {
	const [ searchQuery, setSearchQuery ] = useState( {
		templates: '',
		library: '',
	} );

	const [ sortingOrder, setSortingOrder ] = useState( {
		templates: {
			order: 'DESC',
			orderby: 'date',
		},
		library: {
			order: 'DESC',
			orderby: 'date',
		},
	} );

	const [ isSearch, setSearch ] = useState( {
		templates: false,
		library: false,
	} );

	const isGeneral = currentTab === 'templates';

	const setQuery = ( query ) => {
		if ( isGeneral ) {
			return setSearchQuery( {
				...searchQuery,
				templates: query,
			} );
		}

		return setSearchQuery( {
			...searchQuery,
			library: query,
		} );
	};

	const getSearchQuery = () => {
		if ( isGeneral ) {
			return searchQuery.templates;
		}

		return searchQuery.library;
	};

	const setSorting = ( order ) => {
		if ( isGeneral ) {
			return setSortingOrder( {
				...sortingOrder,
				templates: order,
			} );
		}

		return setSortingOrder( {
			...sortingOrder,
			library: order,
		} );
	};

	const getOrder = () => {
		if ( isGeneral ) {
			return sortingOrder.templates;
		}

		return sortingOrder.library;
	};

	const setSearchStatus = ( status ) => {
		if ( isGeneral ) {
			return setSearch( {
				...isSearch,
				templates: status,
			} );
		}

		return setSearch( {
			...isSearch,
			library: status,
		} );
	};

	const getSearchStatus = () => {
		if ( isGeneral ) {
			return isSearch.templates;
		}

		return isSearch.library;
	};

	const changeID = ( element ) => {
		element.id = elementorCommon.helpers.getUniqueId();

		if ( 0 < element.elements.length ) {
			for ( let i = 0; i < element.elements.length; i++ ) {
				element.elements[ i ] = changeID( element.elements[ i ] );
			}
		}

		return element;
	};

	const onImport = async ( { id, title, meta = [] } ) => {
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
			content[ i ] = changeID( content[ i ] );
			$e.run( 'document/elements/create', {
				container: elementor.getPreviewContainer(),
				model: content[ i ],
				options: index >= 0 ? { at: index++ } : {},
			} );
		}

		if ( 0 < meta.length ) {
			window.tiTpc.postModel.set( 'meta', { ... JSON.parse( meta ) } );
			window.tiTpc.postModel.save();
		}

		$e.internal( 'document/history/end-log', {
			id: history,
		} );

		window.tiTpcModal.hide();

		setFetching( false );
	};

	return (
		<Fragment>
			<Header
				getSearchQuery={ getSearchQuery }
				getOrder={ getOrder }
				onImport={ onImport }
			/>
			<Content
				setQuery={ setQuery }
				getSearchQuery={ getSearchQuery }
				setSorting={ setSorting }
				getOrder={ getOrder }
				isSearch={ getSearchStatus() }
				setSearch={ setSearchStatus }
				onImport={ onImport }
			/>
		</Fragment>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getCurrentTab } = select( 'tpc/elementor' );

		return {
			currentTab: getCurrentTab(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setFetching } = dispatch( 'tpc/elementor' );

		return {
			setFetching,
		};
	} )
)( TemplateLibrary );
