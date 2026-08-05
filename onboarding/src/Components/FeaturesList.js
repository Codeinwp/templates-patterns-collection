import { useState, useEffect, useLayoutEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { decodeHtmlEntities } from '../utils/common';

const MAX_FEATURE_LIST_LENGTH = 6;

/**
 * Plugins to promote.
 */
const featuredPluginCollection = [
    { 
        id: 'pageBuilder',
        pluginSlug: 'otter-blocks',
        label: __('Site Builder', 'templates-patterns-collection'),
        description: __('Build pages and forms with Otter.', 'templates-patterns-collection')
    },
    {
        id: 'imageOpt',
        pluginSlug: 'optimole-wp',
        label: __('Image Optimization', 'templates-patterns-collection'),
        description: __('Make your site faster with automatic image optimization.', 'templates-patterns-collection')
    },
    {
        id: 'caching',
        pluginSlug: 'wp-cloudflare-page-cache',
        label: __('Caching', 'templates-patterns-collection'),
        description: __('Supercharge your site’s speed with powerful caching.', 'templates-patterns-collection')
    },
    { 
        id: 'eCommerce',
        pluginSlug: 'wp-full-stripe-free',
        label: __('eCommerce', 'templates-patterns-collection'),
        description: __('Set up your store and start accepting payments via Stripe.', 'templates-patterns-collection'),
    },
    {
        id: 'chatbot',
        pluginSlug: 'hyve-lite',
        label: __('AI ChatBot', 'templates-patterns-collection'),
        description: __('Keep visitors engaged with an intelligent AI chatbot.', 'templates-patterns-collection'),
    }
];

/**
 * Appears only if they are a part of the required plugins for template site.
 */
const pluginCollection = [
    {
        id: 'visualizer',
        pluginSlug: 'visualizer',
        label: __('Tables and Chart', 'templates-patterns-collection'),
        description: __('A powerful and easy to use plugin for responsive charts & tables.', 'templates-patterns-collection')
    },
    {
        id: 'woocommerce',
        pluginSlug: 'woocommerce',
        label: __('WooCommerce', 'templates-patterns-collection'),
        description: __('Build any commerce solution you can imagine.', 'templates-patterns-collection')
    },
    {
        id: 'easy-digital-downloads',
        pluginSlug: 'easy-digital-downloads',
        label: __('Easy Digital Downloads', 'templates-patterns-collection'),
        description: __('Sell digital products with ease and manage your online store efficiently.', 'templates-patterns-collection')
    },
    {
        id: 'edd-blocks',
        pluginSlug: 'edd-blocks',
        label: __('EDD Blocks', 'templates-patterns-collection'),
        description: __('Easily display Easy Digital Downloads products in Gutenberg Editor.', 'templates-patterns-collection')
    },
    {
        id: 'recipe-card-blocks-by-wpzoom',
        pluginSlug: 'recipe-card-blocks-by-wpzoom',
        label: __('Recipe Card Blocks', 'templates-patterns-collection'),
        description: __('Easily create and share mouthwatering recipes.', 'templates-patterns-collection')
    },
    {
        id: 'ameliabooking',
        pluginSlug: 'ameliabooking',
        label: __('Amelia', 'templates-patterns-collection'),
        description: __('Booking system for appointments and event booking.', 'templates-patterns-collection')
    },
    {
        id: 'estatik',
        pluginSlug: 'estatik',
        label: __('Estatik', 'templates-patterns-collection'),
        description: __('Full-featured WordPress real estate plugin.', 'templates-patterns-collection')
    },
    {
        id: 'wp-job-openings',
        pluginSlug: 'wp-job-openings',
        label: __('WP Job Openings', 'templates-patterns-collection'),
        description: __('Plugin for setting up a job listing page for your WordPress website.', 'templates-patterns-collection')
    },
    {
        id: 'pods',
        pluginSlug: 'pods',
        label: __('Pods', 'templates-patterns-collection'),
        description: __('A framework for creating, managing, and deploying customized content types and fields for any project.', 'templates-patterns-collection')
    },
    {
        id: 'restrict-content',
        pluginSlug: 'restrict-content',
        label: __('Membership Plugin', 'templates-patterns-collection'),
        description: __('Membership plugin that allows you to monetize content access.', 'templates-patterns-collection')
    },
    {
        id: 'learning-management-system',
        pluginSlug: 'learning-management-system',
        label: __('Masteriyo', 'templates-patterns-collection'),
        description: __('Create and sell online courses with ease.', 'templates-patterns-collection')
    }
];

const FeaturesList = ({ requiredPlugins, onToggle }) => {
    const [featureList, setFeatureList] = useState( featuredPluginCollection );

    const [selectedFeatures, setSelectedFeatures] = useState({
        pageBuilder: false,
        eCommerce: false,
        donations: false,
        automation: false,
        salesFunnels: false,
        videoPlayer: false,
        liveChat: false,
    });

    const [lockedPluginSlugs, setLockedPluginSlugs] = useState([]);
    const [expandedFeatures, setExpandedFeatures] = useState({});

    const gridRef = useRef(null);
    const autoFitApplied = useRef(false);

    const toggleExpanded = (feature) => {
        // Any manual toggle takes over from the automatic fit.
        autoFitApplied.current = true;
        setExpandedFeatures((prev) => ({
            ...prev,
            [feature]: !prev[feature],
        }));
    };

    const toggleFeature = (feature, pluginSlug) => {
        if (lockedPluginSlugs.includes(pluginSlug)) {
            return;
        }

        const newStatus = !selectedFeatures[feature];
        if (
            newStatus || (
                // Do not disable the plugin installation if another feature that requires it is active.
                false === newStatus &&
                featuredPluginCollection.filter( i => pluginSlug === i.pluginSlug && feature !== i.id ).map(({ id }) => selectedFeatures[id]).every(i => false === i )
            )
        ) {
            onToggle(pluginSlug, newStatus);
        }
        setSelectedFeatures((prev) => ({
            ...prev,
            [feature]: !prev[feature],
        }));
    };
    
    useEffect(() => {
        const requiredPluginSlugs = Object.keys(requiredPlugins ?? {});

        const compatibleFeaturedPlugins = featuredPluginCollection.filter(feature => 
            window.tiobDash?.onboardingPluginCompatibility?.[feature.pluginSlug] !== false
        );

        const allProductDisplay = [...compatibleFeaturedPlugins, ...pluginCollection];
        
        const missingRequiredPlugins = Object.entries(requiredPlugins ?? {})
        .filter(([slug]) => allProductDisplay.every(({ pluginSlug }) => slug !== pluginSlug))
        .map(([slug, label]) => {
            const decodedLabel = decodeHtmlEntities(label);
            return {
                id: slug,
                pluginSlug: slug,
                label: decodedLabel || '',
                description: ''
            };
        });
        
        const requiredProducts = allProductDisplay.filter(({ pluginSlug }) => 
            requiredPluginSlugs.includes(pluginSlug)
        );

        const orderedFeatures = [
            ...requiredProducts,
            ...missingRequiredPlugins
        ];

        if (orderedFeatures.length < MAX_FEATURE_LIST_LENGTH) {
            const additionalFeatures = compatibleFeaturedPlugins.filter(
                ({ pluginSlug }) => !orderedFeatures.some(f => f.pluginSlug === pluginSlug)
            );

            const remainingSlots = Math.max(0, MAX_FEATURE_LIST_LENGTH - orderedFeatures.length);
            if (remainingSlots > 0 && additionalFeatures.length > 0) {
                orderedFeatures.push(...additionalFeatures.slice(0, remainingSlots));
            }
        }

        setFeatureList(orderedFeatures);
        setLockedPluginSlugs(requiredPluginSlugs);
        setExpandedFeatures(
            Object.fromEntries(orderedFeatures.map(({ id }) => [id, true]))
        );
        autoFitApplied.current = false;
    }, [requiredPlugins]);

    // Descriptions start open and collapse only if the list would run past the footer.
    // Selected features give up their description first, since unselected ones still need the pitch.
    useLayoutEffect(() => {
        if (autoFitApplied.current || !gridRef.current || 0 === featureList.length) {
            return;
        }
        autoFitApplied.current = true;

        const footer = document.querySelector('.ob-settings-bottom');
        const limit = window.innerHeight - (footer ? footer.offsetHeight : 0);
        const overflow = gridRef.current.getBoundingClientRect().bottom - limit;

        if (overflow <= 0) {
            return;
        }

        const heightOf = (id) => {
            const description = gridRef.current.querySelector(`#ob-feature-desc-${id}`);
            if (!description || description.hidden) {
                return 0;
            }
            return description.offsetHeight + parseFloat(window.getComputedStyle(description).marginTop || 0);
        };

        const isSelected = ({ id, pluginSlug }) => selectedFeatures[id] || lockedPluginSlugs.includes(pluginSlug);
        const reclaimed = featureList.filter(isSelected).reduce((total, { id }) => total + heightOf(id), 0);

        setExpandedFeatures(
            reclaimed >= overflow
                ? Object.fromEntries(featureList.filter((feature) => !isSelected(feature)).map(({ id }) => [id, true]))
                : {}
        );
    }, [featureList]);

    return (
        <div className="ob-select-features">
            <div className="ob-features-grid" ref={gridRef}>
                {
                    featureList.map((feature) => {
                        const checked = selectedFeatures[feature.id] || lockedPluginSlugs.includes(feature.pluginSlug);
                        const isLocked = lockedPluginSlugs.includes(feature.pluginSlug);
                        const isExpanded = Boolean(expandedFeatures[feature.id]);
                        const titleId = `ob-feature-title-${feature.id}`;
                        const descriptionId = `ob-feature-desc-${feature.id}`;
                        return (
                            <div
                                key={feature.id}
                                className={`ob-feature-card ${
                                    checked ? 'selected' : ''
                                } ${isLocked ? 'ob-disabled' : ''}`}
                            >
                                <div className="ob-feature-header" data-plugin={feature.pluginSlug}>
                                    <button
                                        type="button"
                                        className="ob-feature-select"
                                        onClick={() => toggleFeature(feature.id, feature.pluginSlug)}
                                        role="checkbox"
                                        aria-checked={checked}
                                        disabled={isLocked}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            readOnly
                                            tabIndex={-1}
                                        />
                                        <h4 className="ob-feature-title" id={titleId}>{feature.label}</h4>
                                    </button>
                                    {feature.description && (
                                        <button
                                            type="button"
                                            className="ob-feature-expand"
                                            onClick={() => toggleExpanded(feature.id)}
                                            aria-expanded={isExpanded}
                                            aria-controls={descriptionId}
                                            aria-labelledby={titleId}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                                                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                {feature.description && (
                                    <div
                                        className="ob-feature-description"
                                        id={descriptionId}
                                        hidden={!isExpanded}
                                    >
                                        {feature.description}
                                    </div>
                                )}
                            </div>
                        ); 
                    })
                }
            </div>
        </div>
    );
};

export default FeaturesList;