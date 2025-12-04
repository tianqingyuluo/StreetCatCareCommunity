/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import Taro from '@tarojs/taro';

export type IconNames = 'x' | 'x-circle' | 'trash-2' | 'share' | 'rss' | 'pin' | 'more-vertical' | 'message-circle' | 'map-pin' | 'image' | 'heart' | 'file' | 'external-link' | 'clock' | 'chevron-up' | 'chevron-right' | 'chevron-left' | 'chevron-down' | 'check-circle' | 'calendar' | 'award';

interface Props {
  /** 图标名称 */
  name: IconNames;
  /** 图标大小 */
  size?: number;
  /** 图标颜色 当原SVG图为单色时可修改颜色 */
  color?: string | string[];
  style?: React.CSSProperties;
}

/**
 * SVG生成图标
 * @example_react
 * ```tsx
 * export default class PageView extends Component {
 *   constructor() {
 *     super(...arguments)
 *   }
 *
 *   render() {
 *     return (
 *       <View className='components-page'>
 *         <IconFont name='close' />
 *         <IconFont name='close' size='14' />
 *         <IconFont name='close' size='14' color="#fff" />
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @see https://github.com/leidenglai/taro-icon-cli#readme
 */
const IconFont: FunctionComponent<Props> = (props) => {
  const { name, size, color, style } = props;

  // @ts-ignore
  return <iconfont name={name} size={parseFloat(Taro.pxTransform(size))} color={color} style={style} />;
};

IconFont.defaultProps = {
  size: 18,
};

export default IconFont;
