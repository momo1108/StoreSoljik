import { db, storage } from '@/firebase';
import { CartItem } from '@/hooks/useCartItems';
import { UserInfo } from '@/hooks/useFirebaseAuth';
import { OrderSchema, OrderStatus, ProductSchema } from '@/types/FirebaseType';
import { ProductFormData } from '@/types/FormType';
import {
  FetchInfiniteQueryParams,
  FetchInfiniteQueryResult,
  FetchQueryParams,
} from '@/types/ReactQueryType';
import { buildFirestoreQuery } from '@/utils/firebaseUtils';
import { getKoreanIsoDatetime } from '@/utils/utils';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  QueryConstraint,
  runTransaction,
  setDoc,
  startAt,
  where,
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
type CreateProductDataParam = {
  id: string;
  userInfo: UserInfo;
  formData: ProductFormData;
  productImageUrlMapArray: Record<string, string>[];
  isoTime: string;
};
type UpdateProductDataParam = {
  originalProductData: ProductSchema;
  userInfo: UserInfo;
  formData: ProductFormData;
  productImageUrlMapArray: Record<string, string>[];
  isoTime: string;
};

export const createProductData = async ({
  id,
  userInfo,
  formData,
  productImageUrlMapArray,
  isoTime,
}: CreateProductDataParam) => {
  const documentData: ProductSchema = {
    id,
    sellerId: userInfo.uid,
    productName: formData.productName,
    productDescription: formData.productDescription,
    productPrice: parseInt(formData.productPrice),
    productQuantity: parseInt(formData.productQuantity),
    productSalesrate: 0,
    productCategory: formData.productCategory,
    productImageUrlMapArray,
    createdAt: isoTime,
    updatedAt: isoTime,
  };

  await setDoc(doc(db, 'product', id), documentData);
};

export const getProductData = async (productId: string) => {
  const productDocument = await getDoc(doc(db, 'product', productId));
  if (productDocument.exists()) {
    return productDocument.data();
  } else return undefined;
};

// fetchProducts 와 겹치는 메서드.
export const getProductList = async (sellerId: string = 'all') => {
  const productListDocument = await getDocs(
    buildFirestoreQuery({
      db,
      collectionName: 'product',
      filters: sellerId === 'all' ? [] : [where('sellerId', '==', sellerId)],
      sortOrders: [orderBy('createdAt', 'desc')],
    }),
  );

  if (productListDocument.docs.length) {
    return productListDocument.docs.map(
      (document) => document.data() as ProductSchema,
    );
  } else return undefined;
};

export const uploadProductImage = async (path: string, imageFile: File) => {
  const imageRef = ref(storage, path);
  await uploadBytes(imageRef, imageFile);
  const imageDownloadUrl = await getDownloadURL(imageRef);
  return imageDownloadUrl;
};

