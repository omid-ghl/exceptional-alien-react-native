import React, {useEffect} from 'react';
import {View, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import {createTabs} from '@/Commons';
import {LogIn, SignUp} from '@/Containers/auth/Components';
import {useTranslation} from 'react-i18next';
import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {colors} from '@/Theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Host} from 'react-native-portalize';

const Tabs = createTabs();

const Auth: React.FC<StackScreenProps<StackParamList, 'auth'>> = ({
  navigation,
}) => {
  const {t} = useTranslation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: () => null,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoiding}>
          <Host>
            <Tabs.Navigator
              screenOptions={{
                tabBarStyle: {marginTop: 60},
              }}>
              <Tabs.Screen
                name="signup"
                component={SignUp}
                options={{tabBarLabel: t('sign_up') as string}}
              />
              <Tabs.Screen
                name="login"
                component={LogIn}
                options={{tabBarLabel: t('log_in') as string}}
              />
            </Tabs.Navigator>
          </Host>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  tabBar: {
    marginTop: 60,
  },
  keyboardAvoiding: {
    flex: 1,
  },
});

export default Auth;
