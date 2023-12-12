import {changePassword} from './changePassword';
import {api} from '@/Services/api';
import {checkToken} from './checkToken';
import forgotPassword from './forgotPassword';
import login from './login';
import resendEmail from './resendEmail';
import signup from './signup';
import addPlaybook from './addPlaybook';
import addGem from './addGem';
import editProfile from './editProfile';
import {
  userGemsList,
  userInterestedList,
  userPlaybooksList,
} from './userDataList';
import removePlaybook from './removePlaybook';
import removeGem from './removeGem';
import createNewPlaybook from './createPlaybook';
import removeFromUserPlaybook from './removeFromUserPlaybook';
import addGemToPlaybook from './addGemToPlaybook';
import removeGemFromPlaybook from './removeGemFromPlaybook';
import editPlaybookTitle from './editPlaybookTitle';

export const userApi = api.injectEndpoints({
  endpoints: build => ({
    login: login(build),
    signup: signup(build),
    forgotPassword: forgotPassword(build),
    checkToken: checkToken(build),
    resendEmail: resendEmail(build),
    addPlaybook: addPlaybook(build),
    removePlaybook: removePlaybook(build),
    removeFromUserPlaybook: removeFromUserPlaybook(build),
    addGem: addGem(build),
    removeGem: removeGem(build),
    editProfile: editProfile(build),
    userGemsList: userGemsList(build),
    userPlaybooksList: userPlaybooksList(build),
    changePassword: changePassword(build),
    userInterestedList: userInterestedList(build),
    createNewPlaybook: createNewPlaybook(build),
    addGemToPlaybook: addGemToPlaybook(build),
    removeGemFromPlaybook: removeGemFromPlaybook(build),
    editPlaybookTitle: editPlaybookTitle(build),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useSignupMutation,
  useForgotPasswordMutation,
  useLazyCheckTokenQuery,
  useCheckTokenQuery,
  useResendEmailMutation,
  useAddPlaybookMutation,
  useRemovePlaybookMutation,
  useRemoveFromUserPlaybookMutation,
  useAddGemMutation,
  useRemoveGemMutation,
  useEditProfileMutation,
  useUserGemsListQuery,
  useLazyUserGemsListQuery,
  useUserPlaybooksListQuery,
  useLazyUserPlaybooksListQuery,
  useChangePasswordMutation,
  useLazyUserInterestedListQuery,
  useCreateNewPlaybookMutation,
  useAddGemToPlaybookMutation,
  useRemoveGemFromPlaybookMutation,
  useEditPlaybookTitleMutation,
} = userApi;
