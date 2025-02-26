import { auth } from '@/firebase';
import {
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  TwitterAuthProvider,
} from 'firebase/auth';
import {
  collection,
  Firestore,
  limit,
  query,
  Query,
  QueryConstraint,
} from 'firebase/firestore';

/**
 * Firestore 에 여러 조건을 적용한 쿼리를 생성하는 함수
 * @param db 앱의 firestore 객체
 * @param collectionName DB 의 컬렉션(테이블)명
 * @param constraints 적용할 조건
 * @returns 완성된 쿼리(getDocs 메서드에 사용 가능)
 */
export const buildFirestoreQuery = ({
  db,
  collectionName,
  constraints = [],
  filters = [],
  sortOrders = [],
  pageSize = 0,
}: {
  db: Firestore;
  collectionName: string;
  constraints?: QueryConstraint[];
  filters?: QueryConstraint[];
  sortOrders?: QueryConstraint[];
  pageSize?: number;
}): Query => {
  if (constraints.length) {
    return query(collection(db, collectionName), ...constraints);
  } else {
    const constraintArray = [...filters, ...sortOrders];

    if (pageSize > 0) constraintArray.push(limit(pageSize));

    return query(collection(db, collectionName), ...constraintArray);
  }
};

type ThirdPartyProvider =
  | 'google'
  | 'twitter'
  | 'x'
  | 'facebook'
  | 'meta'
  | 'github';

export const signinWithThirdParty = (provider: ThirdPartyProvider) => {
  let ProviderInstance;

  if (provider === 'google') ProviderInstance = new GoogleAuthProvider();
  else if (provider === 'twitter' || provider === 'x')
    ProviderInstance = new TwitterAuthProvider();
  else if (provider === 'facebook' || provider === 'meta')
    ProviderInstance = new FacebookAuthProvider();
  else ProviderInstance = new GithubAuthProvider();

  signInWithPopup(auth, ProviderInstance)
    .then((result) => {
      console.dir(result);
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      console.dir(credential);
      const token = credential!.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      console.error(error);
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
};
