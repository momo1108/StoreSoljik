import { db, ProductSchema, storage } from '@/firebase';
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  Firestore,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  Query,
  QueryConstraint,
  QueryDocumentSnapshot,
  startAt,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from 'firebase/storage';

// const updateBatch = async () => {
//   let productsQuery = query(collection(db, 'product'));
//   console.log(productsQuery);
//   const productDocuments = await getDocs(productsQuery);
//   const batch = writeBatch(db);
//   productDocuments.docs.map((doc) =>
//     batch.update(doc.ref, { productSalesrate: '0' }),
//   );
//   await batch.commit();
// };

/*
############################################################
            Firestore - 판매 상품 관련 코드
############################################################
*/
export type ProductField = 'createdAt' | 'productPrice' | 'productSalesrate';
export type ProductDirection = 'asc' | 'desc';
export type ProductFilter = {
  category: string;
  field: ProductField;
  direction: ProductDirection;
};

export const getProductData = async (productId: string) => {
  const productDocument = await getDoc(doc(db, 'product', productId));
  if (productDocument.exists()) {
    return productDocument.data();
  } else return undefined;
};

export const uploadProductImage = async (path: string, imageFile: File) => {
  const imageRef = ref(storage, path);
  await uploadBytes(imageRef, imageFile);
  const imageDownloadUrl = await getDownloadURL(imageRef);
  return imageDownloadUrl;
};

export const deleteProductImages = async (id: string) => {
  // 판매 상품 경로의 이미지 폴더의 ref 를 불러옵니다.
  const listRef = ref(storage, id);

  // 폴더 내부의 파일 ref 를 모두 불러와서 각각에 대해 삭제 작업을 수행합니다.
  const folderRef = await listAll(listRef);
  for (const imageRef of folderRef.items) {
    await deleteObject(imageRef);
  }
};

export const deleteProductDocument = async (id: string) => {
  // 판매 상품의 id 에 맞는 Document 를 삭제합니다.
  await deleteDoc(doc(db, 'product', id));
};

/*
############################################################
            Firestore - React Query 관련 코드
############################################################
*/
type FetchInfiniteProductsParams = {
  pageParam: unknown;
  filters?: QueryConstraint[];
  sortOrders?: QueryConstraint[];
  pageSize?: number;
};

export type PageParamType = QueryDocumentSnapshot<DocumentData, DocumentData>;

export type FetchInfiniteProductsResult = {
  documentArray: ProductSchema[];
  nextPage: PageParamType | null;
};

type FetchProductsParams = {
  filters?: QueryConstraint[];
  sortOrders?: QueryConstraint[];
  pageSize?: number;
};

/**
 * Firestore 에 여러 조건을 적용한 쿼리를 생성하는 함수
 * @param db 앱의 firestore 객체
 * @param collectionName DB 의 컬렉션(테이블)명
 * @param constraints 적용할 조건
 * @returns 완성된 쿼리(getDocs 메서드에 사용 가능)
 */
const buildFirestoreQuery = (
  db: Firestore,
  collectionName: string,
  constraints: QueryConstraint[],
): Query => {
  return query(collection(db, collectionName), ...constraints);
};

/**
 * useInfiniteQuery 의 queryFn 에 사용되는 함수.
 * @param pageParam 페이지의 시작이 될 Document (QueryDocumentSnapshot<DocumentData, DocumentData>;)
 * @param filters where 메서드로 구성된 배열 형태의 필터링 쿼리. Ex) [where('sellerEmail', '==', userInfo.email)]
 * @param sortOrders orderBy 메서드로 구성된 배열 형태의 정렬 쿼리. Ex) [orderBy('createdAt', 'desc')]
 * @param pageSize 페이지 별 데이터 사이즈
 * @returns Promise<{
  documentArray: ProductSchema[];
  nextPage: PageParamType | null;
}>
 * @usage useInfiniteQuery<FetchProductsResult>({ ..., queryFn: ({ pageParam }) => fetchInfiniteProducts(pageParam, filters, sortOrders, 10) })
 */
export const fetchInfiniteProducts = async ({
  pageParam,
  filters = [],
  sortOrders = [],
  pageSize = 10,
}: FetchInfiniteProductsParams): Promise<FetchInfiniteProductsResult> => {
  const constraints: QueryConstraint[] = [
    ...filters,
    ...sortOrders,
    limit(pageSize + 1),
  ];

  if (pageParam) {
    constraints.push(startAt(pageParam));
  }

  const productsQuery = buildFirestoreQuery(db, 'product', constraints);
  const productDocuments = await getDocs(productsQuery);
  const documentArray: ProductSchema[] = productDocuments.docs.map(
    (doc) => doc.data() as ProductSchema,
  );

  const nextPage =
    productDocuments.docs.length > pageSize
      ? productDocuments.docs[pageSize]
      : null;

  return {
    documentArray,
    nextPage,
  };
};

/**
 * useQuery 의 queryFn 에 사용되는 함수.
 * @param filters where 메서드로 구성된 배열 형태의 필터링 쿼리. Ex) [where('sellerEmail', '==', userInfo.email)]
 * @param sortOrders orderBy 메서드로 구성된 배열 형태의 정렬 쿼리. Ex) [orderBy('createdAt', 'desc')]
 * @param pageSize 조회할 데이터 사이즈
 * @returns Promise<ProductSchema[]>
 * @usage useQuery<FetchProductsResult>({ ..., queryFn: ({ pageParam }) => fetchProducts(filters, sortOrders) })
 */
export const fetchProducts = async ({
  filters = [],
  sortOrders = [],
  pageSize = 0,
}: FetchProductsParams): Promise<ProductSchema[]> => {
  const constraints: QueryConstraint[] = [
    ...filters,
    ...sortOrders,
    orderBy('createdAt', 'desc'),
  ];

  if (pageSize > 0) constraints.push(limit(pageSize));

  const productsQuery = buildFirestoreQuery(db, 'product', constraints);
  const productDocuments = await getDocs(productsQuery);

  const documentArray: ProductSchema[] = [];

  if (!productDocuments.empty)
    productDocuments.docs.forEach((doc) => {
      documentArray.push(doc.data() as ProductSchema);
    });

  return documentArray;
};
