/* global elementor */
import classnames from 'classnames';
import { Button } from '@wordpress/components';
import { withDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { ENTER } from '@wordpress/keycodes';

import { exportTemplate } from './../data/templates-cloud/index.js';

const Export = ( { updateCurrentTab } ) => {
	const [ title, setTitle ] = useState( null );
	const [ isLoading, setLoading ] = useState( false );

	const exportPage = async () => {
		setLoading( true );

		const content = elementor.elements.toJSON( {
			remove: [ 'default', 'editSettings', 'defaultEditSettings' ],
		} );

		await exportTemplate( {
			title,
			type: 'page',
			content,
		} );

		setLoading( false );
		updateCurrentTab( 'library' );
	};

	return (
		<div className="dialog-message dialog-lightbox-message">
			<div className="dialog-content dialog-lightbox-content">
				<div className="ti-tpc-template-library-export">
					<div className="ti-tpc-template-library-blank-icon">
						<i
							className="eicon-library-save"
							aria-hidden="true"
						></i>
						<span className="elementor-screen-only">
							{ window.tiTpc.library.export.save }
						</span>
					</div>

					<div className="ti-tpc-template-library-blank-title">
						{ window.tiTpc.library.export.title }
					</div>

					<div className="ti-tpc-template-library-blank-field">
						<input
							className="ti-tpc-template-library-blank-field-input"
							placeholder={
								window.tiTpc.library.export.placeholder
							}
							value={ title }
							required={ true }
							onKeyDown={ ( e ) =>
								ENTER === e.keyCode && exportPage()
							}
							onChange={ ( e ) =>
								setTitle(
									e.target.value ||
										window.tiTpc.library.defaultTitle
								)
							}
						/>

						<Button
							className={ classnames(
								'elementor-button elementor-button-success',
								{ 'elementor-button-state': isLoading }
							) }
							onClick={ exportPage }
						>
							<span className="elementor-state-icon">
								<i
									className="eicon-loading eicon-animation-spin"
									aria-hidden="true"
								></i>
							</span>
							{ window.tiTpc.library.export.save }
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withDispatch( ( dispatch ) => {
	const { updateCurrentTab } = dispatch( 'tpc/elementor' );

	return {
		updateCurrentTab,
	};
} )( Export );
