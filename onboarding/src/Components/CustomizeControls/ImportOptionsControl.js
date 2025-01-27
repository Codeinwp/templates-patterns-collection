/* global tiobDash */
import { __, sprintf } from '@wordpress/i18n';
import {
	createInterpolateElement,
	useState,
	useEffect,
} from '@wordpress/element';
import classnames from 'classnames';
import CustomTooltip from '../CustomTooltip';
import { Icon, Button, ToggleControl } from '@wordpress/components';
import { withSelect } from '@wordpress/data';

const ImportOptionsControl = ( {
	importData,
	general,
	setGeneral,
	setSettingsChanged,
} ) => {
	const { cleanupAllowed } = tiobDash;
	const [ optionsOpened, setOptionsOpened ] = useState( false );
	const [ divHeight, setDivHeight ] = useState( 0 );
	const allPlugins = {
		...( importData.recommended_plugins || {} ),
		...( importData.mandatory_plugins || {} ),
	};

	const pluginsList = Object.entries( allPlugins )
		.map(
			( [ slug, pluginName ] ) =>
				`<li key="${ slug }">${ pluginName }</li>`
		)
		.join( '' );

	const updateDivHeight = () => {
		const element = document.querySelector( '.ob-site-settings-container' );
		if ( element ) {
			setDivHeight( Math.max( element.offsetHeight, 480 ) );
		}
	};

	useEffect( () => {
		updateDivHeight(); // Get initial height

		const win = document.defaultView;

		// Attach event listener for window resize
		win.addEventListener( 'resize', updateDivHeight );

		// Clean up the event listener when the component unmounts
		return () => {
			win.removeEventListener( 'resize', updateDivHeight );
		};
	}, [] );

	let map = {
		content: {
			title: __( 'Content', 'templates-patterns-collection' ),
			icon: 'admin-post',
			tooltip: __(
				'We recommend you backup your website content before attempting a full site import.',
				'templates-patterns-collection'
			),
		},
		customizer: {
			title: __( 'Customizer', 'templates-patterns-collection' ),
			icon: 'admin-customizer',
		},
		widgets: {
			title: __( 'Widgets', 'templates-patterns-collection' ),
			icon: 'admin-generic',
			tooltip: __(
				'Widgets will be moved to the Inactive Widgets sidebar and can be retrieved from there.',
				'templates-patterns-collection'
			),
		},
	};

	if ( cleanupAllowed === 'yes' ) {
		map = {
			cleanup: {
				icon: 'trash',
				title: __(
					'Cleanup previous import',
					'templates-patterns-collection'
				),
				tooltip: __(
					'This will remove any plugins, images, customizer options, widgets posts and pages added by the previous demo import',
					'templates-patterns-collection'
				),
			},
			...map,
		};
	}

	const toggleOpen = () => {
		setOptionsOpened( ! optionsOpened );
		updateDivHeight();
		const optionsContainer = document.querySelector(
			'.ob-import-options-toggles'
		);
		const pluginsContainer = document.querySelector( '.ob-import-plugins' );

		const container = document.querySelector( '.ob-site-settings' );
		if ( ! optionsOpened ) {
			const newHeight =
				optionsContainer.offsetHeight +
				pluginsContainer.offsetHeight +
				200;
			container.style.minHeight = newHeight + 'px';
		} else {
			container.style.minHeight = 'auto';
		}
	};

	return (
		<>
			<div className="ob-ctrl">
				<div className="ob-ctrl-wrap import-options">
					<Button
						onClick={ toggleOpen }
						icon={
							optionsOpened ? 'arrow-up-alt2' : 'arrow-down-alt2'
						}
						className="toggle"
					>
						{ __(
							'Advanced Settings',
							'templates-patterns-collection'
						) }
					</Button>
					<div
						className={ classnames(
							'ob-import-options-wrap',
							optionsOpened ? 'is-opened' : ''
						) }
						style={
							optionsOpened ? { height: divHeight + 'px' } : {}
						}
					>
						<div className="ob-import-options-toggles">
							{ Object.keys( map ).map( ( id, index ) => {
								const rowClass = classnames( 'ob-option-row', {
									active: general[ id ],
								} );
								const { icon, title, tooltip } = map[ id ];

								return (
									<div className={ rowClass } key={ index }>
										<div className="ob-option-name">
											<Icon icon={ icon } />
											<span>{ title }</span>
											{ tooltip && (
												<CustomTooltip>
													{ tooltip }
												</CustomTooltip>
											) }
										</div>
										{ id !== 'theme_install' && (
											<div className="ob-toggle-wrapper">
												<ToggleControl
													checked={ general[ id ] }
													onChange={ () => {
														setSettingsChanged(
															true
														);
														setGeneral( {
															...general,
															[ id ]: ! general[
																id
															],
														} );
													} }
												/>
											</div>
										) }
									</div>
								);
							} ) }
						</div>
						{ allPlugins && (
							<div className="ob-import-plugins">
								<h2>
									{ __(
										'Plugins',
										'templates-patterns-collection'
									) }
								</h2>
								<p>
									{ __(
										'The following plugins are required for this Starter Site in order to work properly:',
										'templates-patterns-collection'
									) }
								</p>
								<ul
									dangerouslySetInnerHTML={ {
										__html: pluginsList,
									} }
								/>
							</div>
						) }
					</div>
				</div>
			</div>
		</>
	);
};

export default withSelect( ( select ) => {
	const { getImportData } = select( 'ti-onboarding' );
	return {
		importData: getImportData(),
	};
} )( ImportOptionsControl );
