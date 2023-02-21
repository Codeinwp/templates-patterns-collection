import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import { Button, Flex, FlexItem, Modal, RadioControl, TextareaControl, Spinner, Icon } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { changeOption, fetchOptions } from "./common";

const { version, feedback } = window.tiobDash;

const collectedInfo = [
    {
        name: __( 'Plugin version',  'template-patterns-collection' ),
        value: version
    },
    {
        name: __( 'Feedback Response', 'otter-blocks' ),
        value: __( 'Checked option from feedback', 'template-patterns-collection' )
    },
    {
        name: __( 'Feedback Details', 'otter-blocks' ),
        value: __( 'Text from the above text area', 'template-patterns-collection' )
    }
];

const feedbackStatusText = {
    error: __( 'There was a problem submitting your feedback.', 'template-patterns-collection' ),
    emptyFeedback: __( 'Please provide a feedback before submitting the form.', 'template-patterns-collection' ),
    submitted: __( 'Thank you for helping us improve Templates Cloud!', 'template-patterns-collection' ),
};
const FeedbackNotice = ( { importTemplate } ) => {
    const [ isFeedbackOpen, setFeedbackOpen ] = useState( false );
    const [ showInfo, setShowInfo ] = useState( false );
    const [ feedbackResponse, setFeedbackResponse ] = useState( 'store_in_cloud' );
    const [ feedbackDetails, setFeedbackDetails ] = useState( '' );
    const [ feedbackStatus, setFeedbackStatus ] = useState( 'notSubmitted' );

    const [ countImported, setCountImported ] = useState( feedback.count || 0 );
    const [ isDismissed, setIsDismissed ] = useState( feedback.dismissed || false );
    const [ hide, setHide ] = useState( false );

    useEffect( () => {
        const info = document.querySelector( '.tiob_feedback_collect.info' );
        if ( info ) {
            info.style.height = showInfo ? `255px` : '0';
        }

    }, [ showInfo, isFeedbackOpen ]);

    const updateOptionState = () => {
        fetchOptions().then((r) => {
            if ( r['tiob_premade_imported'] !== undefined ) {
                setCountImported( r['tiob_premade_imported'] );
            }
            if ( r['tiob_feedback_dismiss'] !== undefined ) {
                setIsDismissed( r['tiob_feedback_dismiss'] );
            }
        });
    }

    useEffect( () => {
        updateOptionState();
    }, [ importTemplate ] );

    const openModal = () => setFeedbackOpen( true );
    const closeModal = () => setFeedbackOpen( false );

    const dismissFeedback = () => {
        changeOption( 'tiob_feedback_dismiss', true );
    }

    const submitFeedback = () => {
        if ( feedbackResponse === 'other' && 5 >= feedbackDetails.trim().length ) {
            setFeedbackStatus( 'emptyFeedback' );
            return;
        }

        let feedback = feedbackDetails.trim();
        if ( feedbackResponse !== 'other') {
            feedback = feedbackResponse;
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
                    version: version,
                    feedback: feedback,
                    data: {
                        'feedback-area': 'template-patterns-collection-page-templates',
                        'feedback-option': feedbackResponse
                    }
                })
            }).then( r => {
                if ( ! r.ok ) {
                    setFeedbackStatus( 'error' );
                    closeModal();
                    return;
                }

                setFeedbackStatus( 'submitted' );
                dismissFeedback();
                closeModal();
            })?.catch( ( error ) => {
                console.warn( error.message );
                setFeedbackStatus( 'error' );
                closeModal();
            });
        } catch ( error ) {
            console.warn( error.message );
            setFeedbackStatus( 'error' );
            closeModal();
        }
    };

    return (
        <>
            { countImported >= 4 && ! isDismissed && ! hide && (
                <Flex className="tiob-feedback-notice" justify="right">
                    <Flex
                        className={ classnames({
                            'tiob-notice': true,
                            'error': 'error' === feedbackStatus,
                            'updated': 'submitted' === feedbackStatus,
                        }) }
                        justify="right">
                        { 'submitted' === feedbackStatus && (
                            <FlexItem>
                                <Icon icon="saved" />
                            </FlexItem>
                        ) }
                        <FlexItem>
                            <p>{ ( ['error', 'submitted'].includes( feedbackStatus ) ) ? feedbackStatusText[feedbackStatus] : __( 'Help us improve and let us know how are you using Templates Cloud.', 'template-patterns-collection' ) }</p>
                        </FlexItem>
                        <FlexItem>
                            { 'error' === feedbackStatus && (
                                <Button
                                    isLink
                                    className="error"
                                    onClick={openModal}
                                >
                                    { __( 'Try again', 'template-patterns-collection' ) }
                                </Button>
                            ) }
                            { ! ['error', 'submitted'].includes( feedbackStatus ) && (
                                <Button
                                    isPrimary
                                    onClick={ openModal }
                                >
                                    { __( 'Share feedback', 'template-patterns-collection' ) }
                                </Button>
                            ) }
                        </FlexItem>
                        <FlexItem>
                            <Button
                                isTertiary
                                icon="no-alt"
                                iconSize={20}
                                onClick={ () => {
                                    setHide( true )
                                    if ( feedbackStatus !== 'error' ) {
                                        dismissFeedback();
                                    }
                                } }
                            />
                        </FlexItem>
                    </Flex>
                </Flex>
            ) }
            { isFeedbackOpen && (
                <Modal
                    className="tiob_feedback_modal"
                    title={ __( 'How are you using Templates Cloud?', 'template-patterns-collection' ) }
                    onRequestClose={ closeModal }
                >
                    <RadioControl
                        className="feedback_options"
                        selected={ feedbackResponse }
                        options={ [
                            { label: __( 'To store my templates in the cloud', 'template-patterns-collection' ), value: 'store_in_cloud' },
                            { label: __( 'To share templates with the clients', 'template-patterns-collection' ), value: 'share_with_clients' },
                            { label: __( 'Other', 'template-patterns-collection' ), value: 'other' },
                        ] }
                        onChange={ ( value ) => setFeedbackResponse( value ) }
                    />
                    { feedbackResponse === 'other' && (
                        <TextareaControl
                            className={ classnames({
                                'feedback_details': true,
                                'invalid': 'emptyFeedback' === feedbackStatus,
                            }) }
                            placeholder={ __( 'Tell us more ...', 'template-patterns-collection' ) }
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
                    ) }
                    <div className="tiob_feedback_collect info">
                        <div className="wrapper">
                            <p>{ __( 'We value privacy, that\'s why no domain name, email address or IP addresses are collected after you submit the survey. Below is a detailed view of all data that Themeisle will receive if you fill in this survey.', 'template-patterns-collection' ) }</p>
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
                        direction="column"
                        align="left"
                        justify="start"
                        style={ { height: 'auto' } }
                    >
                        <FlexItem>
                            <Button
                                isPrimary
                                onClick={ submitFeedback }
                                disabled={ 'loading' === feedbackStatus }
                            >
                                { 'loading' === feedbackStatus ? <Spinner /> : __( 'Submit feedback', 'template-patterns-collection' ) }
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
                                { __( 'What info do we collect?', 'template-patterns-collection' ) }
                            </Button>
                        </FlexItem>
                    </Flex>
                </Modal>
            ) }
        </>
    );
};

export default FeedbackNotice;