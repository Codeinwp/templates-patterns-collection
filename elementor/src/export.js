/* global elementor */
import { stringifyUrl } from 'query-string';
import { v4 as uuidv4 } from 'uuid';
import apiFetch from '@wordpress/api-fetch';
import { Button, Modal, TextControl } from '@wordpress/components';
import { render, unmountComponentAtNode, useState } from '@wordpress/element';

document.addEventListener( 'DOMContentLoaded', () => {
	const addExportMenuItem = ( groups, element ) => {
		const actions = {
			name: 'ti_tpc_export',
			title: window.tiTpc.exporter.exportLabel,
			callback: () => onClickModal( element ),
		};

		const isSaveExist = groups.find( ( i ) => 'save' === i.name );

		if ( isSaveExist ) {
			isSaveExist.actions.push( actions );
		} else {
			const Export = {
				name: 'ti_tpc_export',
				actions: [ actions ],
			};

			groups.splice( 3, 0, Export );
			groups.join();
		}

		return groups;
	};

	const dispatchNotification = ( message ) =>
		elementor.notifications.showToast( { message } );

	const ExportModal = ( { content } ) => {
		const [ title, setTitle ] = useState( '' );
		const [ isLoading, setLoading ] = useState( false );

		const onClose = () => {
			unmountComponentAtNode( document.getElementById( 'ti-tpc-modal' ) );
		};

		const onSave = async () => {
			setLoading( true );

			const data = {
				version: '0.4',
				title,
				type: 'section',
				content: [ content ],
			};

			const url = stringifyUrl( {
				url: window.tiTpc.endpoint + 'templates',
				query: {
					...window.tiTpc.params,
					template_name:
						title || window.tiTpc.exporter.textPlaceholder,
					template_type: 'elementor',
				},
			} );

			try {
				const response = await apiFetch( {
					url,
					method: 'POST',
					data,
					parse: false,
				} );

				if ( response.ok ) {
					const res = await response.json();

					if ( res.message ) {
						dispatchNotification( res.message );
					} else {
						window.localStorage.setItem(
							'tpcCacheBuster',
							uuidv4()
						);

						dispatchNotification( 'Template Saved' );
					}
				}
			} catch ( error ) {
				if ( error.message ) {
					dispatchNotification( error.message );
				}
			}

			setLoading( false );
			onClose();
		};

		return (
			<Modal
				title={ window.tiTpc.exporter.modalLabel }
				onRequestClose={ onClose }
			>
				<TextControl
					label={ window.tiTpc.exporter.textLabel }
					placeholder={ window.tiTpc.exporter.textPlaceholder }
					value={ title }
					onChange={ setTitle }
				/>

				<Button
					isPrimary
					isBusy={ isLoading }
					disabled={ isLoading }
					onClick={ onSave }
				>
					{ window.tiTpc.exporter.buttonLabel }
				</Button>
			</Modal>
		);
	};

	const onClickModal = ( element ) => {
		const content = element.model.toJSON( {
			remove: [ 'default', 'editSettings', 'defaultEditSettings' ],
		} );

		const el = document.createElement( 'div' );
		el.id = 'ti-tpc-modal';
		document.body.appendChild( el );

		render(
			<ExportModal content={ content } />,
			document.getElementById( 'ti-tpc-modal' )
		);
	};

	// We only hook our menu item to Sections as handling importing of separate Column and Widgets can be tricky.
	elementor.hooks.addFilter(
		'elements/section/contextMenuGroups',
		addExportMenuItem
	);
} );
