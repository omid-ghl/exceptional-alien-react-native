import React, {useEffect, useImperativeHandle, useRef, useState} from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {colors, SVG, typography} from '@/Theme';
import {ITextInputCustom} from './TextInputCustom';

const TextInputCustom = React.forwardRef<TextInput, ITextInputCustom.IProps>(
  (props, ref) => {
    const {
      label,
      hasError,
      isPassword,
      isVerified,
      value,
      style,
      onBlur,
      onFocus,
      isAssistive,
      ...restOfProps
    } = props;
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(isPassword);

    const innerRef = useRef<TextInput>(null);
    useImperativeHandle(ref, () => innerRef.current as TextInput);

    const focusAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(focusAnim, {
        toValue: isFocused || !!value ? 1 : 0,
        duration: 150,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }).start();
    }, [focusAnim, isFocused, value]);

    const color = hasError
      ? colors.errorColor
      : isAssistive
      ? colors.primary
      : colors.gray30;

    return (
      <View style={style}>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: color,
            },
          ]}
          ref={innerRef}
          secureTextEntry={showPassword}
          selectionColor={colors.gray100}
          {...restOfProps}
          value={value}
          onBlur={event => {
            setIsFocused(false);
            onBlur && onBlur(event);
          }}
          onFocus={event => {
            setIsFocused(true);
            onFocus && onFocus(event);
          }}
        />
        <TouchableWithoutFeedback onPress={() => innerRef.current?.focus()}>
          <Animated.View
            style={[
              styles.labelContainer,
              {
                transform: [
                  {
                    scale: focusAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.85],
                    }),
                  },
                  {
                    translateY: focusAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, -12],
                    }),
                  },
                  {
                    translateX: focusAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [12, 0],
                    }),
                  },
                ],
              },
            ]}>
            <Text style={styles.label}>{label}</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        <View style={styles.iconContainer}>
          {isVerified && <SVG.CircleCheckFill />}
          {isPassword && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowPassword(state => !state)}
              style={styles.passButton}>
              <SVG.ViewEye />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  input: {
    ...typography.h4,
    paddingVertical: 16,
    paddingLeft: 8,
    paddingRight: 16,
    borderBottomWidth: 1,
  },
  labelContainer: {
    position: 'absolute',
    backgroundColor: colors.white,
  },
  label: {
    ...typography.caption,
    fontSize: 14,
    lineHeight: 14,
    color: colors.gray100,
  },
  iconContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    right: 12,
  },
  passButton: {
    marginLeft: 8,
  },
});

export default TextInputCustom;
