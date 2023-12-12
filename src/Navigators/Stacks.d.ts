import {Story} from './../Models/Story';
import {Gem} from '@/Models/Gem';
import {PlayBook} from '@/Models/PlayBook';
import {Partnership, PartnershipStory} from '@/Models';
import {LatLng} from 'react-native-maps';

export type StackParamList = {
  splash: {
    hasLoading?: boolean;
    goToUrl?: () => void;
  };
  getStarted: undefined;
  auth: undefined;
  login: undefined;
  signup: undefined;
  emailSent: {
    email: string;
    password: string;
  };
  forgotPassword: undefined;
  forgotPasswordLinkSent: {
    email: string;
  };
  selectLocations: undefined;
  selectIndustries: undefined;
  onboardingLoading: undefined;
  tabBar: undefined;
  homePage: undefined;
  home: undefined;
  search: {
    openTabName?: string;
  };
  you: undefined;
  gemDetails: {
    gemId: number;
    gem: Gem;
    myPlaybookId?: number;
  };
  playBookDetails: {
    playBookId: number;
    playBook: PlayBook;
    slug?: string;
  };
  storyDetails: {
    storyId: number;
    story: Story;
  };
  tutorial: undefined;
  settings: undefined;
  discoverLocations: undefined;
  about: undefined;
  changeEmail: undefined;
  resetPassword: undefined;
  personalDetail: undefined;
  nominate: undefined;
  helpAndSupport: undefined;
  contact: undefined;
  faq: undefined;
  sendFeedback: undefined;
  createPlaybook: {
    playbook?: PlayBook;
    editTitle?: boolean;
    initialGemsIds: number[];
  };
  placeInterests: undefined;
  fieldInterests: undefined;
  deleteAccount: undefined;
  storyDetails: undefined;
  mapView: {
    markers: (LatLng & {title?: string; description?: string})[];
    categoriesOfGems?: number[];
    filledIcons?: boolean;
    showNativeMapsButton?: boolean;
  };
  yourPlaybooks: undefined;
  yourGemsByPlaybook: {
    playbook: PlayBook;
    createdByMe?: boolean;
  };
  addGems: {
    gems: Array<Gem>;
    playbook_id?: number;
    playbook_name?: string;
  };
  partnershipDetails: {
    partnershipId: number;
    partnership: Partnership;
  };
  videoView: {
    title: string;
    posterUrl?: string;
    videoId: number;
  };
  partnershipStoryDetails: {
    partnershipStoryId: number;
    partnershipStory: PartnershipStory;
  };
  syncAppVersion: undefined;
};

export type TStacks = keyof StackParamList;
