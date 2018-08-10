/**
 * Child component of Settings/Profile/ renders the
 * 'Hobby' page.
 */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';

import { PrimaryButton } from 'topcoder-react-ui-kit';
import HobbyList from './List';

import './styles.scss';


export default class Hobby extends React.Component {
  constructor(props) {
    super(props);
    this.onDeleteHobby = this.onDeleteHobby.bind(this);
    this.loadHobbyTrait = this.loadHobbyTrait.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onAddHobby = this.onAddHobby.bind(this);

    this.state = {
      formInvalid: false,
      errorMessage: '',
      hobbyTrait: this.loadHobbyTrait(props.userTraits),
      newHobby: {
        hobby: '',
        description: '',
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const hobbyTrait = this.loadHobbyTrait(nextProps.userTraits);
    this.setState({
      hobbyTrait,
      formInvalid: false,
      errorMessage: '',
      newHobby: {
        hobby: '',
        description: '',
      },
    });
  }

  /**
   * Check form fields value,
   * Invalid value, can not save
   * @param newHobby object
   */
  onCheckFormValue(newHobby) {
    let invalid = false;
    let errorMessage = '';

    if (!_.trim(newHobby.hobby).length) {
      errorMessage += 'Hobby, ';
      invalid = true;
    }

    if (!_.trim(newHobby.description).length) {
      errorMessage += 'Description, ';
      invalid = true;
    }

    if (errorMessage.length > 0) {
      errorMessage += ' cannot be empty';
    }

    this.setState({ errorMessage, formInvalid: invalid });
    return invalid;
  }

  /**
   * Delete hobby by index
   * @param indexNo the hobby index no
   */
  onDeleteHobby(indexNo) {
    const { hobbyTrait } = this.state;
    const newHobbyTrait = { ...hobbyTrait };
    newHobbyTrait.traits.data.splice(indexNo, 1);
    this.setState({
      hobbyTrait: newHobbyTrait,
    });

    const {
      handle,
      tokenV3,
      updateUserTrait,
      deleteUserTrait,
    } = this.props;

    if (newHobbyTrait.traits.data.length > 0) {
      updateUserTrait(handle, 'hobby', newHobbyTrait.traits.data, tokenV3, false);
    } else {
      deleteUserTrait(handle, 'hobby', tokenV3);
    }
  }

  /**
   * Add new hobby
   * @param e form submit event
   */
  onAddHobby(e) {
    e.preventDefault();

    const { newHobby } = this.state;

    if (this.onCheckFormValue(newHobby)) {
      return;
    }

    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;

    const { hobbyTrait } = this.state;

    if (hobbyTrait.traits && hobbyTrait.traits.data.length > 0) {
      const newHobbyTrait = { ...hobbyTrait };
      newHobbyTrait.traits.data.push(newHobby);
      this.setState({ hobbyTrait: newHobbyTrait });
      updateUserTrait(handle, 'hobby', newHobbyTrait.traits.data, tokenV3, true);
    } else {
      const newHobbys = [];
      newHobbys.push(newHobby);
      const traits = {
        data: newHobbys,
      };
      this.setState({ hobbyTrait: { traits } });
      addUserTrait(handle, 'hobby', newHobbys, tokenV3, true);
    }
    const empty = {
      hobby: '',
      description: '',
    };
    this.setState({ newHobby: empty });
  }

  /**
   * Update input value
   * @param e event
   */
  onUpdateInput(e) {
    const { newHobby: oldHobby } = this.state;
    const newHobby = { ...oldHobby };
    newHobby[e.target.name] = e.target.value;
    this.setState({ newHobby });
  }

  /**
   * Get hobby trait
   * @param userTraits the all user traits
   */
  loadHobbyTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'hobby');
    const hobbys = trait.length === 0 ? {} : trait[0];
    return _.assign({}, hobbys);
  }

  render() {
    const {
      settingsUI,
    } = this.props;
    const {
      hobbyTrait,
    } = this.state;
    const tabs = settingsUI.TABS.PROFILE;
    const currentTab = settingsUI.currentProfileTab;
    const containerStyle = currentTab === tabs.HOBBY ? '' : 'hide';
    const hobbyItems = hobbyTrait.traits
      ? hobbyTrait.traits.data.slice() : [];
    const { newHobby, formInvalid, errorMessage } = this.state;


    return (
      <div styleName={containerStyle}>
        <div styleName="hobby-container">
          <div styleName={`error-message ${formInvalid ? 'active' : ''}`}>
            { errorMessage }
          </div>
          <h1>
            Hobby
          </h1>
          <div styleName="form-container">
            <form name="hobby-form" noValidate autoComplete="off">
              <div styleName="row">
                <p>
                  Add Hobby
                </p>
              </div>
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="hobby">
                    Hobby
                  </label>
                  <input id="hobby" name="hobby" type="text" placeholder="Hobby" onChange={this.onUpdateInput} value={newHobby.hobby} maxLength="64" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field col-2">
                  <label styleName="desc-label" htmlFor="description">
                    <span>
                      Description
                    </span>
                    <span>
                      {newHobby.description.length}/240
                    </span>
                  </label>
                  <textarea id="description" styleName="desc-text" name="description" placeholder="Description" onChange={this.onUpdateInput} value={newHobby.description} maxLength="240" cols="3" rows="10" required />
                </div>
              </div>
            </form>
            <div styleName="button-save">
              <PrimaryButton
                styleName="complete"
                onClick={this.onAddHobby}
              >
                Add Hobby
              </PrimaryButton>
            </div>
          </div>
          <HobbyList
            hobbyList={{ items: hobbyItems }}
            onDeleteItem={this.onDeleteHobby}
          />
        </div>
      </div>
    );
  }
}

Hobby.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  userTraits: PT.array.isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
  deleteUserTrait: PT.func.isRequired,
  settingsUI: PT.shape().isRequired,
};
