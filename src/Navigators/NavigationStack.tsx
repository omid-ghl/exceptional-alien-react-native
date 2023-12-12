import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StackParamList} from './Stacks';

export const Stack = createStackNavigator<StackParamList>();
export const BottomTab = createBottomTabNavigator<StackParamList>();
