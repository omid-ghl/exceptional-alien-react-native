import type React from 'react';
import type {TextInput} from 'react-native';

declare namespace ITextInputCustom {
  type IProps = React.ComponentProps<typeof TextInput> & {
    label: string;
    hasError?: boolean;
    isPassword?: boolean;
    isVerified?: boolean;
    isAssistive?: boolean;
  };
}

export {ITextInputCustom};
