import React from 'react';
import {StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';

import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {colors, SVG} from '@/Theme';
import {createTabs} from '@/Commons';
import {t} from 'i18next';
import GemsList from '../Components/ProfileGem';
import PlayBooksList from '../Components/ProfilePlaybook';
import {Host} from 'react-native-portalize';
import {ProfilePlaybooksHeader} from '../Components';
import {useAppSelector} from '@/Hooks';
import {hasNotch} from '@/Theme/Variables';

const Tabs = createTabs();

const Profile: React.FC<StackScreenProps<StackParamList, 'you'>> = () => {
  const userPlaybooks = useAppSelector(
    state => state.userDetails.createdPlaybooks,
  );

  return (
    <Host>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}>
        <ProfilePlaybooksHeader userPlaybooks={userPlaybooks} />
        <Tabs.Navigator
          tabBarPosition={'bottom'}
          screenOptions={{
            tabBarStyle: {
              marginBottom: 10,
            },
          }}>
          <Tabs.Screen
            name="Gems"
            component={GemsList}
            options={{
              tabBarLabel: t('gems') || "",
              tabBarIcon: ({color}) => (
                <SVG.Gem width={20} height={20} stroke={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="Playbooks"
            component={PlayBooksList}
            options={{
              tabBarLabel: t('play_books') || "",
              tabBarIcon: ({color}) => (
                <SVG.Playbooks
                  width={22}
                  height={22}
                  stroke={color}
                  strokeWidth={2}
                />
              ),
            }}
          />
        </Tabs.Navigator>
      </KeyboardAvoidingView>
    </Host>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  tabBar: {
    marginTop: 60,
  },
  keyboardAvoiding: {
    backgroundColor: colors.white,
    flex: 1,
    paddingTop: hasNotch ? 50 : 20,
  },
});

export default Profile;
