import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextInput from 'ringcentral-widgets/components/TextInput';
import SaveButton from 'ringcentral-widgets/components/SaveButton';
import InputField from 'ringcentral-widgets/components/InputField';
import Panel from 'ringcentral-widgets/components/Panel';

import styles from './styles.scss';

export default class FreshDeskSettingPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiKey: props.apiKey,
    };

    this._updateApiKey = (e) => {
      const apiKey = e.target.value;
      this.setState({
        apiKey
      });
    };

    this._onSave = () => {
      this.props.onSaveApiKey(this.state.apiKey);
    };
  }

  render() {
    return (
      <Panel className={styles.content}>
        <InputField label="FreshDesk API key">
          <TextInput value={this.state.apiKey} onChange={this._updateApiKey} />
        </InputField>
        <SaveButton
          currentLocale="en-US"
          onClick={this._onSave}
          disabled={!this.state.apiKey || this.state.apiKey.length === 0}
        />
      </Panel>
    );
  }
}

FreshDeskSettingPanel.propTypes = {
  apiKey: PropTypes.string,
  onSaveApiKey: PropTypes.func.isRequired,
};

FreshDeskSettingPanel.defaultProps = {
  apiKey: '',
};
