/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import Taro from '@tarojs/taro';
import Icon from './h5';

export type IconNames = 'x' | 'x-circle' | 'trash-2' | 'share' | 'rss' | 'pin' | 'more-vertical' | 'message-circle' | 'map-pin' | 'image' | 'heart' | 'file' | 'external-link' | 'clock' | 'chevron-up' | 'chevron-right' | 'chevron-left' | 'chevron-down' | 'check-circle' | 'calendar' | 'award';

interface Props {
  name: IconNames;
  size?: number;
  color?: string | string[];
  style?: React.CSSProperties;
}

const IconFont: FunctionComponent<Props> = (props) => {
  const { name, size, color, style } = props;

  return <Icon name={name} size={parseFloat(Taro.pxTransform(size, 750))} color={color} style={style} />;
};

IconFont.defaultProps = {
  size: 18,
};

export default IconFont;
