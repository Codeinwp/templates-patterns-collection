import { __ } from '@wordpress/i18n';
import { Button, TextareaControl, Flex, FlexItem, Spinner, ExternalLink } from '@wordpress/components';
import {useEffect, useState} from '@wordpress/element';
import classnames from 'classnames';
import License from '../License';

const Feedback = () => {
    const feedbackStatusText = {
        error: __( 'There was a problem submitting your feedback.', 'templates-patterns-collection' ),
        emptyFeedback: __( 'Please provide a feedback before submitting the form.', 'templates-patterns-collection' ),
        submitted: __( 'Thank you for helping us improve Templates Cloud!', 'templates-patterns-collection' ),
    };

    const { version } = window.tiobDash;

    const collectedInfo = [
        {
            name: __( 'Plugin version',  'templates-patterns-collection' ),
            value: version
        },
        {
            name: __( 'Feedback Details', 'templates-patterns-collection' ),
            value: __( 'Text from the above text area', 'templates-patterns-collection' )
        }
    ];

    const [ showInfo, setShowInfo ] = useState( false );
    const [ feedbackStatus, setFeedbackStatus ] = useState( 'notSubmitted' );
    const [ feedbackDetails, setFeedbackDetails ] = useState( '' );

    const submitFeedback = () => {
        const feedback = feedbackDetails.trim();
        if ( 5 >= feedback.length ) {
            setFeedbackStatus( 'emptyFeedback' );
            return;
        }

        setFeedbackStatus( 'loading' );
        try {
            fetch( 'https://api.themeisle.com/tracking/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json, */*;q=0.1',
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify({
                    slug: 'templates-patterns-collection',
                    version,
                    feedback,
                    data: {
                        'feedback-area': 'template-patterns-collection-page-templates',
                        'feedback-option': 'other'
                    }
                })
            }).then( r => {
                if ( ! r.ok ) {
                    setFeedbackStatus( 'error' );
                    return;
                }

                setFeedbackStatus( 'submitted' );
            })?.catch( ( error ) => {
                console.warn( error.message );
                setFeedbackStatus( 'error' );
            });
        } catch ( error ) {
            console.warn( error.message );
            setFeedbackStatus( 'error' );
        }
    };

    useEffect( () => {
        const info = document.querySelector( '.tiob_feedback_collect.info' );
        if ( info ) {
            info.style.height = showInfo ? '180px' : '0';
        }

    }, [ showInfo ]);

    return (
        <div className="tiob-feedback-form">
            <h3>{ __( 'What\'s one thing you need in Templates Cloud?', 'templates-patterns-collection' ) }</h3>
            <TextareaControl
                className={ classnames({
                    'feedback_details': true,
                    'invalid': 'emptyFeedback' === feedbackStatus,
                }) }
                placeholder={ __( 'Tell us how can we help you better with Templates Cloud', 'templates-patterns-collection' ) }
                value={ feedbackDetails }
                help={ feedbackStatusText[feedbackStatus] || false }
                rows={7}
                cols={50}
                onChange={ value => {
                    setFeedbackDetails( value );
                    if ( 5 < value.trim().length ) {
                        setFeedbackStatus( 'notSubmitted' );
                    }
                } }
            />
            <div className="tiob_feedback_collect info">
                <div className="wrapper">
                    <p>{ __( 'We value privacy, that\'s why no domain name, email address or IP addresses are collected after you submit the survey. Below is a detailed view of all data that Themeisle will receive if you fill in this survey.', 'templates-patterns-collection' ) }</p>
                    { collectedInfo.map( ( row, index ) => {
                        return (
                            <div className="info-row" key={ index }>
                                <p><b>{ row.name }</b></p>
                                <p>{ row.value }</p>
                            </div>
                        );
                    }) }
                </div>
            </div>
            <Flex
                direction="row-reverse"
                align="left"
                justify="space-between"
                style={ { height: 'auto' } }
            >
                <FlexItem>
                    <Button
                        isPrimary
                        onClick={ submitFeedback }
                        disabled={ 'loading' === feedbackStatus }
                    >
                        { 'loading' === feedbackStatus ? <Spinner /> : __( 'Submit feedback', 'templates-patterns-collection' ) }
                    </Button>
                </FlexItem>
                <FlexItem>
                    <Button
                        className="toggle-info"
                        aria-expanded={ showInfo }
                        variant="link"
                        isLink
                        onClick={() => setShowInfo( ! showInfo )}
                    >
                        { __( 'What info do we collect?', 'templates-patterns-collection' ) }
                    </Button>
                </FlexItem>
            </Flex>
        </div>
    );
};
const Settings = () => {

    const [ currentSettingTab, setCurrentSettingTab ] = useState( 'general' );
    const settingsTabs = [
        { id: 'general', label: __( 'General', 'templates-patterns-collection' ) },
        { id: 'feedback', label: __( 'Feedback', 'templates-patterns-collection' ) },
    ];

    const { links } = window.tiobDash;

    useEffect( () => {
        const params = Object.fromEntries(new URLSearchParams(location.search));

        if ( params?.tab && settingsTabs.find( ( tab ) => tab.id === params.tab ) ) {
            setCurrentSettingTab( params.tab );
        }
    }, [] );

    return (
        <div className="tiob-settings">
            <div className="panel">
                <div className="setting-tabs">
                    {
                        settingsTabs.map( ( tab ) => {

                            const classes = classnames( [
                                'tab',
                                { active: tab.id === currentSettingTab },
                            ] );

                            return (
                                <Button
                                    key={ tab.id }
                                    className={ classes }
                                    isLink
                                    onClick={ () => {
                                        setCurrentSettingTab( tab.id );
                                    } }
                                >
                                    { tab.label }
                                </Button>
                            );
                        } )
                    }
                </div>
                <div className="tab-content">
                    {
                        currentSettingTab === 'general' && <License />
                    }
                    {
                        currentSettingTab === 'feedback' && <Feedback />
                    }
                </div>
            </div>
            <div className="panel is-secondary">
                <h3>{ __( 'Useful links', 'templates-patterns-collection' ) }</h3>
                <div className="links">
                    { links && links.map( ( link ) => {
                            const isButton = link?.is_button || false;
                            const isExternal = link?.is_external || false;

                            return (

                                    isButton ? (
                                        <Button
                                            isSecondary
                                            href={ link?.url || '#' }
                                        >
                                            { link?.label || '' }
                                        </Button>
                                    ) : (
                                        isExternal ? (
                                            <ExternalLink
                                                href={ link?.url || '#' }>
                                                { link?.label || '' }
                                            </ExternalLink>
                                        ) : (
                                            <a
                                                href={ link?.url || '#' }
                                                target={ link?.target || '_blank' }
                                            >
                                                { link?.label || '' }
                                            </a>
                                        )
                                    )
                            );
                        } )
                    }
                </div>
            </div>
        </div>
    );
};

export default Settings;
