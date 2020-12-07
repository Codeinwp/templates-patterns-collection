import classnames from 'classnames';
import { Button } from '@wordpress/components';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Path, SVG } from '@wordpress/primitives';

const Icon = ( { title } ) => {
	return (
		<SVG
			width="100"
			height="100"
			viewBox="0 0 100 100"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="tpc-template-cloud-icon"
			title={ title }
		>
			<Path
				d="M95.0264 100H4.97356C2.22797 100 0 97.772 0 95.0264V4.97356C0 2.22797 2.22797 0 4.97356 0H95.0264C97.772 0 100 2.22797 100 4.97356V95.0264C100 97.772 97.772 100 95.0264 100Z"
				fill="#0366D6"
			/>
			<Path
				d="M82.6941 86.7448V30.8205V18.4653H70.3502H14.4146L26.7584 30.8205H70.3502V74.401L82.6941 86.7448Z"
				fill="white"
			/>
			<Path
				d="M42.2416 58.9291L42.2528 71.183L53.2352 82.1653L53.1902 47.9806L18.9941 47.9355L29.9765 58.9066L42.2416 58.9291Z"
				fill="white"
			/>
		</SVG>
	);
};

const Header = ( {
	isPreview,
	currentTab,
	togglePreview,
	updateCurrentTab,
} ) => {
	return (
		<div className="dialog-header dialog-lightbox-header">
			<div className="ti-tpc-templates-modal__header">
				<div className="ti-tpc-templates-modal__header__logo-area">
					{ isPreview ? (
						<Button
							className="ti-tpc--template-library-header-preview-back"
							onClick={ togglePreview }
						>
							<i className="eicon-" aria-hidden="true"></i>
							<span>{ window.tiTpc.library.actions.back }</span>
						</Button>
					) : (
						<div className="ti-tpc-templates-modal__header__logo">
							<Icon
								title={ window.tiTpc.library.templatesCloud }
							/>
						</div>
					) }
				</div>

				{ ! isPreview && (
					<div className="ti-tpc-templates-modal__header__menu-area">
						<Button
							className={ classnames(
								'ti-tpc-template-library-menu-item',
								{
									'is-active': 'templates' === currentTab,
								}
							) }
							onClick={ () => updateCurrentTab( 'templates' ) }
						>
							{ window.tiTpc.library.tabs.templates }
						</Button>

						<Button
							className={ classnames(
								'ti-tpc-template-library-menu-item',
								{
									'is-active': 'library' === currentTab,
								}
							) }
							onClick={ () => updateCurrentTab( 'library' ) }
						>
							{ window.tiTpc.library.tabs.library }
						</Button>
					</div>
				) }

				<div className="ti-tpc-templates-modal__header__items-area">
					<div className="ti-tpc-template-library-header-tools">
						{ isPreview ? (
							<div className="ti-tpc-templates-modal__header__item ti-tpc-template-library-header-preview-insert-wrapper">
								<Button className="ti-tpc-template-library-template-insert elementor-button">
									<i
										className="eicon-file-download"
										aria-hidden="true"
									></i>
									<span className="elementor-button-title">
										{ window.tiTpc.library.actions.insert }
									</span>
								</Button>
							</div>
						) : (
							<div className="ti-tpc-template-library-header-actions">
								<div className="ti-tpc-templates-modal__header__item">
									<i
										className="eicon-sync"
										aria-hidden="true"
										title={
											window.tiTpc.library.actions.sync
										}
									></i>
									<span className="elementor-screen-only">
										{ window.tiTpc.library.actions.sync }
									</span>
								</div>
							</div>
						) }
					</div>

					<div className="ti-tpc-templates-modal__header__item ti-tpc-templates-modal__header__close">
						<i
							className="eicon-close"
							aria-hidden="true"
							title={ window.tiTpc.library.actions.close }
							onClick={ window.tiTpcModal.hide }
						></i>
						<span className="elementor-screen-only">
							{ window.tiTpc.library.actions.close }
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { isPreview, getCurrentTab } = select( 'tpc/elementor' );

		return {
			isPreview: isPreview(),
			currentTab: getCurrentTab(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { togglePreview, updateCurrentTab } = dispatch( 'tpc/elementor' );

		return {
			togglePreview,
			updateCurrentTab,
		};
	} )
)( Header );
