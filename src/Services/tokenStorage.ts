import * as Keychain from 'react-native-keychain';

const setToken = async (token: string) => {
  const username = 'auth_token';
  const password = token;
  return await Keychain.setGenericPassword(username, password);
};

const removeToken = async () => {
  return await Keychain.resetGenericPassword();
};

const getToken = async () => {
  const credentials = await Keychain.getGenericPassword();
  if (!credentials || !credentials.password) {
    return null;
  }
  return credentials.password;
};

export default {
  setToken,
  getToken,
  removeToken,
};
