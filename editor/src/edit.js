import { useState } from '@wordpress/element';
import ImportModal from './components/import-modal';

const Edit = ( { autoLoad = true } ) => {
	const modalState = useState( false );

	return (
		<>
			<ImportModal autoLoad={ autoLoad } modalState={ modalState } />
		</>
	);
};

export default Edit;
