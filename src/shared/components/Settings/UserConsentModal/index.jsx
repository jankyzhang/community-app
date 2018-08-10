/**
 * User Consent Modal Component.  Displays User Consent.
 */
import React from 'react';
import PT from 'prop-types';

import Modal from 'components/Modal';
import { PrimaryButton } from 'topcoder-react-ui-kit';

import style from './style.scss';

export default function UserConsentModal(props) {
  const {
    addUserTrait,
    handle,
    tokenV3,
    updateUserTrait,
    userTraits,
    updateModalOpen,
  } = props;

  const getTraitData = () => {
    const trait = userTraits.filter(t => t.traitId === 'personalization');
    if (trait.length !== 0) {
      return trait[0].traits.data[0];
    }
    return null;
  };

  const updateConsent = (tmpValue) => {
    const traitData = getTraitData();

    // personalization data might not have been created yet; if so, add new trait
    if (traitData && typeof traitData.userConsent === 'boolean' && traitData.userConsent !== tmpValue) {
      const personalizationData = { userConsent: tmpValue };
      updateUserTrait(handle, 'personalization', [personalizationData], tokenV3, true);
    } else if (!traitData) {
      // add new trait for User Consent
      const personalizationData = { userConsent: tmpValue };
      addUserTrait(handle, 'personalization', [personalizationData], tokenV3, true);
    } else if (traitData.userConsent === tmpValue) {
      // just close the User Consent Modal
      updateModalOpen();
    }
  };

  return (
    <Modal theme={{
      container: style.container,
    }}
    >
      <div styleName="style.userConsent">
        <div styleName="style.userConsentMsg">
          <p styleName="style.msgTitle">
            Topcoder would like to use your information for to make your experience more personal.
          </p>
          <p>
            You can opt out from personalisation any time in the
            future in at Preferences &gt; Personalization.
          </p>
        </div>
        <div styleName="style.buttons">
          <PrimaryButton
            theme={{
              button: style.btnDefy,
            }}
            onClick={() => updateConsent(false)}
          >
  Don&acute;t allow
          </PrimaryButton>
          <PrimaryButton
            theme={{ button: style.btnOk }}
            onClick={() => updateConsent(true)}
          >
  OK
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}

UserConsentModal.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  userTraits: PT.arrayOf(PT.shape()).isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
  updateModalOpen: PT.func.isRequired,
};
