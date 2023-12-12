import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {colors, SVG, typography, variables} from '@/Theme';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {PlayBook} from '@/Models/PlayBook';
import {useTranslation} from 'react-i18next';
import {Back} from '@/Commons';
import {useAppSelector} from '@/Hooks';
import {loginIntrupt} from '@/Utils';

const ProfilePlaybooksHeader: React.FC<any> = ({
  userPlaybooks,
  isYourCollection = false,
}: {
  userPlaybooks?: Array<PlayBook>;
  isYourCollection?: boolean;
}) => {
  const {t} = useTranslation();
  const guestMode = useAppSelector(state => state.auth.guest.guestMode);
  const navigation =
    useNavigation<StackNavigationProp<StackParamList, 'you'>>();

  const gotoCreatePlaybook = () => {
    if (guestMode) {
      return loginIntrupt();
    }
    navigation.navigate('createPlaybook', {playbook: null});
  };

  const goToSettings = () => {
    navigation.navigate('settings');
  };

  return (
    <>
      <View style={styles.headerWrapper}>
        <View>
          {isYourCollection ? (
            <Back />
          ) : (
            <Text style={styles.profileName}>You</Text>
          )}
        </View>
        <View style={styles.btnsContainer}>
          <TouchableOpacity
            onPress={gotoCreatePlaybook}
            style={styles.createBtn}>
            <Text style={styles.createBtnTxt}>{t('create_playbook')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToSettings}>
            <SVG.Setting />
          </TouchableOpacity>
        </View>
      </View>

      {!isYourCollection && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('yourPlaybooks')}
          style={styles.playbooksWrapper}>
          <LinearGradient
            start={{x: 0.4, y: 0.2}}
            end={{x: 0.8, y: 1}}
            colors={['#2b34c2', '#ABCDFF']}
            style={styles.linearStyle}>
            <SVG.Playbooks
              stroke={colors.white}
              width={variables.dimensions.width * 0.1}
              height={variables.dimensions.width * 0.1}
            />
          </LinearGradient>

          <View style={[styles.playbooksBtn]}>
            <View>
              <Text style={styles.playbooksTitle}>{t('my_playbooks')}</Text>
              <Text style={styles.playbooksCounter}>
                {t(
                  userPlaybooks?.length === 1
                    ? 'playbookCount_one'
                    : 'playbookCount_other',
                  {count: userPlaybooks?.length},
                )}
              </Text>
            </View>
            <View>
              <SVG.ChevronRight width={18} height={18} stroke={colors.black} />
            </View>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 0.1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  profileName: {
    ...typography.h1,
  },
  btnsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createBtn: {
    borderColor: colors.primary,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 15,
  },
  createBtnTxt: {
    ...typography.caption,
    color: colors.primary,
  },
  playbooksWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.2,
    marginHorizontal: 16,
  },
  linearStyle: {
    width: variables.dimensions.width * 0.18,
    height: variables.dimensions.width * 0.18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginRight: 15,
  },
  playbooksBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playbooksTitle: {
    ...typography.h4,
  },
  playbooksCounter: {
    ...typography.caption,
    color: colors.gray100,
  },
});

export default ProfilePlaybooksHeader;
