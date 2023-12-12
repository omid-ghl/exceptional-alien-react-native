import {
  CommonActions,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {TStacks} from './Stacks';

export const navigationRef = createNavigationContainerRef();

export const navigate = (name: TStacks, params?: object) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never);
  }
};

export const navigateAndReset = (routes = [], index = 0) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index,
        routes,
      }),
    );
  }
};

export const navigateAndSimpleReset = (name: TStacks, index = 0) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index,
        routes: [{name}],
      }),
    );
  }
};

export const goBack = () => {
  if (navigationRef.isReady()) {
    navigationRef.current?.goBack();
  }
};

export const getCurrentRoute = () => {
  if (navigationRef.isReady()) {
    return navigationRef.current?.getCurrentRoute();
  }
  return null;
};

export const getCurrentNavigationState = () => {
  if (navigationRef.isReady()) {
    return navigationRef.current?.getState();
  }
  return null;
};
