import { getAuth } from 'firebase/auth';
import { app } from './app';
import {
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  TwitterAuthProvider,
} from 'firebase/auth';

export const auth = getAuth(app);

export type ThirdPartyProvider =
  | 'google'
  | 'twitter'
  | 'x'
  | 'facebook'
  | 'meta'
  | 'github';

export const signinWithThirdParty = async (provider: ThirdPartyProvider) => {
  let Provider, ProviderInstance;

  if (provider === 'google') Provider = GoogleAuthProvider;
  else if (provider === 'twitter' || provider === 'x')
    Provider = TwitterAuthProvider;
  else if (provider === 'facebook' || provider === 'meta')
    Provider = FacebookAuthProvider;
  else Provider = GithubAuthProvider;

  ProviderInstance = new Provider();

  await signInWithPopup(auth, ProviderInstance);
};
