import React, {ReactElement, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Toast from 'react-native-toast-message';

import {SHOW_TOAST_DURATION} from '@/constants/common';
import {colors, images, SVG, typography} from '@/Theme';
import {dimensions} from '@/Theme/Variables';

interface Configs {
  backgroundColor: string;
  icon: ReactElement<any, any>;
}

interface ShowToastOptions {
  text: string;
  type: string;
  actions?: Array<any>;
  duration?: number;
  didFinished?: any;
  rightAction?: {
    title: string;
    onPress: any;
  };
}

let showToast = (object: ShowToastOptions) => [object];

let actionInitialValue = {
  title: null,
  onPress: () => {},
};

const SnackBarService = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [userMove, setUserMove] = useState(actionInitialValue);

  showToast = ({
    text,
    type = 'gem',
    actions = [],
    duration = SHOW_TOAST_DURATION,
    didFinished = () => {},
    rightAction,
  }) => {
    setIsVisible(true);
    if (rightAction) {
      setUserMove(rightAction);
    }
    Toast.show({
      type,
      text1: text,
      props: {actions, type},
      visibilityTime: duration,
      onHide: didFinished,
      bottomOffset: 60,
      position: 'bottom',
      autoHide: true,
    });
    setTimeout(() => {
      setIsVisible(false);
      setUserMove(actionInitialValue);
    }, duration + 1000);
  };

  const RenderToast = ({text1, props: {type}}: {text1: String; props: any}) => {
    let config: Configs | null = null;

    switch (type) {
      case 'gem':
        config = {
          backgroundColor: colors.white,
          icon: <SVG.Gem height={16} width={16} stroke={colors.blue} />,
        };
        break;

      case 'playbook':
        config = {
          backgroundColor: colors.white,
          icon: <SVG.Playbooks height={16} width={16} stroke={colors.blue} />,
        };
        break;

      case 'app':
        config = {
          backgroundColor: colors.white,
          icon: <Image style={styles.appImage} source={images.logo} />,
        };
        break;
    }

    return (
      <>
        {isVisible && (
          <View
            style={[
              styles.toastWrapper,
              {backgroundColor: config?.backgroundColor},
            ]}>
            <View style={styles.mainTextWrapper}>
              {config?.icon}
              <Text style={styles.textStyle}>{text1}</Text>
            </View>
            <Text onPress={userMove.onPress} style={styles.actionStyle}>
              {userMove.title}
            </Text>
          </View>
        )}
      </>
    );
  };

  const toastConfig = {
    gem: RenderToast,
    playbook: RenderToast,
    app: RenderToast,
  };

  return <Toast config={toastConfig} />;
};

const styles = StyleSheet.create({
  toastWrapper: {
    height: 56,
    paddingHorizontal: dimensions.width / 15,
    width: dimensions.width * 0.9,
    borderRadius: 10,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    padding: 10,
    position: 'absolute',
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {...typography.caption, marginLeft: 10},
  actionStyle: {...typography.link},
  appImage: {
    width: 16,
    height: 16,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
});

export {SnackBarService, showToast};
