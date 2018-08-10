/**
 * Child component of Settings/Profile/ renders the
 * 'Language' page.
 */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';

import Select from 'components/Select';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import dropdowns from './dropdowns.json';
import LanguageList from './List';

import './styles.scss';


export default class Language extends React.Component {
  constructor(props) {
    super(props);
    this.onDeleteLanguage = this.onDeleteLanguage.bind(this);
    this.onUpdateSelect = this.onUpdateSelect.bind(this);
    this.loadLanguageTrait = this.loadLanguageTrait.bind(this);
    this.onAddLanguage = this.onAddLanguage.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);

    this.state = {
      formInvalid: false,
      errorMessage: '',
      languageTrait: this.loadLanguageTrait(props.userTraits),
      newLanguage: {
        language: '',
        spokenLevel: '',
        writtenLevel: '',
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const languageTrait = this.loadLanguageTrait(nextProps.userTraits);
    this.setState({
      languageTrait,
      formInvalid: false,
      errorMessage: '',
      newLanguage: {
        language: '',
        spokenLevel: '',
        writtenLevel: '',
      },
    });
  }

  /**
   * Update input value
   * @param e event
   */
  onUpdateInput(e) {
    const { newLanguage: oldLanguage } = this.state;
    const newLanguage = { ...oldLanguage };
    newLanguage[e.target.name] = e.target.value.trim();
    this.setState({ newLanguage });
  }


  /**
   * Check form fields value,
   * Invalid value, can not save
   * @param newLanguage object
   */
  onCheckFormValue(newLanguage) {
    let invalid = false;

    let errorMessage = '';
    if (!_.trim(newLanguage.language).length) {
      errorMessage += 'Language, ';
      invalid = true;
    }

    if (!_.trim(newLanguage.spokenLevel).length) {
      errorMessage += 'Spoken level, ';
      invalid = true;
    }

    if (!_.trim(newLanguage.writtenLevel).length) {
      errorMessage += 'Written level, ';
      invalid = true;
    }

    if (errorMessage.length > 0) {
      errorMessage += ' cannot be empty';
    }

    const { languageTrait } = this.state;
    const result = _.filter(languageTrait.traits.data, item => (
      item.language.toLowerCase() === newLanguage.language.toLowerCase()
    ));
    if (result && result.length > 0) {
      invalid = true;
      errorMessage += errorMessage.length > 0 ? `. Language ${newLanguage.language} has been already added.` : `Language ${newLanguage.language} has been already added.`;
    }

    this.setState({ errorMessage, formInvalid: invalid });
    return invalid;
  }

  /**
   * Delete language by index
   * @param indexNo the language index no
   */
  onDeleteLanguage(indexNo) {
    const { languageTrait } = this.state;
    const newLanguageTrait = { ...languageTrait };
    newLanguageTrait.traits.data.splice(indexNo, 1);
    this.setState({
      languageTrait: newLanguageTrait,
    });

    const {
      handle,
      tokenV3,
      updateUserTrait,
      deleteUserTrait,
    } = this.props;

    if (newLanguageTrait.traits.data.length > 0) {
      updateUserTrait(handle, 'languages', newLanguageTrait.traits.data, tokenV3, false);
    } else {
      deleteUserTrait(handle, 'languages', tokenV3);
    }
  }

  /**
   * Add new language
   * @param e form submit event
   */
  onAddLanguage(e) {
    e.preventDefault();
    const { newLanguage } = this.state;
    if (this.onCheckFormValue(newLanguage)) {
      return;
    }
    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;
    const { languageTrait } = this.state;
    if (languageTrait.traits && languageTrait.traits.data.length > 0) {
      const newLanguageTrait = { ...languageTrait };
      newLanguageTrait.traits.data.push(newLanguage);
      this.setState({ languageTrait: newLanguageTrait });
      updateUserTrait(handle, 'languages', newLanguageTrait.traits.data, tokenV3, true);
    } else {
      const newLanguages = [];
      newLanguages.push(newLanguage);
      const traits = {
        data: newLanguages,
      };
      this.setState({ languageTrait: { traits } });
      addUserTrait(handle, 'languages', newLanguages, tokenV3, true);
    }
    const empty = {
      language: '',
      spokenLevel: '',
      writtenLevel: '',
    };
    this.setState({ newLanguage: empty });
  }

  /**
   * Update select value
   * @param option selected value
   */
  onUpdateSelect(option) {
    if (option) {
      const { newLanguage: oldLanguage } = this.state;
      const newLanguage = { ...oldLanguage };
      newLanguage[option.key] = option.name;
      this.setState({ newLanguage });
    }
  }

  /**
   * Get language trait
   * @param userTraits the all user traits
   */
  loadLanguageTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'languages');
    const languages = trait.length === 0 ? {} : trait[0];
    return _.assign({}, languages);
  }

  render() {
    const {
      settingsUI,
    } = this.props;
    const {
      languageTrait,
    } = this.state;
    const tabs = settingsUI.TABS.PROFILE;
    const currentTab = settingsUI.currentProfileTab;
    const containerStyle = currentTab === tabs.LANGUAGE ? '' : 'hide';
    const languageItems = languageTrait.traits
      ? languageTrait.traits.data.slice() : [];
    const { newLanguage, formInvalid, errorMessage } = this.state;

    return (
      <div styleName={containerStyle}>
        <div styleName="language-container">
          <div styleName={`error-message ${formInvalid ? 'active' : ''}`}>
            { errorMessage }
          </div>
          <h1>
            Language
          </h1>
          <div styleName="form-container">
            <form name="language-form" noValidate autoComplete="off">
              <div styleName="row">
                <p>
                  Add Language
                </p>
              </div>
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="language">
                    Language
                  </label>
                  <input id="language" name="language" type="text" placeholder="Language" onChange={this.onUpdateInput} value={newLanguage.language} maxLength="300" required />
                </div>
                <div styleName="field col-2">
                  <label htmlFor="spokenLevel">
                    Spoken Level
                  </label>
                  <Select
                    name="spokenLevel"
                    options={dropdowns.spokenLevel}
                    onChange={this.onUpdateSelect}
                    value={newLanguage.spokenLevel}
                    placeholder="Spoken level"
                    labelKey="name"
                    valueKey="name"
                    clearable={false}
                  />
                </div>
                <div styleName="field col-2">
                  <label htmlFor="writtenLevel">
                    Written Level
                  </label>
                  <Select
                    name="writtenLevel"
                    options={dropdowns.writtenLevel}
                    onChange={this.onUpdateSelect}
                    value={newLanguage.writtenLevel}
                    placeholder="Written level"
                    labelKey="name"
                    valueKey="name"
                    clearable={false}
                  />
                </div>
              </div>
            </form>
            <div styleName="button-save">
              <PrimaryButton
                styleName="complete"
                onClick={this.onAddLanguage}
              >
                Add Language
              </PrimaryButton>
            </div>
          </div>
          <LanguageList
            languageList={{ items: languageItems }}
            onDeleteItem={this.onDeleteLanguage}
          />
        </div>
      </div>
    );
  }
}

Language.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  userTraits: PT.array.isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
  deleteUserTrait: PT.func.isRequired,
  settingsUI: PT.shape().isRequired,
};
