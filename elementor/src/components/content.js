/* eslint-disable no-undef */
import classnames from 'classnames';
import { Button, Spinner, Icon } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { Fragment, useEffect } from '@wordpress/element';
import { rotateRight } from '@wordpress/icons';
import { ENTER } from '@wordpress/keycodes';
import TemplatesContent from './templates-content.js';
import Export from './export.js';

import {
	fetchTemplates,
	fetchLibrary,
	updateTemplate,
	deleteTemplate,
	duplicateTemplate,
} from './../data/templates-cloud/index.js';

const sortByOptions = {
	date: window.tiTpc.library.filters.sortLabels.date,
	template_name: window.tiTpc.library.filters.sortLabels.name,
	modified: window.tiTpc.library.filters.sortLabels.modified,
};

const Content = ( {
	setQuery,
	getSearchQuery,
	setSorting,
	getOrder,
	isSearch,
	setSearch,
	onImport,
	isFetching,
	isPreview,
	currentTab,
	preview,
	setFetching,
} ) => {
	const init = async ( search = getSearchQuery() ) => {
		setFetching( true );

		if ( search ) {
			setSearch( true );
		} else {
			setSearch( false );
		}

		const order = getOrder();
		if ( currentTab === 'templates' ) {
			await fetchTemplates( {
				search,
				...order,
			} );
		} else {
			await fetchLibrary( {
				search,
				...order,
			} );
		}
		setFetching( false );
	};

	useEffect( () => {
		init();
	}, [ currentTab, getOrder() ] );

	const isGeneral = currentTab === 'templates';

	const onUpdateTemplate = async ( id, title ) => {
		setFetching( true );
		await updateTemplate( {
			template_id: id,
			template_name: title,
		} );
		setFetching( false );
	};

	const onDelete = async ( id ) => {
		setFetching( true );
		await deleteTemplate( id );
		setFetching( false );
	};

	const onDuplicate = async ( id ) => {
		setFetching( true );
		await duplicateTemplate( id );
		setFetching( false );
	};

	if ( isPreview ) {
		return (
			<div
				className={ classnames(
					'dialog-message dialog-lightbox-message',
					{
						'is-dark':
							'dark' ===
							elementor.settings.editorPreferences.model.get(
								'ui_theme'
							),
					}
				) }
			>
				<div className="dialog-content dialog-lightbox-content">
					<div className="ti-tpc-template-library-preview">
						<iframe
							title={ preview.template_name }
							src={ preview.link || '' }
						></iframe>

						<div className="is-loading">
							<Icon icon={ rotateRight } />
						</div>
					</div>
				</div>
			</div>
		);
	}

	if ( isFetching ) {
		return (
			<div
				className={ classnames(
					'dialog-message dialog-lightbox-message',
					{
						'is-dark':
							'dark' ===
							elementor.settings.editorPreferences.model.get(
								'ui_theme'
							),
					}
				) }
			>
				<div className="dialog-content dialog-lightbox-content is-loading">
					<Spinner />
				</div>
			</div>
		);
	}

	if ( 'export' === currentTab ) {
		return <Export />;
	}

	return (
		<div
			className={ classnames( 'dialog-message dialog-lightbox-message', {
				'is-dark':
					'dark' ===
					elementor.settings.editorPreferences.model.get(
						'ui_theme'
					),
			} ) }
		>
			<div className="dialog-content dialog-lightbox-content">
				<div className="ti-tpc-template-library-templates">
					<div className="ti-tpc-template-library-templates-header">
						<div className="ti-tpc-template-library-templates-header-filters">
							{ isGeneral && (
								<Fragment>
									<div className="ti-tpc-template-library-templates-header-filters-label">
										{
											window.tiTpc.library.filters
												.sortLabel
										}
									</div>

									<div className="ti-tpc-template-library-templates-header-filters-filter">
										{ Object.keys( sortByOptions ).map(
											( i ) => (
												<Button
													key={ i }
													className={ classnames( {
														'is-selected':
															i ===
															getOrder().orderby,
														'is-asc':
															'ASC' ===
															getOrder().order,
													} ) }
													onClick={ () => {
														const order = {
															order: 'DESC',
															orderby: i,
														};

														if (
															i ===
															getOrder().orderby
														) {
															if (
																'DESC' ===
																getOrder().order
															) {
																order.order =
																	'ASC';
															}
														}
														setSorting( {
															...order,
														} );
													} }
												>
													{ sortByOptions[ i ] }
												</Button>
											)
										) }
									</div>
								</Fragment>
							) }
						</div>

						<div className="ti-tpc-template-library-templates-header-search">
							<label
								htmlFor="ti-tpc-template-library-filter-search"
								className="elementor-screen-only"
							>
								{ window.tiTpc.library.filters.searchLabel }
							</label>
							<input
								id="ti-tpc-template-library-filter-search"
								placeholder={
									window.tiTpc.library.filters.search
								}
								value={ getSearchQuery() }
								onChange={ ( e ) => setQuery( e.target.value ) }
								onKeyDown={ ( e ) => {
									if ( e.keyCode === ENTER ) {
										init();
									}
								} }
							/>

							{ isSearch ? (
								<Button
									onClick={ () => {
										setQuery( '' );
										init( '' );
									} }
								>
									<i className="eicon-close"></i>
								</Button>
							) : (
								<Button onClick={ () => init() }>
									<i className="eicon-search"></i>
								</Button>
							) }
						</div>
					</div>

					{ [ 'templates', 'library' ].includes( currentTab ) && (
						<TemplatesContent
							getSearchQuery={ () => getSearchQuery() }
							getOrder={ getOrder }
							setSorting={ setSorting }
							onImport={ onImport }
							onUpdateTemplate={ onUpdateTemplate }
							onDelete={ onDelete }
							onDuplicate={ onDuplicate }
							isFetching={ isFetching }
							isGeneral={ isGeneral }
						/>
					) }
				</div>
			</div>
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { isFetching, isPreview, getCurrentTab, getPreview } = select(
			'tpc/elementor'
		);

		return {
			isFetching: isFetching(),
			isPreview: isPreview(),
			currentTab: getCurrentTab(),
			preview: getPreview(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setFetching } = dispatch( 'tpc/elementor' );

		return {
			setFetching,
		};
	} )
)( Content );
