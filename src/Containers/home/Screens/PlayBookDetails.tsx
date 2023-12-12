import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Share,
  Platform,
} from 'react-native';
import {Modalize} from 'react-native-modalize';

import {Button, CollapsingHeader, FullScreenLoading} from '@/Commons';
import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {colors, typography, variables} from '@/Theme';
import {PlayBookCollectedModal, PlayBookContent} from '../Components';
import {hasNotch} from '@/Theme/Variables';
import {useTranslation} from 'react-i18next';
import {DynamicShare, showToast, useAddPlaybookMutation} from '@/Services';
import {AppConfig} from '@/Config';
import PlaybookHeader from '../Components/PlaybookHeader';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch} from 'react-redux';
import {addUserPlaybook} from '@/Store/userDetails';
import {
  usePlaybookByIdQuery,
  usePlaybookBySlugQuery,
  usePlaybookCollectedQuery,
} from '@/Services/modules/playbooks';
import {useAppSelector} from '@/Hooks';
import {loginIntrupt} from '@/Utils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const PlayBookDetails: React.FC<
  StackScreenProps<StackParamList, 'playBookDetails'>
> = ({
  route: {
    params: {playBook, playBookId, slug},
  },
  navigation,
}) => {
  const collectedModalRef = useRef<Modalize>(null);
  const {t} = useTranslation();
  const [playbookDetails, setPlaybookDetails] = useState(playBook);
  const guestMode = useAppSelector(state => state.auth.guest.guestMode);
  const [shareLink, setShareLink] = useState<string>();
  const [shareLinkLoading, setShareLinkLoading] = useState(false);
  const [successToAdding, setSuccessToAdding] = useState(false);

  const insets = useSafeAreaInsets();

  const dispatch = useDispatch();

  const [addPlaybook, {isSuccess: addIsSuccess, isLoading: addIsLoading}] =
    useAddPlaybookMutation();

  const {data: playbookData, isSuccess: playbookIsSuccess} =
    usePlaybookByIdQuery(playBook?.id ?? playBookId, {
      skip: !playBook?.id && !playBookId,
    });

  const {data: playbookBySlugData, isSuccess: playbookBySlugIsSuccess} =
    usePlaybookBySlugQuery(slug as string, {
      skip: !!playBookId || !!playBook?.id || !slug,
    });

  const {data: playbookCollected, isLoading: playbookCollectedIsLoading} =
    usePlaybookCollectedQuery(playBook?.id ?? playBookId, {
      skip: guestMode || (!playBook?.id && !playBookId),
    });

  const onCollect = () => {
    if (guestMode) {
      return loginIntrupt();
    }
    addPlaybook({
      playbook_id: playbookDetails.id,
    });
  };

  const onSharePress = useCallback(async () => {
    if (!playbookDetails || shareLinkLoading) {
      return;
    }
    if (playbookDetails?.web_address) {
      setShareLinkLoading(true);
      try {
        const dynamicLink =
          shareLink ??
          (await DynamicShare.createPlaybookDynamicLink(playbookDetails));
        setShareLink(dynamicLink);
        setShareLinkLoading(false);
        if (Platform.OS === 'android') {
          Share.share({message: dynamicLink});
        } else {
          Share.share({url: dynamicLink});
        }
      } catch (error) {
        setShareLinkLoading(false);
        showToast({
          type: 'playbook',
          text: t('dynamic_link_create_error'),
        });
      }
    }
  }, [playbookDetails, shareLink, shareLinkLoading, t]);

  useEffect(() => {
    if (addIsSuccess) {
      setSuccessToAdding(true);
      dispatch(addUserPlaybook(playbookDetails));
      setTimeout(() => {
        collectedModalRef.current?.open();
        setSuccessToAdding(false);
      }, 1500);
    }
  }, [addIsSuccess, dispatch, playbookDetails]);

  useEffect(() => {
    if (playbookIsSuccess && playbookData) {
      setPlaybookDetails(playbookData);
    }
  }, [playbookIsSuccess, playbookData]);

  useEffect(() => {
    if (playbookBySlugIsSuccess && playbookBySlugData) {
      setPlaybookDetails(playbookBySlugData);
    }
  }, [playbookBySlugIsSuccess, playbookBySlugData]);

  if (!playbookDetails) {
    return <FullScreenLoading />;
  }

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
                uri: `${AppConfig.IMAGE_URL}${playbookDetails?.user?.profile_image}`,
              }}>
              <View style={styles.textWrapper}>
                <Text style={styles.titleText}>{playbookDetails.title}</Text>
                <Text style={styles.occupationText}>
                  {playbookDetails.user?.occupation}
                </Text>
                {/*<Text style={styles.subTitleText}>Partnered with Adidas</Text>*/}
              </View>
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
            <PlaybookHeader
              navigation={navigation}
              onRightButtonPress={onSharePress}
              rightButtonVariant={shareLinkLoading ? 'loading' : 'share'}
            />
          }>
          <PlayBookContent playBook={playbookDetails} />
        </CollapsingHeader>
      </View>

      <Button
        isLoading={playbookCollectedIsLoading || addIsLoading}
        isSuccess={successToAdding}
        title={
          addIsSuccess || playbookCollected ? t('collected') : t('collect')
        }
        style={[
          styles.collectButton,
          (addIsSuccess || playbookCollected) && styles.collectedButton,
        ]}
        textStyle={styles.buttonText}
        onPress={onCollect}
        disable={addIsLoading || addIsSuccess || playbookCollected}
      />

      <PlayBookCollectedModal collectedModalRef={collectedModalRef} />
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
    height: hasNotch ? 100 : 60,
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
    zIndex: 2,
  },
  collectedButton: {
    backgroundColor: colors.gray100,
    opacity: 1,
  },
  buttonText: {
    color: colors.white,
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
  },
  titleText: {
    ...typography.h1,
    color: colors.white,
  },
  occupationText: {
    ...typography.h5,
    color: colors.white,
    marginTop: 6,
  },
});

export default PlayBookDetails;
