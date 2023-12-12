import {AppConfig} from '@/Config';
import {
  ANDROID_PACKAGE_NAME,
  APP_STORE_ID,
  DYNAMIC_LINKS_DESCRIPTION,
  DYNAMIC_LINKS_TITLE_SUFFIX,
  DYNAMIC_LINKS_URL_PREFIX,
  DYNAMIC_LINK_DEFAULT_IMAGE_URL,
  IOS_BUNDLE_ID,
} from '@/constants/common';
import {Gem, PlayBook} from '@/Models';
import dynamicLinks from '@react-native-firebase/dynamic-links';

const parseGemShareLinkSuffixToGemId = (gemLinkSuffix: string) => {
  if (
    !gemLinkSuffix ||
    typeof gemLinkSuffix !== 'string' ||
    !gemLinkSuffix.includes('#gem-')
  ) {
    return undefined;
  }
  const parts = gemLinkSuffix.split('#gem-');
  if (parts.length !== 2 || !parts[1]) {
    return undefined;
  }
  const gemIdStr = parts[1].trim();
  let gemIdNum: number | undefined;
  try {
    gemIdNum = parseInt(gemIdStr, 10);
  } catch (error) {}
  return gemIdNum;
};

const createPlaybookDynamicLink = async (playbook: PlayBook) => {
  const link = await dynamicLinks().buildShortLink(
    {
      domainUriPrefix: DYNAMIC_LINKS_URL_PREFIX,
      link: playbook.web_address as string,
      android: {
        packageName: ANDROID_PACKAGE_NAME,
        minimumVersion: '50',
      },
      ios: {
        bundleId: IOS_BUNDLE_ID,
        appStoreId: APP_STORE_ID,
        minimumVersion: '1.0.5',
      },
      navigation: {
        forcedRedirectEnabled: true,
      },
      otherPlatform: {
        fallbackUrl: playbook.web_address,
      },
      social: {
        title: `${playbook.title} - ${DYNAMIC_LINKS_TITLE_SUFFIX}`,
        descriptionText: DYNAMIC_LINKS_DESCRIPTION,
        imageUrl: playbook?.user?.profile_image
          ? `${AppConfig.IMAGE_URL}${playbook.user.profile_image}`
          : DYNAMIC_LINK_DEFAULT_IMAGE_URL,
      },
    },
    dynamicLinks.ShortLinkType.SHORT,
  );
  console.log('🔥🔗 Created dynamic link:', link);
  return link;
};

const createGemDynamicLink = async (gem: Gem) =>
  await dynamicLinks().buildShortLink(
    {
      domainUriPrefix: DYNAMIC_LINKS_URL_PREFIX,
      link: gem.web_address as string,
      android: {
        packageName: ANDROID_PACKAGE_NAME,
        minimumVersion: '50',
      },
      ios: {
        bundleId: IOS_BUNDLE_ID,
        appStoreId: APP_STORE_ID,
        minimumVersion: '1.0.5',
      },
      navigation: {
        forcedRedirectEnabled: true,
      },
      otherPlatform: {
        fallbackUrl: gem.web_address,
      },
      social: {
        title: `${gem.name} - ${DYNAMIC_LINKS_TITLE_SUFFIX}`,
        descriptionText: DYNAMIC_LINKS_DESCRIPTION,
        imageUrl: gem?.feature_image
          ? `${AppConfig.IMAGE_URL}${gem.feature_image}`
          : DYNAMIC_LINK_DEFAULT_IMAGE_URL,
      },
    },
    dynamicLinks.ShortLinkType.SHORT,
  );

export default {
  parseGemShareLinkSuffixToGemId,
  createPlaybookDynamicLink,
  createGemDynamicLink,
};
