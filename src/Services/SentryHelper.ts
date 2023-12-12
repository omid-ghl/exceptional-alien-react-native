import {SENTRY_DSN} from '@/constants/common';
import * as Sentry from '@sentry/react-native';

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

export default {
  dsn: SENTRY_DSN,
  routingInstrumentation,
};
