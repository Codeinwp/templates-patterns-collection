import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const decodeHtmlEntities = (str) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = str;
    return textArea.value;
};

const featureCollection = [
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

const FeaturesList = ({ requiredPlugins, onToggle }) => {
    const [featureList, setFeatureList] = useState( featureCollection );

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
                featureCollection.filter( i => pluginSlug === i.pluginSlug && feature !== i.id ).map(({ id }) => selectedFeatures[id]).every(i => false === i )
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
        
        const missingRequiredPlugins = Object.entries(requiredPlugins ?? {})
        .filter(([slug]) => featureCollection.every(({ pluginSlug }) => slug !== pluginSlug))
        .map(([slug, label]) => {
            const decodedLabel = decodeHtmlEntities(label);
            return {
                id: slug,
                pluginSlug: slug,
                label: decodedLabel || '',
                description: ''
            };
        });
        
        const orderedFeatures = [
            ...missingRequiredPlugins,
            ...featureCollection.filter(feature => requiredPluginSlugs.includes(feature.pluginSlug)),
            ...featureCollection.filter(feature => !requiredPluginSlugs.includes(feature.pluginSlug))
        ].slice(0, 6);
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
                                <div className="ob-feature-header">
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