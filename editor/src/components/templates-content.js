import { __ } from '@wordpress/i18n';
import { Placeholder, Spinner } from '@wordpress/components';
import { withSelect, useDispatch } from '@wordpress/data';
import { Fragment, useEffect, useState } from '@wordpress/element';

import classnames from 'classnames';

import Filters from './filters';
import ListItem from './list-item';
import Pagination from './pagination';
import { fetchLibrary, fetchTemplates } from './../data/templates-cloud/index';

const TemplatesContent = ( {
	importBlocks,
	isGeneral = false,
	isFetching,
	items,
	currentPage,
	totalPages,
} ) => {
	const { setFetching } = useDispatch( 'tpc/block-editor' );
	const [ layout, setLayout ] = useState( 'grid' );

	const init = async () => {
		setFetching( true );
		if ( isGeneral ) {
			await fetchTemplates();
		} else {
			await fetchLibrary();
		}
		setFetching( false );
	};

	useEffect( () => {
		if ( items && items.length > 0 ) {
			return;
		}
		init();
	}, [ isGeneral ] );

	const changePage = async ( index ) => {
		setFetching( true );
		if ( isGeneral ) {
			await fetchTemplates( {
				page: index,
			} );
		} else {
			await fetchLibrary( {
				page: index,
			} );
		}

		setFetching( false );
	};

	if ( isFetching ) {
		return (
			<Placeholder>
				<Spinner />
			</Placeholder>
		);
	}

	if ( ! Boolean( items.length ) ) {
		return (
			<div className="table-content">
				{ __( 'No templates available. Add a new one?' ) }
			</div>
		);
	}

	const contentClasses = classnames( 'table-content', {
		'is-grid': 'grid' === layout,
	} );

	return (
		<Fragment>
			<Filters layout={ layout } setLayout={ setLayout } />

			<div className={ contentClasses }>
				{ items.map( ( item ) => (
					<ListItem
						deletable={ ! isGeneral }
						key={ item.template_id }
						layout={ layout }
						item={ item }
						importBlocks={ importBlocks }
					/>
				) ) }
			</div>

			<Pagination
				onChange={ changePage }
				current={ currentPage }
				total={ totalPages }
			/>
		</Fragment>
	);
};

export default withSelect( ( select, { isGeneral } ) => {
	const library = isGeneral
		? select( 'tpc/block-editor' ).getTemplates()
		: select( 'tpc/block-editor' ).getLibrary();
	const { items = [], currentPage, totalPages } = library;
	return { items, currentPage, totalPages };
} )( TemplatesContent );
