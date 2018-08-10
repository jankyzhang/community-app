/**
 * Child component of Settings/Profile/ renders the
 * 'Organization' page.
 */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';

import { PrimaryButton } from 'topcoder-react-ui-kit';
import OrganizationList from './List';

import './styles.scss';

export default class Organization extends React.Component {
  constructor(props) {
    super(props);
    this.onDeleteOrganization = this.onDeleteOrganization.bind(this);
    this.loadOrganizationTrait = this.loadOrganizationTrait.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onAddOrganization = this.onAddOrganization.bind(this);

    this.state = {
      formInvalid: false,
      errorMessage: '',
      organizationTrait: this.loadOrganizationTrait(props.userTraits),
      newOrganization: {
        name: '',
        sector: '',
        city: '',
        timePeriodFrom: '',
        timePeriodTo: '',
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const organizationTrait = this.loadOrganizationTrait(nextProps.userTraits);
    this.setState({
      organizationTrait,
      formInvalid: false,
      errorMessage: '',
      newOrganization: {
        name: '',
        sector: '',
        city: '',
        timePeriodFrom: '',
        timePeriodTo: '',
      },
    });
  }

  /**
   * Check form fields value,
   * Invalid value, can not save
   * @param newOrganization object
   */
  onCheckFormValue(newOrganization) {
    let invalid = false;
    let dateInvalid = false;
    let errorMessage = '';
    let dateCount = 0;
    let dateError = '';
    let haveDate = false;

    if (!_.trim(newOrganization.name).length) {
      errorMessage += 'Organization Name, ';
      invalid = true;
    }

    if (!_.trim(newOrganization.sector).length) {
      errorMessage += 'Sector, ';
      invalid = true;
    }

    if (!_.trim(newOrganization.city).length) {
      errorMessage += 'City, ';
      invalid = true;
    }

    if (errorMessage.length > 0) {
      errorMessage += ' cannot be empty';
    }

    const fromDate = new Date(newOrganization.timePeriodFrom).getTime();
    const toDate = new Date(newOrganization.timePeriodTo).getTime();

    if (fromDate > toDate) {
      dateError += 'From Date value should be smaller than To Date value. ';
      dateInvalid = true;
      haveDate = true;
    }

    if (!haveDate) {
      if (!_.trim(newOrganization.timePeriodFrom).length) {
        dateError += 'From Date, ';
        dateInvalid = true;
        dateCount += 1;
      }

      if (!_.trim(newOrganization.timePeriodTo).length) {
        dateError += 'To Date, ';
        dateInvalid = true;
        dateCount += 1;
      }
      if (dateError.length > 0) {
        dateError = `The ${dateError} ${dateCount > 1 ? 'are' : 'is'} incomplete or ${dateCount > 1 ? 'have' : 'has'} an invalid date.`;
      }
    }


    if (errorMessage.length > 0) {
      errorMessage = `${errorMessage}. ${dateError}`;
    } else if (dateError.length > 0) {
      errorMessage = dateError;
      invalid = dateInvalid;
    }

    this.setState({ errorMessage, formInvalid: invalid });
    return invalid;
  }

  /**
   * Delete organization by index
   * @param indexNo the organization index no
   */
  onDeleteOrganization(indexNo) {
    const { organizationTrait } = this.state;
    const newOrganizationTrait = { ...organizationTrait };
    newOrganizationTrait.traits.data.splice(indexNo, 1);
    this.setState({
      organizationTrait: newOrganizationTrait,
    });

    const {
      handle,
      tokenV3,
      updateUserTrait,
      deleteUserTrait,
    } = this.props;

    if (newOrganizationTrait.traits.data.length > 0) {
      updateUserTrait(handle, 'organization', newOrganizationTrait.traits.data, tokenV3, false);
    } else {
      deleteUserTrait(handle, 'organization', tokenV3);
    }
  }

  /**
   * Add new organization
   * @param e form submit event
   */
  onAddOrganization(e) {
    e.preventDefault();

    const { newOrganization } = this.state;

    if (this.onCheckFormValue(newOrganization)) {
      return;
    }

    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;

    const { organizationTrait } = this.state;

    newOrganization.timePeriodFrom = new Date(newOrganization.timePeriodFrom).getTime();
    newOrganization.timePeriodTo = new Date(newOrganization.timePeriodTo).getTime();

    if (organizationTrait.traits && organizationTrait.traits.data.length > 0) {
      const newOrganizationTrait = { ...organizationTrait };
      newOrganizationTrait.traits.data.push(newOrganization);
      this.setState({ organizationTrait: newOrganizationTrait });
      updateUserTrait(handle, 'organization', newOrganizationTrait.traits.data, tokenV3, true);
    } else {
      const newOrganizations = [];
      newOrganizations.push(newOrganization);
      const traits = {
        data: newOrganizations,
      };
      this.setState({ organizationTrait: { traits } });
      addUserTrait(handle, 'organization', newOrganizations, tokenV3, true);
    }
    const empty = {
      name: '',
      sector: '',
      city: '',
      timePeriodFrom: '',
      timePeriodTo: '',
    };
    this.setState({ newOrganization: empty });
  }

  /**
   * Update input value
   * @param e event
   */
  onUpdateInput(e) {
    const { newOrganization: oldOrganization } = this.state;
    const newOrganization = { ...oldOrganization };
    newOrganization[e.target.name] = e.target.value;
    this.setState({ newOrganization });
  }

  /**
   * Get organization trait
   * @param userTraits the all user traits
   */
  loadOrganizationTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'organization');
    const organizations = trait.length === 0 ? {} : trait[0];
    return _.assign({}, organizations);
  }

