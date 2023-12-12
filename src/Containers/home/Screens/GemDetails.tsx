import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Share,
  Platform,
} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Button, CollapsingHeader, FullScreenLoading} from '@/Commons';
import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {colors, SVG, typography, variables} from '@/Theme';
import {GemCollectedModal, GemContent, PlayBooksModal} from '../Components';
import Modal from '@/Commons/Modal';
import {Modalize} from 'react-native-modalize';
import Variables from '@/Theme/Variables';
import {
  DynamicShare,
  showToast,
  useAddGemMutation,
  useGemByIdQuery,
  useGemCollectedQuery,
  useGemsByUsersPlaybookQuery,
} from '@/Services';
import {AppConfig} from '@/Config';
import GemHeader from '../Components/GemHeader';
import LinearGradient from 'react-native-linear-gradient';
import GemActionModal from '../Components/GemActionModal';
import {useDispatch} from 'react-redux';
import {GEM_CATEGORIES} from '@/constants/gemCategories';
import {SvgProps} from 'react-native-svg';
import {addUserGem} from '@/Store/userDetails';
import {useAppSelector} from '@/Hooks';
import {loginIntrupt} from '@/Utils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const GemDetails: React.FC<StackScreenProps<StackParamList, 'gemDetails'>> = ({
  route: {
    params: {gem, myPlaybookId, gemId},
  },
  navigation,
}) => {
  const collectGemModalRef = useRef<Modalize>(null);
  const playbookModalRef = useRef<Modalize>(null);
  const actionModalRef = useRef<Modalize>(null);
  const dispatch = useDispatch();
  const guestMode = useAppSelector(state => state.auth.guest.guestMode);
  const [shareLink, setShareLink] = useState<string>();
  const [shareLinkLoading, setShareLinkLoading] = useState(false);

  const [gemDetails, setGemDetails] = useState(gem);

  const {t} = useTranslation();
  const insets = useSafeAreaInsets();

  const [addGem, {isSuccess: addIsSuccess, isLoading: addIsLoading}] =
    useAddGemMutation();

  const {data: gemData, isSuccess: gemIsSuccess} = useGemByIdQuery(
    gem?.id ?? gemId,
  );
  const {data: gemCollected, isLoading: gemCollectedIsLoading} =
    useGemCollectedQuery(gem?.id ?? gemId, {skip: guestMode});

  const {isInMyPlaybook} = useGemsByUsersPlaybookQuery(
    {user_playbook_id: myPlaybookId ?? 0},
    {
      skip: !myPlaybookId,
      selectFromResult: ({data, ...result}) => ({
        ...result,
        isInMyPlaybook: data && data.some(x => x.id === gem?.id ?? gemId),
      }),
    },
  );

  const onCollect = useCallback(() => {
    if (guestMode) {
      return loginIntrupt();
    }
    if (!gemDetails?.id) {
      return;
    }
    addGem({
      gem_id: gemDetails.id,
    });
  }, [addGem, gemDetails?.id, guestMode]);

  const onActionPressed = useCallback(async () => {
    if (!gemDetails || shareLinkLoading) {
      return;
    }
    if (addIsSuccess || gemCollected) {
      actionModalRef.current?.open();
    } else {
      if (gemDetails?.web_address) {
        setShareLinkLoading(true);
        try {
          const dynamicLink =
            shareLink ?? (await DynamicShare.createGemDynamicLink(gemDetails));
          setShareLink(dynamicLink);
          setShareLinkLoading(false);
          if (Platform.OS === 'android') {
            Share.share({message: dynamicLink});
          } else {
            Share.share({url: dynamicLink});
          }
        } catch (error) {
          setShareLinkLoading(false);
          console.log(error);
          showToast({
            type: 'gem',
            text: t('dynamic_link_create_error'),
          });
        }
      }
    }
  }, [addIsSuccess, gemCollected, gemDetails, shareLink, shareLinkLoading, t]);

  useEffect(() => {
    if (addIsSuccess) {
      dispatch(addUserGem(gemDetails));
      setTimeout(() => {
        collectGemModalRef.current?.open();
      }, 1000);
    }
  }, [addIsSuccess, dispatch, gemDetails]);

  useEffect(() => {
    if (gemIsSuccess && gemData) {
      setGemDetails(gemData);
    }
  }, [gemIsSuccess, gemData]);

  if (!gemDetails) {
    return <FullScreenLoading />;
  }

  const CategoriesIconComp: React.FC<SvgProps> | null =
    gemDetails.gem_categories?.[0]?.id &&
    gemDetails.gem_categories[0].id >= 1 &&
    gemDetails.gem_categories[0].id <= GEM_CATEGORIES.length
      ? GEM_CATEGORIES[gemDetails.gem_categories[0].id - 1].clean
      : null;

  return (
    <>
      <View style={styles.container}>
        <CollapsingHeader
          MinHeight={50 + insets.top}
          MaxHeight={variables.dimensions.height * 0.6}
          MaxContent={
            <ImageBackground
              resizeMode="cover"
              style={styles.portraitImageStyle}
              source={{
                uri: `${AppConfig.IMAGE_URL}${gemDetails.portrait_feature_image}`,
              }}>
              <View style={styles.textWrapper}>
                <View style={styles.gemCategoryWrapper}>
                  {CategoriesIconComp && (
                    <CategoriesIconComp height={32} width={32} />
                  )}
                  <Text style={styles.typeOfCardTitle}>
                    {gemDetails.gem_categories
                      .map(({name}) => name)
                      .join(' & ')}
                  </Text>
                </View>

                <Text style={styles.titleText}>{gemDetails.name}</Text>
                <Text style={styles.addressText}>{gemDetails.map_address}</Text>
              </View>
              <View style={styles.borderSectionOnImage} />
              <LinearGradient
                colors={['#00000000', '#000000FF']}
                style={styles.gradient}
              />
            </ImageBackground>
          }
          MinContent={
            <View
              style={[styles.headerBackGround, {height: 50 + insets.top}]}
            />
          }
          FixedContent={
            <GemHeader
              navigation={navigation}
              rightButtonVariant={
                addIsSuccess || gemCollected
                  ? 'menu'
                  : shareLinkLoading
                  ? 'loading'
                  : 'share'
              }
              onRightButtonPress={onActionPressed}
            />
          }>
          <GemContent gem={gemDetails} />
        </CollapsingHeader>
      </View>
      <Button
        isLoading={gemCollectedIsLoading}
        isSuccess={addIsLoading}
        title={addIsSuccess || gemCollected ? t('collected') : t('collect')}
        style={[
          styles.collectButton,
          (addIsSuccess || gemCollected) && styles.collectedButton,
        ]}
        textStyle={styles.buttonText}
        onPress={onCollect}
        disable={addIsLoading || addIsSuccess || gemCollected}
      />
      <GemCollectedModal
        playbookModalRef={playbookModalRef}
        collectGemModalRef={collectGemModalRef}
      />

      <PlayBooksModal
        gemId={gemDetails.id}
        navigation={navigation}
        playbookModalRef={playbookModalRef}
      />
      <GemActionModal
        navigation={navigation}
        data={gemDetails}
        gemActionModalRef={actionModalRef}
        isInMyPlaybook={isInMyPlaybook}
        myPlaybookId={myPlaybookId}
      />
      <LinearGradient
        colors={['#FFFFFF00', '#FFFFFFFF']}
        style={styles.gradient2}
        pointerEvents="none"
      />
    </>
  );
};

const styles = StyleSheet.create({
  gradient2: {
    height: 50,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
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
  },
  collectButton: {
    backgroundColor: colors.primary,
    width: Variables.dimensions.width * 0.9,
    height: 50,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
    borderRadius: 100,
    justifyContent: 'center',
    zIndex: 2,
  },
  collectedButton: {
    backgroundColor: colors.gray100,
    opacity: 1,
  },
  buttonText: {
    color: colors.white,
  },

  gemCategoryWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
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
  },
  typeOfCardTitle: {
    ...typography.tag,
    color: colors.white,
    marginLeft: 3,
  },
  titleText: {
    ...typography.h1,
    color: colors.white,
  },
  addressText: {
    ...typography.h5,
    color: colors.white,
    marginTop: 6,
    marginBottom: 16,
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
    shadowColor: 'white',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
});

export default GemDetails;
