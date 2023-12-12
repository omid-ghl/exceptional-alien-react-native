import {ViewStyle} from 'react-native';
import {ContentBlocks} from '@/Models';

declare namespace IStoryContentRenderer {
  interface IProps {
    attributes: ContentBlocks.attributes | null;
    layout: ContentBlocks.layout;
    titleStyle?: ViewStyle;
  }
}

export {IStoryContentRenderer};
