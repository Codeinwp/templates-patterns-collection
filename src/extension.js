/**
 * External dependencies
 */
import { stringifyUrl } from 'query-string';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;

const { apiFetch } = wp;

const { serialize } = wp.blocks;

const {
	Button,
	Modal,
	TextControl
} = wp.components;

const {
	useDispatch,
	useSelect
} = wp.data;

const { PluginBlockSettingsMenuItem } = wp.editPost;

const {
	Fragment,
	useState
} = wp.element;

const Exporter = () => {
	const [ isOpen, setOpen ] = useState( false );
	const [ isLoading, setLoading ] = useState( false );
	const [ title, setTitle ] = useState( '' );

	const {
		createErrorNotice,
		createSuccessNotice
	} = useDispatch( 'core/notices' );

	const content = useSelect( ( select ) => {
		const { getSelectedBlockCount, getSelectedBlock, getMultiSelectedBlocks } = select( 'core/block-editor' );
		const blocks = 1 === getSelectedBlockCount() ? getSelectedBlock() : getMultiSelectedBlocks();

		return serialize( blocks );
	}, []);

	const onSave = async() => {
		setLoading( true );

		const data = {
			__file: 'wp_export',
			version: 2,
			content
		};

		const url = stringifyUrl({
			url: tiTpc.endpoint,
			query: {
				...window.tiTpc.params,
				'template_name': title,
				'template_type': 'gutenberg'
			}
		});

		try {
			const response = await apiFetch({
				url,
				method: 'POST',
				data,
				parse: false
			});

			if ( response.ok ) {
				const content = await response.json();

				if ( content.message ) {
					createErrorNotice( content.message, {
						type: 'snackbar'
					});
				} else {
					createSuccessNotice( __( 'Template saved.' ), {
						type: 'snackbar'
					});
				}
			}
		} catch ( error ) {
			if ( error.message ) {
				createErrorNotice( error.message, {
					type: 'snackbar'
				});
			}
		}

		setLoading( false );
		setOpen( false );
		setTitle( '' );
	};

	return (
		<Fragment>
			<PluginBlockSettingsMenuItem
				label={ __( 'Save as Template' ) }
				icon={ 'none' } // We don't want an icon, as new UI of Gutenberg does't have icons for Menu Items, but the component doesn't allow that so we pass an icon which doesn't exist.
				onClick={ () => setOpen( true ) }
			/>

			{ isOpen && (
				<Modal
					title={ __( 'Save Template' ) }
					onRequestClose={ () => setOpen( false ) }
				>
					<TextControl
						label={ __( 'Template Name' ) }
						value={ title }
						onChange={ setTitle }
					/>

					<Button
						isPrimary
						isPressed={ isLoading }
						isBusy={ isLoading }
						onClick={ onSave }
					>
						{ __( 'Save' ) }
					</Button>
				</Modal>
			) }
		</Fragment>
	);
};

export default Exporter;
