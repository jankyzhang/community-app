/**
 * Track Component.  Renders the track, winner and list of
 * finalists for the given track of an event.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';

import defaultStyles from './styles.scss';

const Track = ({
  count, data, track, theme,
}) => (data ? (
  <div className={theme.container}>
    <div className={theme.track}>{track}</div>
    <div className={theme.winner}>
      <img src={data.fields.champion.fields.image.fields.file.url} alt="Winner Portrait" />
      <div>{data.fields.champion.fields.handle}</div>
      <div className={theme.label}>Champion</div>
    </div>
    {
      data.fields.members.map(member => (
        <div key={member.fields.handle} className={theme.finalist}>{member.fields.handle}</div>
      ))
    }
    { _.range(data.fields.members.length, count).map(i => <div className={theme.empty} key={i} />) }
  </div>
) : false);

Track.defaultProps = {
  count: 10,
  track: 'TRACK',
  data: null,
};

Track.propTypes = {
  count: PT.number,
  data: PT.shape(),
  track: PT.string,
  theme: PT.shape().isRequired,
};

export default themr('hall-of-fame/tco-track', defaultStyles)(Track);
