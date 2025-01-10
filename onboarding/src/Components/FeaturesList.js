import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const MAX_FEATURE_LIST_LENGTH = 6;

const decodeHtmlEntities = (str) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = str;
    return textArea.value;
};

/**
 * Product display.
 */
const featuredPluginCollection = [
    { 
        id: 'pageBuilder',
        pluginSlug: 'otter-blocks',
        label: __('Site Builder', 'templates-patterns-collection'),
        description: __('Design pages visually with a drag-and-drop builder', 'templates-patterns-collection')
    },
    { 
        id: 'contactForm',
        pluginSlug: 'otter-blocks',
        label: __('Contact Form', 'templates-patterns-collection'),
        description: __('Create custom contact forms easily', 'templates-patterns-collection')
    },
    {
        id: 'imageOpt',
        pluginSlug: 'optimole-wp',
        label: __('Image Optimization', 'templates-patterns-collection'),
        description: __('Automatically optimize images for better performance', 'templates-patterns-collection')
    },
    {
        id: 'caching',
        pluginSlug: 'wp-cloudflare-page-cache',
        label: __('Caching', 'templates-patterns-collection'),
        description: __('Improve website speed with caching technology', 'templates-patterns-collection')
    },
    { 
        id: 'eCommerce',
        pluginSlug: 'wp-full-stripe-free',
        label: __('eCommerce', 'templates-patterns-collection'),
        description: __('Set up an online store and accept payments', 'templates-patterns-collection'),
    },
    {
        id: 'chatbot',
        pluginSlug: 'hyve-lite',
        label: __('AI ChatBot', 'templates-patterns-collection'),
        description: __('Add intelligent chat functionality to your site', 'templates-patterns-collection')
    },
];

/**
 * Third-party product display. Appears only if they are a part of the required plugins for template site.
 */
const thirdPartyFeaturedPluginCollection = [
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
    }
];

const FeaturesList = ({ requiredPlugins, onToggle }) => {
    const [featureList, setFeatureList] = useState( featuredPluginCollection );

    const [selectedFeatures, setSelectedFeatures] = useState({
        pageBuilder: false,
        contactForm: false,
        eCommerce: false,
        donations: false,
        automation: false,
        salesFunnels: false,
        videoPlayer: false,
        liveChat: false,
    });

    const [lockedPluginSlugs, setLockedPluginSlugs] = useState([]);

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

        const allProductDisplay = [...featuredPluginCollection, ...thirdPartyFeaturedPluginCollection];
        
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
            const additionalFeatures = featuredPluginCollection.filter(
                ({ pluginSlug }) => !orderedFeatures.some(f => f.pluginSlug === pluginSlug)
            );

            const remainingSlots = Math.max(0, MAX_FEATURE_LIST_LENGTH - orderedFeatures.length);
            if (remainingSlots > 0 && additionalFeatures.length > 0) {
                orderedFeatures.push(...additionalFeatures.slice(0, remainingSlots));
            }
        }

        setFeatureList(orderedFeatures);
        setLockedPluginSlugs(requiredPluginSlugs);
    }, [requiredPlugins]);

    return (
        <div className="ob-select-features">
            <div className="ob-features-grid">
                {
                    featureList.map((feature) => {
                        const checked = selectedFeatures[feature.id] || lockedPluginSlugs.includes(feature.pluginSlug);
                        const isLocked = lockedPluginSlugs.includes(feature.pluginSlug);
                        return (
                            <button
                                key={feature.id}
                                className={`ob-feature-card ${
                                    selectedFeatures[feature.id] ? 'selected' : ''
                                } ${isLocked ? 'ob-disabled' : ''}`}
                                onClick={() => toggleFeature(feature.id, feature.pluginSlug)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        toggleFeature(feature.id, feature.pluginSlug);
                                    }
                                }}
                                role="checkbox"
                                aria-checked={checked}
                                disabled={isLocked}
                            >
                                <div className="ob-feature-header" data-plugin={feature.pluginSlug}>
                                    <h4 className="ob-feature-title">{feature.label}</h4>
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        readOnly
                                    />
                                </div>
                                <div className="ob-feature-description">{feature.description}</div>
                            </button>
                        ); 
                    })
                }
            </div>
        </div>
    );
};

export default FeaturesList;