  render() {
    const {
      settingsUI,
    } = this.props;
    const {
      organizationTrait,
    } = this.state;
    const tabs = settingsUI.TABS.PROFILE;
    const currentTab = settingsUI.currentProfileTab;
    const containerStyle = currentTab === tabs.ORGANIZATION ? '' : 'hide';
    const organizationItems = organizationTrait.traits
      ? organizationTrait.traits.data.slice() : [];
    const { newOrganization, formInvalid, errorMessage } = this.state;


    return (
      <div styleName={containerStyle}>
        <div styleName="organization-container">
          <div styleName={`error-message ${formInvalid ? 'active' : ''}`}>
            { errorMessage }
          </div>
          <h1>
            Organization
          </h1>
          <div styleName="form-container">
            <form name="organization-form" noValidate autoComplete="off">
              <div styleName="row">
                <p>
                  Add Organization
                </p>
              </div>
              <div styleName="row">
                <div styleName="field col-1">
                  <label htmlFor="name">
                    Organization Name
                  </label>
                  <input id="name" name="name" type="text" placeholder="Organization Name" onChange={this.onUpdateInput} value={newOrganization.name} maxLength="128" required />
                </div>
                <div styleName="field col-2">
                  <label htmlFor="sector">
                    Sector
                  </label>
                  <input id="sector" name="sector" type="text" placeholder="Sector" onChange={this.onUpdateInput} value={newOrganization.sector} maxLength="64" required />
                </div>
              </div>
              <div styleName="row">
                <div styleName="field col-city">
                  <label htmlFor="city">
                    City
                  </label>
                  <input id="city" name="city" type="text" placeholder="City" onChange={this.onUpdateInput} value={newOrganization.city} maxLength="64" required />
                </div>
                <div styleName="field col-date">
                  <label htmlFor="timePeriodFrom">
                    From
                  </label>
                  <input id="timePeriodFrom" styleName="date-input" name="timePeriodFrom" type="date" onChange={this.onUpdateInput} value={newOrganization.timePeriodFrom} required />
                </div>
                <div styleName="field col-date">
                  <label htmlFor="timePeriodTo">
                    To
                  </label>
                  <input id="timePeriodTo" styleName="date-input" name="timePeriodTo" type="date" onChange={this.onUpdateInput} value={newOrganization.timePeriodTo} required />
                </div>
              </div>
            </form>
            <div styleName="button-save">
              <PrimaryButton
                styleName="complete"
                onClick={this.onAddOrganization}
              >
                Add Organization
              </PrimaryButton>
            </div>
          </div>
          <OrganizationList
            organizationList={{ items: organizationItems }}
            onDeleteItem={this.onDeleteOrganization}
          />
        </div>
      </div>
    );
  }
}

Organization.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  userTraits: PT.array.isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
  deleteUserTrait: PT.func.isRequired,
  settingsUI: PT.shape().isRequired,
};
