import { useState } from '@wordpress/element';
import ImportModal from './components/import-modal';

const Edit = ( { clientId, autoLoad = true } ) => {
	const [ modalOpen, setModalOpen ] = useState( false );

	return (
		<>
			<ImportModal
				clientId={ clientId }
				autoLoad={ autoLoad }
				modalOpen={ modalOpen }
				setModalOpen={ setModalOpen }
			/>
		</>
	);
};

export default Edit;
