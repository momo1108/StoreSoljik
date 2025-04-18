import { getFirestore } from 'firebase/firestore';
import { app } from './app';
import {
  collection,
  Firestore,
  limit,
  query,
  Query,
  QueryConstraint,
} from 'firebase/firestore';

export const db = getFirestore(app);

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
