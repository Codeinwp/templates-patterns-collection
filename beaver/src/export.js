/* global FLBuilder */

if ( parseInt( window.tiTpc.tier ) === 3 ) {
	const contextMenu = document.getElementById( 'tmpl-fl-row-overlay' );

	const tpcExport = ( e ) => {
		const row = e.closest( '.fl-row' );
		const node = row.dataset.node;

		const message = `<div class="tpc-template-cloud-export-modal">
		<h1>${ window.tiTpc.exporter.modalLabel }</h1>
		<label for="tpc-${ node }">${ window.tiTpc.exporter.textLabel }</label>
		<input id="tpc-${ node }" type="text" placeholder="${ window.tiTpc.exporter.textPlaceholder }" />
	</div>`;

		FLBuilder.confirm( {
			message,
			ok: () => {
				const input = document.getElementById( `tpc-${ node }` );
				const title = input.value || 'Template';
				setTimeout( function () {
					FLBuilder.showAjaxLoader();
					FLBuilder.ajax(
						{
							action: 'ti_export_template',
							node,
							title,
						},
						( res ) => {
							if ( undefined !== res.success && ! res.success ) {
								FLBuilder.alert(
									`<h1>${ window.tiTpc.exporter.exportFailed }</h1> ${ res.data }`
								);
							}

							FLBuilder.hideAjaxLoader();
						}
					);
				}, 1000 );
			},
			strings: {
				ok: window.tiTpc.exporter.buttonLabel,
				cancel: window.tiTpc.exporter.cancelLabel,
			},
		} );
	};

	window.tiTpc.tpcExport = tpcExport;

	if ( contextMenu ) {
		const text = contextMenu.textContent;
		contextMenu.textContent = text.replace(
			// eslint-disable-next-line prettier/prettier
			'<li><a class=\"fl-block-row-reset\" href=\"javascript:void(0);\">Reset Row Width</a></li>',
			// eslint-disable-next-line prettier/prettier
			'<li><a class=\"fl-block-row-reset\" href=\"javascript:void(0);\">Reset Row Width</a></li><li><a class=\"fl-block-row-tpc-export\" onclick="window.tiTpc.tpcExport(this)" href=\"javascript:void(0);\">Save to Templates Cloud</a></li>'
		);
	}

	FLBuilder.addHook( 'tiTpcExport', () => {
		window.tiTpc.initModalExport();
	} );
}