export const updateProductData = async ({
  originalProductData,
  formData,
  productImageUrlMapArray,
  isoTime,
}: UpdateProductDataParam) => {
  const documentData: ProductSchema = {
    ...originalProductData,
    productName: formData.productName,
    productDescription: formData.productDescription,
    productPrice: parseInt(formData.productPrice),
    productQuantity: parseInt(formData.productQuantity),
    productCategory: formData.productCategory,
    productImageUrlMapArray,
    updatedAt: isoTime,
  };

  await setDoc(doc(db, 'product', originalProductData.id), documentData);
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

export const purchaseProducts = async (
  cartItemsArray: CartItem[],
  buyerInfo: UserInfo,
  orderName: string,
) => {
  let batchOrderId = `${buyerInfo.uid}_${getKoreanIsoDatetime()}`;

  await runTransaction(db, async (transaction) => {
    const productRefs = cartItemsArray.map((product) =>
      doc(db, 'product', product.id),
    );
    const productSnapshots = await Promise.all(
      productRefs.map((ref) => transaction.get(ref)),
    );

    const purchaseErrorInstance = new Error();

    // 상품의 재고를 체크합니다.
    productSnapshots.forEach((snapshot, index) => {
      if (!snapshot.exists()) {
        purchaseErrorInstance.name = 'firebase.store.product.read';
        purchaseErrorInstance.message = `상품 "${cartItemsArray[index].productName}" 의 정보를 읽어오는데 실패했습니다.`;
        throw purchaseErrorInstance;
      }

      const productData = snapshot.data();

      if (productData.productQuantity < cartItemsArray[index].productQuantity) {
        purchaseErrorInstance.name = 'firebase.store.product.update';
        purchaseErrorInstance.message = `상품 "${cartItemsArray[index].productName}" 의 재고가 부족합니다.`;
        throw purchaseErrorInstance;
      }
    });

    // 상품의 재고를 차감합니다.
    productSnapshots.forEach((snapshot, index) => {
      const productData = snapshot.data();
      transaction.update(productRefs[index], {
        productQuantity:
          productData!.productQuantity - cartItemsArray[index].productQuantity,
        productSalesrate:
          productData!.productSalesrate + cartItemsArray[index].productQuantity,
      });
    });

    const isoTime = batchOrderId.split('_')[1];

    // 각 상품들에 대해 주문 정보를 DB에 저장한다.
    cartItemsArray.forEach((item) => {
      const orderRef = doc(collection(db, 'order'));
      const orderData: OrderSchema = {
        orderId: orderRef.id,
        batchOrderId,
        buyerId: buyerInfo.uid,
        sellerId: item.sellerId,
        orderName,
        orderData: item,
        orderStatus: OrderStatus.OrderCreated,
        createdAt: isoTime,
        updatedAt: isoTime,
      };
      transaction.set(orderRef, orderData);
    });
  });

  return batchOrderId;
};

export const rollbackSingleOrder = async (order: OrderSchema) => {
  const orderRef = doc(db, 'order', order.orderId);
  const productRef = doc(db, 'product', order.orderData.id);
  await runTransaction(db, async (transaction) => {
    const productSnapshot = await transaction.get(productRef);

    const errorInstance = new Error();

    if (!productSnapshot.exists()) {
      errorInstance.name = 'firebase.store.product.read';
      errorInstance.message = `상품 "${order.orderData.productName}" 의 정보를 읽어오는데 실패했습니다.`;
      throw errorInstance;
    }

    const productData = productSnapshot.data();

    transaction.update(orderRef, { orderStatus: OrderStatus.OrderCancelled });
    transaction.update(productRef, {
      productQuantity:
        productData!.productQuantity + order.orderData.productQuantity,
      productSalesrate:
        productData!.productSalesrate - order.orderData.productQuantity,
    });
  });
};

/**
 * 한 주문에 포함된 모든 상품들의 구매 과정을 롤백하는 함수입니다.
 * 주문의 상태가 OrderStatus.OrderCreated(구매 후 결제 전)
 * 개선안) purchaseProducts 메서드에서 트랜잭션을 통해 저장된 order 테이블의 레코드들의 모든 정보를 return 하면 그대로 가져와서 활용 가능할듯
 * @param batchOrderId 삭제할 주문의 batchOrderId 필드
 * @param shoudDelete 주문 레코드의 삭제 여부. 결제 전인 주문은 삭제되어야 합니다.
 */
type RollbackBatchOrderParam = {
  batchOrderId: string;
  shouldDelete?: boolean;
};
export const rollbackBatchOrder = async ({
  batchOrderId,
  shouldDelete = true,
}: RollbackBatchOrderParam) => {
  const orderDocuments = await getDocs(
    buildFirestoreQuery({
      db,
      collectionName: 'order',
      filters: [where('batchOrderId', '==', batchOrderId)],
    }),
  );
  const orderDataArray: OrderSchema[] = orderDocuments.docs.map(
    (doc) => doc.data() as OrderSchema,
  );
  const productRefs = orderDataArray.map((order) =>
    doc(db, 'product', order.orderData.id),
  );

  await runTransaction(db, async (transaction) => {
    const productSnapshots = await Promise.all(
      productRefs.map((ref) => transaction.get(ref)),
    );

    const errorInstance = new Error();

    productSnapshots.forEach((snapshot, index) => {
      if (!snapshot.exists()) {
        errorInstance.name = 'firebase.store.product.read';
        errorInstance.message = `상품 "${orderDataArray[index].orderData.productName}" 의 정보를 읽어오는데 실패했습니다.`;
        throw errorInstance;
      }

      const productData = snapshot.data();

      transaction.update(productRefs[index], {
        productQuantity:
          productData!.productQuantity +
          orderDataArray[index].orderData.productQuantity,
        productSalesrate:
          productData!.productSalesrate -
          orderDataArray[index].orderData.productQuantity,
      });
    });

    // 주문에 맞는 레코드들을 삭제합니다.
    if (shouldDelete) {
      orderDocuments.forEach((orderDocument) =>
        transaction.delete(orderDocument.ref),
      );
    }
  });
};

/*
############################################################
            Firestore - React Query 의 queryFn 관련 코드
############################################################
*/

/**
 * 조건에 맞는 상품 목록 InfiniteQuery 의 queryFn 에 사용되는 함수.
 * @param pageParam 페이지의 시작이 될 Document (QueryDocumentSnapshot<DocumentData, DocumentData>;)
 * @param filters where 메서드로 구성된 배열 형태의 필터링 쿼리. Ex) [where('sellerEmail', '==', userInfo.email)]
 * @param sortOrders orderBy 메서드로 구성된 배열 형태의 정렬 쿼리. Ex) [orderBy('createdAt', 'desc')]
 * @param pageSize 페이지 별 데이터 사이즈(페이징에 사용할 값을 그대로 대입해야 이전/다음 페이지를 제대로 계산 가능)
 * @returns Promise<{
  dataArray: ProductSchema[];
  documentArray: QueryDocumentType[];
}>
 * @usage useInfiniteQuery<FetchInfiniteProductsResult>({ ..., queryFn: ({ pageParam }) => fetchInfiniteProducts(pageParam, filters, sortOrders, 10) })
 */
export const fetchInfiniteProducts = async ({
  pageParam,
  filters = [],
  sortOrders = [],
  pageSize = 10,
}: FetchInfiniteQueryParams): Promise<
  FetchInfiniteQueryResult<ProductSchema>
> => {
  const constraints: QueryConstraint[] = [
    ...filters,
    ...sortOrders,
    limit(pageSize + 1),
  ];

  if (pageParam) {
    constraints.push(startAt(pageParam));
  }

  const productsQuery = buildFirestoreQuery({
    db,
    collectionName: 'product',
    constraints,
  });
  const productDocuments = await getDocs(productsQuery);
  const dataArray: ProductSchema[] = productDocuments.docs
    .slice(0, pageSize)
    .map((doc) => doc.data() as ProductSchema);

  return {
    dataArray,
    documentArray: productDocuments.docs,
  };
};

/**
 * 조건에 맞는 상품 목록 Query 용 queryFn 에 사용되는 함수.
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
}: FetchQueryParams): Promise<ProductSchema[]> => {
  const productsQuery = buildFirestoreQuery({
    db,
    collectionName: 'product',
    filters,
    sortOrders,
    pageSize,
  });
  const productDocuments = await getDocs(productsQuery);

  const documentArray: ProductSchema[] = [];

  if (!productDocuments.empty)
    productDocuments.docs.forEach((doc) => {
      documentArray.push(doc.data() as ProductSchema);
    });

  return documentArray;
};
