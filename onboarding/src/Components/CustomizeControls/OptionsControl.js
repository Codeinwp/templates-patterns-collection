import { __, sprintf } from '@wordpress/i18n';
import { createInterpolateElement, useState } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import classnames from 'classnames';
import CustomTooltip from '../CustomTooltip';
import {
	Icon,
	Button,
	PanelRow,
	ToggleControl,
} from '@wordpress/components';

const Options = ( { isCleanupAllowed, themeData } ) => {
	const [ optionsOpened, setOptionsOpened ] = useState( false );
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
				'Enable performance features for my site',
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
		<div className="ob-control type-options">
			<div
				className={ classnames(
					'site-options-container',
					optionsOpened ? 'is-opened' : ''
				) }
			>
				<Button
					onClick={ toggleOpen }
					className="site-options-toggle"
				>
					{ __( 'Import settings', 'templates-patterns-collection' ) }
				</Button>
				{ Object.keys( map ).map( ( id, index ) => {
					const rowClass = classnames( 'option-row', {
						active: general[ id ],
					} );
					const { icon, title, tooltip } = map[ id ];

					return (
						<PanelRow className={ rowClass } key={ index }>
							<Icon icon={ icon } />
							<span>{ title }</span>
							{ tooltip && (
								<CustomTooltip
									toLeft={
										id === 'performanceAddon' ||
										id === 'cleanup'
									}
									rightOffset={ id === 'cleanup' ? -90 : 0 }
								>
									{ tooltip }
								</CustomTooltip>
							) }
							{ id !== 'theme_install' && (
								<div className="toggle-wrapper">
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
						</PanelRow>
					);
				} ) }
			</div>
		</div>
	);
};

export default withSelect( ( select ) => {
	const { getThemeAction } = select( 'ti-onboarding' );
	return {
		themeData: getThemeAction() || false,
	};
} )( Options );
