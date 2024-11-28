import {__} from '@wordpress/i18n';
import {Button} from '@wordpress/components';
import {close} from '@wordpress/icons';
import {useState} from '@wordpress/element';
import {ajaxAction} from '../utils/rest';

export default function () {
  const [isVisible, setIsVisible] = useState(true);

  const {
    show,
    ajaxURL,
    nonce
  } = window.tiobDash.newTCNotice;

  const dismissNotice = () => {
    ajaxAction(
        ajaxURL,
        'dismiss_new_tc_notice',
        nonce
    ).then( (r) => {
      console.log(r);
        setIsVisible(false);
    } ).catch(e => {
        console.error(e);
    } );
  };

  if (!show || ! isVisible) {
    return null;
  }

  return (
      <div className="tiob-new-tc-notice">
        <div>
        <p>
          {__('We\'ve launched a dedicated Templates Cloud plugin that offers advanced permission controls and additional features. Try it out from your Themeisle account.', 'templates-patterns-collection')}
        </p>

        <p className="description">
          {__('If you already have templates saved in the cloud, you can still use them in this plugin.', 'templates-patterns-collection')}
        </p>
        </div>

        <Button
            size="compact"
            className="dismiss"
            icon={close}
            iconSize={20}
            label={__('Dismiss', 'templates-patterns-collection')}
            onClick={dismissNotice}
        />
      </div>
  );
}