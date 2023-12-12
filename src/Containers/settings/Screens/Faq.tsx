import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Animated, {FadeIn} from 'react-native-reanimated';

import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {colors, SVG, typography} from '@/Theme';
import {useTranslation} from 'react-i18next';

const Faq: React.FC<StackScreenProps<StackParamList, 'faq'>> = ({
  navigation,
}) => {
  const {t} = useTranslation();
  const [currentIndex, setcurrentIndex]: any = useState(null);

  const FAQ = [ ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.settingTitle}>{t('faq')}</Text>
          {FAQ.map(({title, data, id}, index) => {
            const checkIndex = index === currentIndex;
            const up = (
              <SVG.ChevronUp width={15} height={15} stroke={colors.black} />
            );
            const down = (
              <SVG.ChevronDown width={15} height={15} stroke={colors.black} />
            );
            return (
              <View style={styles.itemWrapper}>
                <TouchableOpacity
                  key={id}
                  onPress={() => {
                    setcurrentIndex(!checkIndex && index);
                  }}>
                  <View style={styles.itemTitle}>
                    <Text style={styles.title}>{title}</Text>
                    {checkIndex ? up : down}
                  </View>
                  {checkIndex && (
                    <Animated.View entering={FadeIn.delay(200)}>
                      <Text style={styles.description}>{data}</Text>
                    </Animated.View>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
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
    paddingHorizontal: 16,
  },
  headerWrapper: {
    marginTop: 10,
    marginBottom: 48,
  },
  settingTitle: {
    ...typography.h1,
    marginBottom: 20,
    marginTop: 30,
  },
  description: {
    ...typography.h5,
    marginTop: 16,
    color: colors.gray100,
  },
  title: {
    ...typography.h3,
  },
  itemWrapper: {
    marginVertical: 14,
  },
  itemTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Faq;
