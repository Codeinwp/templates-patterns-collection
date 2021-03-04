if ( document.getElementById( 'ti-tpc-beaver' ) ) {
	const instanceId = '<?php echo $id; ?>';
	if ( window.tiTpc ) {
		window.tiTpc.initBeaver( instanceId );
	}
}
