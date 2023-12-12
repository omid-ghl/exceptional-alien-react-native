import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Platform,
  KeyboardAvoidingView, ListRenderItem,
} from "react-native";

import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {colors, images, SVG, typography} from '@/Theme';
import {useTranslation} from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NominateForm} from '../Components';
import Animated, {FadeIn} from 'react-native-reanimated';

export interface NominationFrom {
  id: number;
  name: string;
  firstLabel: string;
  secondLabel: string;
  thirdLabel?: string | any;
  hasThirdInput?: boolean;
  reasonTitle: string;
  icon: {
    active: any;
    deactive: any;
    stroke?: string;
  };
}

const Nominate: React.FC<StackScreenProps<StackParamList, 'nominate'>> = ({
  navigation,
}) => {
  const {t} = useTranslation();

  const [currentId, setcurrentId]: any = useState(1);

  const [nominationSubmited, setNominationSubmited] = useState<boolean>(false);

  const GRADIENT_COLOR = ['#232BBE', '#ABCDFF'];
  const GRAY_COLOR = ['#F2F2F2', '#F2F2F2'];
  const DARK_COLOR = ['#000000', '#000000'];
  const FORM_DATA: Array<NominationFrom> = [
    {
      id: 1,
      name: 'Gem',
      firstLabel: t('name_of_gem'),
      secondLabel: t('address'),
      thirdLabel: t('city'),
      hasThirdInput: true,
      reasonTitle: t('like_gem_reason'),
      icon: {
        active: SVG.GradientGem,
        deactive: SVG.Gem,
        stroke: 'black',
      },
    },
    {
      id: 2,
      name: 'Location',
      firstLabel: t('name_of_city'),
      secondLabel: t('country'),
      reasonTitle: t('like_location_reason'),
      icon: {
        active: SVG.GradientLocation,
        deactive: SVG.Location,
      },
    },
    {
      id: 3,
      name: 'Person',
      firstLabel: t('name_of_person'),
      secondLabel: t('website'),
      thirdLabel: t('social'),
      hasThirdInput: true,
      reasonTitle: t('like_person_reason'),
      icon: {
        active: SVG.GradientPerson,
        deactive: SVG.Person,
      },
    },
  ];

  const goBack = () => navigation.goBack();

  const GradientText = ({colors, ...rest}: any) => {
    return (
      <MaskedView maskElement={<Text {...rest} />}>
        <LinearGradient colors={colors} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
          <Text {...rest} style={[rest.style, styles.maskText]} />
        </LinearGradient>
      </MaskedView>
    );
  };
  const renderTag : ListRenderItem<NominationFrom> = ({item}) => {
    const {name, id} = item;
    const isCurrentId = id === currentId;
    const ActiveIconComponent = item.icon.active;
    const DeacttiveIconComponent = item.icon.deactive;
    const Stroke = item.icon.stroke;

    return (
      <LinearGradient
        colors={isCurrentId ? GRADIENT_COLOR : GRAY_COLOR}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.linearGradient}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setcurrentId(id);
          }}>
          <View
            style={[
              styles.innerContainer,
              {backgroundColor: isCurrentId ? colors.white : colors.gray10},
            ]}>
            {isCurrentId ? (
              <ActiveIconComponent width={19} height={19} />
            ) : (
              <DeacttiveIconComponent stroke={Stroke} width={18} height={18} />
            )}
            <GradientText
              colors={isCurrentId ? GRADIENT_COLOR : DARK_COLOR}
              style={styles.tagName}>
              {name}
            </GradientText>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  if (nominationSubmited) {
    return (
      <Animated.View style={styles.container} entering={FadeIn.delay(200)}>
        <SafeAreaView style={styles.mainWrapper}>
          <TouchableOpacity style={styles.closeBtn} onPress={goBack}>
            <SVG.Close width={20} height={20} stroke={colors.black} />
          </TouchableOpacity>
          <View style={styles.submittedContainer}>
            <Image source={images.check} style={styles.submittedIcon} />
            <Text style={styles.submitTitle}>{t('nomination_submit')}</Text>
            <Text style={styles.submitDesc}>{t('nomination_submit_desc')}</Text>
          </View>
        </SafeAreaView>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.mainWrapper}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <SVG.Back width={20} height={20} stroke={colors.black} />
        </TouchableOpacity>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoiding}>
          <NominateForm
            renderTag={renderTag}
            currentTab={currentId}
            forms={FORM_DATA}
            nominatingSuccesfuly={setNominationSubmited}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  mainWrapper: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },

  linearGradient: {
    borderRadius: 20,
    marginEnd: 8,
  },
  innerContainer: {
    flexDirection: 'row',
    borderRadius: 16.5,
    flex: 1,
    margin: 2,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  tagName: {
    ...typography.caption,
    marginLeft: 5,
  },

  maskText: {opacity: 0},
  closeBtn: {alignSelf: 'flex-end', marginTop: 20},
  backBtn: {alignSelf: 'flex-start', paddingVertical: 20},
  submittedContainer: {
    marginTop: 230,
  },
  submittedIcon: {width: 46, height: 46},
  submitTitle: {
    ...typography.h1,
    marginTop: 19,
    width: 250,
  },
  submitDesc: {
    ...typography.h4,
    marginTop: 10,
    color: colors.gray100,
  },
});

export default Nominate;
