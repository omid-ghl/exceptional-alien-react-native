import {ContentBlocks} from '@/Models';
import {StyleProp, ViewStyle} from 'react-native';

declare namespace IStoryContent {
  interface IProps {
    contentBlocks: ContentBlocks[];
    style?: StyleProp<ViewStyle>;
    playbookId?: number;
  }
}

export {IStoryContent};
