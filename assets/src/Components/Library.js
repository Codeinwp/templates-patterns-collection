import { stringifyUrl } from 'query-string';

import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';
import { useEffect, useState, Fragment } from '@wordpress/element';

import ListItem from './ListItem';

const Library = ( { library, setLibrary } ) => {
	useEffect( () => {
		setLoading( true );
		loadTemplates();
	}, [] );

	const [ isLoading, setLoading ] = useState( false );

	const loadTemplates = async ( params = {} ) => {
		const url = stringifyUrl( {
			url: window.tiobDash.endpoint,
			query: {
				cache: window.localStorage.getItem( 'tpcCacheBuster' ),
				...window.tiobDash.params,
				...params,
				pre_page: 100,
			},
		} );

		try {
			const response = await apiFetch( {
				url,
				method: 'GET',
			} );

			setLibrary( response );
		} catch ( error ) {
			if ( error.message ) {
				console.log( error.message );
			}
		}

		setLoading( false );
	};

	if ( isLoading ) {
		return <Spinner />;
	}

	if ( library.length > 0 ) {
		return (
			<Fragment>
				<div className="list-item__table">
					{ library.map( ( item ) => (
						<ListItem
							key={ item.template_id }
							item={ item }
							loadTemplates={ loadTemplates }
						/>
					) ) }
				</div>
			</Fragment>
		);
	}

	return (
		<Fragment>
			{ __( 'No templates available. Try adding a new one!' ) }
		</Fragment>
	);
};

export default Library;
