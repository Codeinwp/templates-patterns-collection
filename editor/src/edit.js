import { useState } from '@wordpress/element';
import ImportModal from './components/import-modal';

const Edit = ( { autoLoad = true } ) => {
	const [ modalOpen, setModalOpen ] = useState( false );

	return (
		<>
			<ImportModal
				autoLoad={ autoLoad }
				modalOpen={ modalOpen }
				setModalOpen={ setModalOpen }
			/>
		</>
	);
};

export default Edit;
