/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	ButtonGroup,
	Placeholder,
	Spinner,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { Fragment, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	fetchTemplates,
	fetchLibrary,
} from './../data/templates-cloud/index.js';
import Filters from './filters.js';
import ListItem from './list-item.js';

const Library = ( {
	isFetching,
	importBlocks,
	items,
	currentPage,
	totalPages,
} ) => {
	const { setFetching } = useDispatch( 'tpc/block-editor' );

	const [ layout, setLayout ] = useState( 'grid' );

	const pages = [];

	const changePage = async ( index ) => {
		setFetching( true );
		await fetchLibrary( {
			page: index,
		} );
		await fetchTemplates( {
			page: index,
		} );
		setFetching( false );
	};

	const Pagination = () => {
		for ( let i = 0; i < totalPages; i++ ) {
			const isCurrent = i === currentPage;

			pages.push(
				<Button
					isPrimary={ isCurrent }
					disabled={ isCurrent }
					onClick={ () => changePage( i ) }
				>
					{ i + 1 }
				</Button>
			);
		}

		return pages;
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
			<div className="wp-block-ti-tpc-templates-cloud__modal-content__table">
				{ __( 'No templates available. Add a new one?' ) }
			</div>
		);
	}

	return (
		<Fragment>
			<Filters layout={ layout } setLayout={ setLayout } />

			<div
				className={ classnames(
					'wp-block-ti-tpc-templates-cloud__modal-content__table',
					{
						'is-grid': 'grid' === layout,
					}
				) }
			>
				{ items.map( ( item ) => (
					<ListItem
						key={ item.template_id }
						layout={ layout }
						item={ item }
						importBlocks={ importBlocks }
					/>
				) ) }
			</div>

			{ 1 < totalPages && (
				<ButtonGroup className="wp-block-ti-tpc-templates-cloud__modal-content__pagination">
					<Pagination />
				</ButtonGroup>
			) }
		</Fragment>
	);
};

export default Library;
