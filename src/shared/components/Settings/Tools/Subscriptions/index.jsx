/**
 * Child component of Settings/Tools/ renders the
 * 'Subscription' page.
 */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';

import { PrimaryButton } from 'topcoder-react-ui-kit';
import SubscriptionList from './List';

import './styles.scss';


export default class Subscription extends React.Component {
  constructor(props) {
    super(props);
    this.onDeleteSubscription = this.onDeleteSubscription.bind(this);
    this.onUpdateSelect = this.onUpdateSelect.bind(this);
    this.loadSubscriptionTrait = this.loadSubscriptionTrait.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onAddSubscription = this.onAddSubscription.bind(this);

    this.state = {
      formInvalid: false,
      errorMessage: '',
      subscriptionTrait: this.loadSubscriptionTrait(props.userTraits),
      newSubscription: {
        name: '',
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const subscriptionTrait = this.loadSubscriptionTrait(nextProps.userTraits);
    this.setState({
      subscriptionTrait,
      formInvalid: false,
      errorMessage: '',
      newSubscription: {
        name: '',
      },
    });
  }


  /**
   * Check form fields value,
   * Invalid value, can not save
   * @param newSubscription object
   */
  onCheckFormValue(newSubscription) {
    let invalid = false;

    let errorMessage = '';

    if (!_.trim(newSubscription.name).length) {
      errorMessage += 'Name, ';
      invalid = true;
    }

    if (errorMessage.length > 0) {
      errorMessage += ' cannot be empty';
    }

    this.setState({ errorMessage, formInvalid: invalid });
    return invalid;
  }

  /**
   * Delete subscription by index
   * @param indexNo the subscription index no
   */
  onDeleteSubscription(indexNo) {
    const { subscriptionTrait } = this.state;
    const newSubscriptionTrait = { ...subscriptionTrait };
    newSubscriptionTrait.traits.data.splice(indexNo, 1);
    this.setState({
      subscriptionTrait: newSubscriptionTrait,
    });

    const {
      handle,
      tokenV3,
      updateUserTrait,
      deleteUserTrait,
    } = this.props;

    if (newSubscriptionTrait.traits.data.length > 0) {
      updateUserTrait(handle, 'subscription', newSubscriptionTrait.traits.data, tokenV3, false);
    } else {
      deleteUserTrait(handle, 'subscription', tokenV3);
    }
  }

  /**
   * Add new subscription
   * @param e form submit event
   */
  onAddSubscription(e) {
    e.preventDefault();
    const { newSubscription } = this.state;
    if (this.onCheckFormValue(newSubscription)) {
      return;
    }
    const {
      handle,
      tokenV3,
      updateUserTrait,
      addUserTrait,
    } = this.props;
    const { subscriptionTrait } = this.state;
    if (subscriptionTrait.traits && subscriptionTrait.traits.data.length > 0) {
      const newSubscriptionTrait = { ...subscriptionTrait };
      newSubscriptionTrait.traits.data.push(newSubscription);
      this.setState({ subscriptionTrait: newSubscriptionTrait });
      updateUserTrait(handle, 'subscription', newSubscriptionTrait.traits.data, tokenV3, true);
    } else {
      const newSubscriptions = [];
      newSubscriptions.push(newSubscription);
      const traits = {
        data: newSubscriptions,
      };
      this.setState({ subscriptionTrait: { traits } });
      addUserTrait(handle, 'subscription', newSubscriptions, tokenV3, true);
    }
    const empty = {
      name: '',
    };
    this.setState({ newSubscription: empty });
  }

  /**
   * Update input value
   * @param e event
   */
  onUpdateInput(e) {
    const { newSubscription: oldSubscription } = this.state;
    const newSubscription = { ...oldSubscription };
    newSubscription[e.target.name] = e.target.value;
    this.setState({ newSubscription });
  }

  /**
   * Update select value
   * @param option selected value
   */
  onUpdateSelect(option) {
    if (option) {
      const { newSubscription: oldSubscription } = this.state;
      const newSubscription = { ...oldSubscription };
      newSubscription[option.key] = option.name;
      this.setState({ newSubscription });
    }
  }

  /**
   * Get subscription trait
   * @param userTraits the all user traits
   */
  loadSubscriptionTrait = (userTraits) => {
    const trait = userTraits.filter(t => t.traitId === 'subscription');
    const subscriptions = trait.length === 0 ? {} : trait[0];
    return _.assign({}, subscriptions);
  }

  render() {
    const { subscriptionTrait } = this.state;
    const subscriptionItems = subscriptionTrait.traits
      ? subscriptionTrait.traits.data.slice() : [];
    const { newSubscription, formInvalid, errorMessage } = this.state;

    return (
      <div styleName="subscription-container">
        <div styleName={`error-message ${formInvalid ? 'active' : ''}`}>
          { errorMessage }
        </div>
        <h1>
Subscriptions
        </h1>
        <div styleName="form-container">
          <form name="subscription-form" noValidate autoComplete="off">
            <div styleName="row">
              <p>
Add Subscription
              </p>
            </div>
            <div styleName="row">
              <div styleName="field col-1">
                <label htmlFor="name">
Name
                </label>
                <input id="name" name="name" type="text" placeholder="Name" onChange={this.onUpdateInput} value={newSubscription.name} maxLength="128" required />
              </div>
            </div>
          </form>
          <div styleName="button-save">
            <PrimaryButton
              styleName="complete"
              onClick={this.onAddSubscription}
            >
              Add Subscription
            </PrimaryButton>
          </div>
        </div>
        <SubscriptionList
          subscriptionList={{ items: subscriptionItems }}
          onDeleteItem={this.onDeleteSubscription}
        />
      </div>
    );
  }
}

Subscription.propTypes = {
  tokenV3: PT.string.isRequired,
  handle: PT.string.isRequired,
  userTraits: PT.array.isRequired,
  addUserTrait: PT.func.isRequired,
  updateUserTrait: PT.func.isRequired,
  deleteUserTrait: PT.func.isRequired,
};
