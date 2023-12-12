import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {Platform, StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import Config from 'react-native-config';
import {store} from '@/Store';
import {ApplicationNavigator} from '@/Navigators/ApplicationNavigator';
import CodePush from 'react-native-code-push';
import '@/Translations';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {DEPLOYMENT_KEYS} from '@/constants/common';
import {SentryHelper, SnackBarService} from '@/Services';
import {AlertWrapper} from '@/Commons/Alert';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import * as Sentry from '@sentry/react-native';
import {AppConfig} from '@/Config';

Sentry.init({
  dsn: SentryHelper.dsn,
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation: SentryHelper.routingInstrumentation,
    }),
  ],
  tracesSampleRate: 1.0,
  environment: AppConfig.ENVIRONMENT,
});

const deploymentKey =
  DEPLOYMENT_KEYS[Platform.OS as 'android' | 'ios'][
    Config.IS_PRODUCTION ? 'Production' : 'Staging'
  ];

const App = () => {
  useEffect(() => {
    setTimeout(async () => {
      CodePush.checkForUpdate(deploymentKey).then(status => {
        if (status) {
          CodePush.sync({
            deploymentKey,
            updateDialog: {appendReleaseDescription: true},
          });
        }
      });
    }, 500);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Provider store={store}>
        <SafeAreaProvider>
          <AlertWrapper />
          <ApplicationNavigator />
          <SnackBarService />
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default Sentry.wrap(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
