import {StyleProp} from 'react-native';

declare namespace ISkeleton {
  interface IProps {
    width: string | number;
    height: string | number;
    color: string;
    direction?: 'row' | 'column';
    count?: number;
    style?: StyleProp;
  }
}

export {ISkeleton};
