import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, ImageBackground, Image} from 'react-native';

import {CollapsingHeader, FullScreenLoading} from '@/Commons';
import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {colors, typography, variables} from '@/Theme';
import Variables, {hasNotch} from '@/Theme/Variables';
import {useTranslation} from 'react-i18next';
import {AppConfig} from '@/Config';
import LinearGradient from 'react-native-linear-gradient';
import {PartnershipContent, PartnershipHeader} from '../Components';
import {normalizeImageField} from '@/Utils';
import {usePartnershipByIdQuery} from '@/Services/modules/partnerships';
import {SvgUri} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const PartnershipDetails: React.FC<
  StackScreenProps<StackParamList, 'partnershipDetails'>
> = ({
  route: {
    params: {partnership, partnershipId},
  },
  navigation,
}) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const [partnershipDetails, setPartnershipDetails] = useState(partnership);

  const {data: partnershipData, isSuccess: partnershipIsSuccess} =
    usePartnershipByIdQuery(partnership?.id ?? partnershipId);

  // const onSharePress = useCallback(() => {
  //   if (partnershipDetails?.web_address) {
  //     if (Platform.OS === 'android') {
  //       Share.share({message: partnershipDetails.web_address});
  //     } else {
  //       Share.share({url: partnershipDetails.web_address});
  //     }
  //   }
  // }, [partnershipDetails]);

  useEffect(() => {
    if (partnershipIsSuccess && partnershipData) {
      setPartnershipDetails(partnershipData);
    }
  }, [partnershipIsSuccess, partnershipData]);

  if (!partnershipDetails) {
    return <FullScreenLoading />;
  }

  return (
    <View style={styles.container}>
      <CollapsingHeader
        MinHeight={50 + insets.top}
        MaxHeight={variables.dimensions.height * 0.6}
        MaxContent={
          <ImageBackground
            resizeMode="cover"
            style={styles.portraitImageStyle}
            source={{
              uri: `${AppConfig.IMAGE_URL}${normalizeImageField(
                partnershipDetails.main_image_url?.path,
              )}`,
            }}>
            <View style={styles.textWrapper}>
              <Text style={styles.featuredPartnership}>
                {t('travel_playbook_partnership')}
              </Text>
              <Text style={styles.titleText}>{partnershipDetails.title}</Text>
              <View style={styles.partnerContainer}>
                {partnershipDetails.partner_logo_url?.path?.includes('.svg') ? (
                  <View style={styles.partnerLogoImage}>
                    <SvgUri
                      width="28"
                      height="28"
                      uri={`${AppConfig.IMAGE_URL}${normalizeImageField(
                        partnershipDetails.partner_logo_url?.path,
                      )}`}
                    />
                  </View>
                ) : (
                  <Image
                    source={{
                      uri: `${AppConfig.IMAGE_URL}${normalizeImageField(
                        partnershipDetails.partner_logo_url?.path,
                      )}`,
                    }}
                    style={styles.partnerLogoImage}
                  />
                )}

                <Text style={styles.partnerNameText}>
                  {partnershipDetails.partner_name}
                </Text>
              </View>
            </View>
            <View style={styles.borderSectionOnImage} />
            <LinearGradient
              colors={['#00000000', '#000000FF']}
              style={styles.gradient}
            />
          </ImageBackground>
        }
        MinContent={
          <View style={[styles.headerBackGround, {height: 50 + insets.top}]} />
        }
        FixedContent={
          <PartnershipHeader
            navigation={navigation}
            // onRightButtonPress={onSharePress}
            // rightButtonVariant="share"
            rightButtonVariant="none"
          />
        }>
        <PartnershipContent partnership={partnershipDetails} />
      </CollapsingHeader>
    </View>
  );
};

const styles = StyleSheet.create({
  portraitImageStyle: {
    width: variables.dimensions.width,
    height: variables.dimensions.height * 0.6,
    zIndex: -10,
  },
  headerBackGround: {
    width: variables.dimensions.width,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    height: 200,
  },
  collectButton: {
    backgroundColor: colors.primary,
    width: variables.dimensions.width * 0.9,
    height: 50,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
    borderRadius: 100,
    justifyContent: 'center',
  },
  collectedButton: {
    backgroundColor: colors.gray100,
    opacity: 1,
  },
  buttonText: {
    color: colors.white,
  },
  collectedWrapp: {
    marginHorizontal: 17,
    flex: 1,
    marginVertical: 40,
  },
  collcetedStyle: {
    ...typography.h1,
    width: Variables.dimensions.width * 0.5,
    marginTop: 20,
  },
  subtitleText: {
    ...typography.h4,
    color: colors.gray100,
    marginTop: 10,
  },
  marginTop80: {marginTop: 70},
  gradient: {
    height: '50%',
    width: '100%',
    bottom: 0,
    borderRadius: 9,
    position: 'absolute',
    zIndex: 99,
  },
  textWrapper: {
    position: 'absolute',
    bottom: 50,
    width: variables.dimensions.width * 0.9,
    alignSelf: 'center',
    zIndex: 1200,
    marginBottom: 6,
  },
  featuredPartnership: {
    ...typography.h5,
    color: colors.white,
    marginBottom: 8,
  },
  partnerNameText: {
    ...typography.caption,
    color: colors.white,
  },
  titleText: {
    ...typography.h1,
    color: colors.white,
  },
  subTitleText: {
    ...typography.h5,
    color: colors.white,
  },
  partnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  partnerLogoImage: {
    width: 28,
    height: 28,
    borderRadius: 28 / 2,
    marginRight: 6,
  },
  borderSectionOnImage: {
    width: variables.dimensions.width,
    height: 32,
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 100,
  },
});

export default PartnershipDetails;
