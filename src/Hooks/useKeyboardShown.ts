import {useEffect, useState} from 'react';
import {Keyboard, Platform} from 'react-native';

const useKeyboardShown = (
  options: {platform: 'android' | 'ios' | 'both'} = {platform: 'both'},
) => {
  const [keyboardShown, setKeyboardShown] = useState(false);
  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardShown(true);
      },
    );

    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardShown(false);
      },
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  if (options.platform !== 'both') {
    if (options.platform !== Platform.OS) {
      return {
        keyboardShown: false,
      };
    }
  }

  return {
    keyboardShown,
  };
};

export default useKeyboardShown;
