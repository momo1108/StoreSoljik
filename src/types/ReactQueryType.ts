import { QueryConstraint } from 'firebase/firestore';
import { QueryDocumentType } from './FirebaseType';

export type FetchQueryParams = {
  filters?: QueryConstraint[];
  sortOrders?: QueryConstraint[];
  pageSize?: number;
};

export type FetchInfiniteQueryParams = {
  pageParam: unknown;
  filters?: QueryConstraint[];
  sortOrders?: QueryConstraint[];
  pageSize?: number;
};

export type FetchInfiniteQueryResult<T> = {
  dataArray: T[];
  documentArray: QueryDocumentType[];
};
