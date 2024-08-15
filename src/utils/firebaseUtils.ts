import {
  collection,
  Firestore,
  limit,
  orderBy,
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
export const buildFirestoreQuery = (
  db: Firestore,
  collectionName: string,
  filters: QueryConstraint[] = [],
  sortOrders: QueryConstraint[] = [],
  pageSize: number = 0,
): Query => {
  const constraints: QueryConstraint[] = [
    ...filters,
    ...sortOrders,
    orderBy('createdAt', 'desc'),
  ];

  if (pageSize > 0) constraints.push(limit(pageSize));

  return query(collection(db, collectionName), ...constraints);
};