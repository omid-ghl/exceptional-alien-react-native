import {colors, variables} from '@/Theme';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TextInput} from 'react-native';
import {IInput} from './IInput';

export const Input = ({
  onKeyUp = () => {},
  onChangeText = () => {},
  placeholder = '',
  value,
  style,
}: IInput.IProps) => {
  const {t} = useTranslation();
  const [phrase, setPhrase] = useState('');
  const [isTyping, setIsTyping] = useState({
    name: '',
    typing: false,
    typingTimeout: 0,
  });

  useEffect(() => {
    if (onKeyUp) {
      if (isTyping.typingTimeout) {
        clearTimeout(isTyping.typingTimeout);
      }
      setIsTyping({
        name: phrase,
        typing: false,
        typingTimeout: setTimeout(() => {
          onKeyUp(phrase);
        }, 500),
      });
    } else {
      onChangeText(phrase);
    }
  }, [phrase]);

  useEffect(() => {
    setPhrase(value);
  }, [value]);

  return (
    <TextInput
      onChangeText={setPhrase}
      style={[styles.textinputStyle, style]}
      value={phrase}
      returnKeyType="done"
      cursorColor={colors.primary}
      placeholder={t(placeholder)}
    />
  );
};

const styles = StyleSheet.create({
  textinputStyle: {width: variables.dimensions.width * 0.7},
});
