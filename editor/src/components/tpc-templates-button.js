import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import ImportModal from './import-modal';
import { iconBlack as icon } from '../icon';

const TpcTemplatesButton = () => {
	const modalState = useState( false );

	return (
		<>
			<Button
				icon={ icon }
				isPrimary
				onClick={ () => modalState[ 1 ]( true ) }
				style={ { backgroundColor: '#000', margin: '0 10px' } }
			>
				{ __( 'Templates Cloud', 'templates-patterns-collection' ) }
			</Button>
			<ImportModal autoLoad={ false } modalState={ modalState } />
		</>
	);
};

export default TpcTemplatesButton;
