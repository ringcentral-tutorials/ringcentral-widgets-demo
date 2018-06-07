import React, { Component } from 'react';
import Button from 'ringcentral-widgets/components/Button';
import styles from 'ringcentral-widgets/components/ConferencePanel/styles.scss';
import PropTypes from 'prop-types';

function getGoogleCalendarUri(params = {}) {
  let calendarUri = 'https://www.google.com/calendar/render?action=TEMPLATE';
  Object.keys(params).forEach((paramKey) => {
    calendarUri = `${calendarUri}&${paramKey}=${encodeURIComponent(params[paramKey])}`;
  });
  return calendarUri;
}

function formatCalendarDate(date) {
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  return `${date.getUTCFullYear()}${month < 10 ? '0' : 0}${month}${day < 10 ? '0' : 0}${day}T${hour < 10 ? '0' : 0}${hour}0000Z`;
}

function openGoogleCalendarPage(conferenceEvent) {
  // add calendar logics here
  console.log(conferenceEvent);
  const calendarUri = getGoogleCalendarUri({
    text: conferenceEvent.topic,
    location: conferenceEvent.dialInNumber,
    details: conferenceEvent.inviteText,
    pli: 1,
    sf: true,
    output: 'xml',
    dates: `${formatCalendarDate(new Date())}/${formatCalendarDate(new Date((new Date()).getTime() + 3600000))}`
  });
  window.open(calendarUri);
}

export default class ThirdPartyConferenceInviteButton extends Component {
  constructor(props) {
    super(props);

    // add logics
    this._onInvite = () => {
      const inviteText = this.props.getInviteTxt();
      if (!inviteText) {
        return;
      }
      openGoogleCalendarPage({
        inviteText,
        dialInNumber: props.dialInNumber,
        topic: 'New Conference'
      });
    };
  }

  // add logics

  render() {
    return (
      <Button
        className={styles.button}
        onClick={this._onInvite}
      >
        Invite with Third Party Calendar
      </Button>
    );
  }
}

ThirdPartyConferenceInviteButton.propTypes = {
  getInviteTxt: PropTypes.func.isRequired,
  dialInNumber: PropTypes.string.isRequired,
};
