import type {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

declare namespace ITabs {
  type CustomTabsType = ReturnType<typeof createMaterialTopTabNavigator>;
}

export {ITabs};
