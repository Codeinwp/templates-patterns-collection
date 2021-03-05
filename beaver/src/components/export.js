import { Button, Icon } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { cloudUpload, rotateRight } from '@wordpress/icons';

const Export = () => {
	const [ isLoading, setLoading ] = useState( false );

	return (
		<div className="tpc-modal-content">
			<div className="tpc-modal-content-export">
				<div className="tpc-modal-content-export-icon">
					<Icon icon={ cloudUpload } />
				</div>

				<div className="tpc-modal-content-export-title">
					{ window.tiTpc.library.export.title }
				</div>

				<div className="tpc-modal-content-export-field">
					<input
						className="tpc-modal-content-export-field-input"
						value={ window.tiTpc.pageTitle || '' }
						disabled
					/>

					<Button
						className="tpc-modal-content-export-field-submit"
						disabled={ isLoading }
						icon={ isLoading ? rotateRight : '' }
						onClick={ () => setLoading( ! isLoading ) }
					>
						{ window.tiTpc.library.export.save }
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Export;
