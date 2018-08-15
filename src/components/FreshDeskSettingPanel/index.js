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
      baseUri: props.baseUri,
    };

    this._updateApiKey = (e) => {
      const apiKey = e.target.value;
      this.setState({
        apiKey
      });
    };

    this._updateBaseUri = (e) => {
      const baseUri = e.target.value;
      this.setState({
        baseUri
      });
    };

    this._onSave = () => {
      this.props.onSaveSettings(this.state.apiKey, this.state.baseUri);
    };
  }

  render() {
    return (
      <Panel className={styles.content}>
        <InputField label="FreshDesk Base Uri">
          <TextInput value={this.state.baseUri} onChange={this._updateBaseUri} />
        </InputField>
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
  onSaveSettings: PropTypes.func.isRequired,
};

FreshDeskSettingPanel.defaultProps = {
  apiKey: '',
};
