import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import ImportModal from './import-modal';
import { iconBlack as icon } from '../icon';

const TpcTemplatesButton = () => {
	const [ modalOpen, setModalOpen ] = useState( false );

	return (
		<>
			<Button
				icon={ icon }
				isPrimary
				onClick={ () => setModalOpen( true ) }
				style={ { backgroundColor: '#000', margin: '0 10px' } }
			>
				{ __( 'Templates Cloud', 'templates-patterns-collection' ) }
			</Button>
			<ImportModal
				autoLoad={ false }
				modalOpen={ modalOpen }
				setModalOpen={ setModalOpen }
			/>
		</>
	);
};

export default TpcTemplatesButton;
