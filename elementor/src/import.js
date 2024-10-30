/* global elementor, elementorCommon */
import { render } from '@wordpress/element';
import TemplateLibrary from './template-library.js';

if ( undefined !== elementorCommon ) {
	window.tiTpcModal = elementorCommon.dialogsManager.createWidget(
		'lightbox',
		{
			id: 'ti-tpc-templates-modal',
			className: 'ti-tpc-templates-modal',
			hide: {
				auto: false,
				onClick: false,
				onOutsideClick: false,
				onOutsideContextMenu: false,
				onBackgroundClick: true,
			},
			position: {
				my: 'center',
				at: 'center',
			},
			onShow() {
				const content = window.tiTpcModal.getElements( 'content' );
				const contentArea = document.getElementById(
					'ti-tpc-templates-modal-content'
				);

				if ( ! contentArea ) {
					content.append(
						'<div id="ti-tpc-templates-modal-content" class="wrap"></div>'
					);
				}
			},
		}
	);

	window.tiTpcModal.getElements( 'header' ).remove();
	window.tiTpcModal.getElements( 'message' ).remove();
	window.tiTpcModal
		.getElements( 'widgetContent' )
		.append( window.tiTpcModal.addElement( 'content' ) );
}

const initModal = ( e ) => {
	window.tiTpcModal.show();

	const parentElement = elementor.$previewContents[ 0 ].body.querySelector(
		'.elementor-section-wrap'
	);

	const childElement = e.closest( '.elementor-add-section' );
	window.tiTpc.placeholder = Array.from( parentElement.childNodes ).indexOf(
		childElement
	);

	render(
		<TemplateLibrary />,
		document.getElementById( 'ti-tpc-templates-modal-content' )
	);

	window.tiTpcModal.refreshPosition();
};

const placeholder = document.getElementById( 'tmpl-elementor-add-section' );

if ( placeholder ) {
	const text = placeholder.textContent;
	const regex =
		/(<div class="[^"]*?elementor-add-section-drag-title[^"]*?">(.|\n)*?<\/div>)/gm;
	placeholder.textContent = text.replace(
		regex,
		// eslint-disable-next-line prettier/prettier
		`<div class="elementor-add-section-area-button elementor-templates-cloud-button" title="${ window.tiTpc.library.libraryButton }"><svg width="100" height="100" viewBox="10 10 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="tpc-template-cloud-icon" role="img" aria-hidden="true" focusable="false"><path d="M95.0264 100H4.97356C2.22797 100 0 97.772 0 95.0264V4.97356C0 2.22797 2.22797 0 4.97356 0H95.0264C97.772 0 100 2.22797 100 4.97356V95.0264C100 97.772 97.772 100 95.0264 100Z" fill="#0366D6"></path><path d="M82.6941 86.7448V30.8205V18.4653H70.3502H14.4146L26.7584 30.8205H70.3502V74.401L82.6941 86.7448Z" fill="white"></path><path d="M42.2416 58.9291L42.2528 71.183L53.2352 82.1653L53.1902 47.9806L18.9941 47.9355L29.9765 58.9066L42.2416 58.9291Z" fill="white" style=""></path></svg></div> $1`
	);
}

elementor.on( 'preview:loaded', () => {
	elementor.$previewContents[ 0 ].body.addEventListener(
		'click',
		( event ) => {
			if (
				-1 <
					Array.from( event.target.classList ).indexOf(
						'elementor-templates-cloud-button'
					) ||
				-1 <
					Array.from( event.target.classList ).indexOf(
						'tpc-template-cloud-icon'
					) ||
				-1 <
					Array.from( event.target.parentNode.classList ).indexOf(
						'tpc-template-cloud-icon'
					)
			) {
				initModal( event.target );
			}
		}
	);
} );
