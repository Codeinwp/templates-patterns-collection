import { __, sprintf } from '@wordpress/i18n';
import {
	createInterpolateElement,
	useState,
	useEffect,
} from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import classnames from 'classnames';
import CustomTooltip from '../CustomTooltip';
import { Icon, Button, ToggleControl } from '@wordpress/components';

const ImportOptionsControl = ( {
	isCleanupAllowed,
	themeData,
	importData,
} ) => {
	const [ optionsOpened, setOptionsOpened ] = useState( false );
	const [ divHeight, setDivHeight ] = useState( 0 );
	const allPlugins = {
		...( importData.recommended_plugins || {} ),
		...( importData.mandatory_plugins || {} ),
	};

	const pluginsList = Object.keys( allPlugins )
		.map( ( slug ) => {
			return allPlugins[ slug ];
		} )
		.join( ', ' );

	const updateDivHeight = () => {
		const element = document.querySelector( '.ob-settings-wrap' );
		if ( element ) {
			const height = element.offsetHeight - 82;
			setDivHeight( height );
		}
	};

	useEffect( () => {
		updateDivHeight(); // Get initial height

		// Attach event listener for window resize
		window.addEventListener( 'resize', updateDivHeight );

		// Clean up the event listener when the component unmounts
		return () => {
			window.removeEventListener( 'resize', updateDivHeight );
		};
	}, [] );

	const [ general, setGeneral ] = useState( {
		content: true,
		customizer: true,
		widgets: true,
		cleanup: false,
		performanceAddon: true,
		theme_install: themeData !== false,
	} );

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
		performanceAddon: {
			title: __(
				'Performance features',
				'templates-patterns-collection'
			),
			icon: 'dashboard',
			tooltip: createInterpolateElement(
				__(
					sprintf(
						// translators: %s is Optimole plugin name.
						'Optimize and speed up your site with our trusted addon, <a><span>%s</span><icon/></a>. It’s free.',
						'Optimole'
					),
					'templates-patterns-collection'
				),
				{
					a: (
						<a
							href="https://wordpress.org/plugins/optimole-wp/"
							target={ '_blank' }
							style={ {
								textDecoration: 'none',
								display: 'inline-flex',
								alignItems: 'center',
							} }
						/>
					),
					icon: (
						<Icon
							size={ 10 }
							icon="external"
							style={ { marginLeft: 0 } }
						/>
					),
					span: <div />,
				}
			),
		},
	};

	if ( isCleanupAllowed === 'yes' ) {
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
													setGeneral( {
														...general,
														[ id ]: ! general[ id ],
													} );
												} }
											/>
										</div>
									) }
								</div>
							);
						} ) }
						{ allPlugins && (
							<div className="ob-import-plugins">
								<h2>
									{ __(
										'Plugins',
										'templates-pattern-collection'
									) }
								</h2>
								<p>
									{ __(
										'The following plugins are required for this Starter Site in order to work properly: ',
										'templates-pattern-collection'
									) }
									<span
										dangerouslySetInnerHTML={ {
											__html: pluginsList,
										} }
									/>
								</p>
							</div>
						) }
					</div>
				</div>
			</div>
		</>
	);
};

export default withSelect( ( select ) => {
	const { getThemeAction } = select( 'ti-onboarding' );
	return {
		themeData: getThemeAction() || false,
	};
} )( ImportOptionsControl );
