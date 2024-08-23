import { db } from '@/firebase';
import {
  OrderSchema,
  OrderStatus,
  ProductSchema,
  QueryDocumentType,
} from '@/types/FirebaseType';
import {
  FetchInfiniteQueryParams,
  FetchInfiniteQueryResult,
  FetchQueryParams,
} from '@/types/ReactQueryType';
import { buildFirestoreQuery } from '@/utils/firebaseUtils';
import {
  collection,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  query,
  QueryConstraint,
  runTransaction,
  startAt,
  updateDoc,
  where,
} from 'firebase/firestore';
import { toast } from 'sonner';

/*
############################################################
            Firestore - 주문 관련 코드
최초 주문 생성은 productService 에 transaction 으로 묶여있는 상태
############################################################
*/

/**
 * 구매자 계정의 주문 정보 중 결제 완료가 되지 않은 데이터를 찾습니다.
 * @param uid Firestore 의 구매자 계정 id 입니다.
 * @returns 찾아낸 주문 정보들을 반환합니다.(`Promise<OrderSchema[]>`)
 */
export const getUnfinishedOrderData = async (
  uid: string,
): Promise<OrderSchema[]> => {
  const orderDocuments = await getDocs(
    query(
      collection(db, 'order'),
      where('buyerId', '==', uid),
      where('orderStatus', '==', 'OrderCreated'),
    ),
  );
  const dataArray: OrderSchema[] = orderDocuments.docs.map(
    (doc) => doc.data() as OrderSchema,
  );

  console.log(dataArray);

  return dataArray;
};

/**
 * 결제 완료가 되지 않은 주문 정보들을 삭제하고, 상품 수량을 롤백합니다.
 * 삭제는 batch 를 사용하여 한번의 요청으로 여러 주문 정보를 삭제할 수 있도록 처리합니다.
 * @param orderIdArray 삭제할 주문 레코드의 id가 저장된 배열입니다.
 */
export const rollbackUnfinishedOrderData = async (
  orderArray: OrderSchema[],
) => {
  await runTransaction(db, async (transaction) => {
    const orderRefs = orderArray.map((order) => doc(db, 'order', order.id));
    const orderSnapshots = await Promise.all(
      orderRefs.map((ref) => transaction.get(ref)),
    );

    const purchaseErrorInstance = new Error();

    // 반복문을 사용해 미결제 주문 정보마다 롤백 로직을 수행합니다.
    // 주문별 상품 정보를 가져올 때 await 를 사용하므로 forEach 대신 for문을 사용합니다.
    for (let orderIndex = 0; orderIndex < orderSnapshots.length; orderIndex++) {
      const snapshot = orderSnapshots[orderIndex];
      if (!snapshot.exists()) {
        purchaseErrorInstance.name = 'firebase.store.order.read';
        purchaseErrorInstance.message = `주문 정보 "${orderArray[orderIndex].orderName}" 를 읽어오는데 실패했습니다.`;
        throw purchaseErrorInstance;
      }

      const orderData = snapshot.data() as OrderSchema;

      // 주문에 해당하는 상품들을 불러옵니다.
      const productSnapshots = await Promise.all(
        orderData.cartItemsArray.map((item) =>
          transaction.get(doc(db, 'product', item.id)),
        ),
      );

      // 각 상품들에 대해 반복문을 수행합니다.
      productSnapshots.forEach((productSnapshot, productIndex) => {
        if (!productSnapshot.exists()) {
          purchaseErrorInstance.name = 'firebase.store.product.read';
          purchaseErrorInstance.message = `상품 "${orderData.cartItemsArray[productIndex].productName}" 의 정보를 읽어오는데 실패했습니다.`;
          throw purchaseErrorInstance;
        }
        const productData = productSnapshot.data() as ProductSchema;

        // 상품의 재고 정보를 롤백합니다.
        transaction.update(doc(db, 'product', productData.id), {
          productQuantity:
            productData.productQuantity +
            orderData.cartItemsArray[productIndex].productQuantity,
          productSalesrate:
            productData.productSalesrate -
            orderData.cartItemsArray[productIndex].productQuantity,
        });
      });

      // 재고 정보의 롤백을 마친 후 주문 정보를 삭제합니다.
      transaction.delete(doc(db, 'order', orderData.id));
    }
  });

  toast.success(
    `미결제 주문 ${orderArray.length}건의 주문 취소가 완료되었습니다.`,
  );
};

export const updateOrderStatus = async ({
  orderId,
  orderStatus,
}: {
  orderId: string;
  orderStatus: OrderStatus;
}) => {
  await updateDoc(doc(db, 'order', orderId), { orderStatus });
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
  dataArray: OrderSchema[];
  documentArray: QueryDocumentType[];
}>
 * @usage useInfiniteQuery<FetchInfiniteOrdersResult>({ ..., queryFn: ({ pageParam }) => fetchInfiniteOrders(pageParam, filters, sortOrders, 10) })
 */
export const fetchInfiniteOrders = async ({
  pageParam,
  filters = [],
  sortOrders = [],
  pageSize = 10,
}: FetchInfiniteQueryParams): Promise<
  FetchInfiniteQueryResult<OrderSchema>
> => {
  const constraints: QueryConstraint[] = [
    ...filters,
    ...sortOrders,
    limit(pageSize + 1),
  ];

  if (pageParam) {
    constraints.push(startAt(pageParam));
  }

  const ordersQuery = buildFirestoreQuery(db, 'order', constraints);
  const orderDocuments = await getDocs(ordersQuery);
  const dataArray: OrderSchema[] = orderDocuments.docs.map(
    (doc) => doc.data() as OrderSchema,
  );

  return {
    dataArray,
    documentArray: orderDocuments.docs,
  };
};

/**
 * 모든 주문 정보 Query 용 queryFn 에 사용되는 함수.
 * @param filters where 메서드로 구성된 배열 형태의 필터링 쿼리. Ex) [where('sellerEmail', '==', userInfo.email)]
 * @param sortOrders orderBy 메서드로 구성된 배열 형태의 정렬 쿼리. Ex) [orderBy('createdAt', 'desc')]
 * @param pageSize 조회할 데이터 사이즈
 * @returns Promise<OrderSchema[]>
 * @usage useQuery<FetchOrdersResult>({ ..., queryFn: ({ pageParam }) => fetchOrders(filters, sortOrders) })
 */
export const fetchOrders = async ({
  filters = [],
  sortOrders = [],
  pageSize = 0,
}: FetchQueryParams): Promise<OrderSchema[]> => {
  const ordersQuery = buildFirestoreQuery(
    db,
    'order',
    filters,
    sortOrders,
    pageSize,
  );
  const orderDocuments = await getDocs(ordersQuery);

  const documentArray: OrderSchema[] = [];

  if (!orderDocuments.empty)
    orderDocuments.docs.forEach((doc) => {
      documentArray.push(doc.data() as OrderSchema);
    });

  console.log(documentArray);

  return documentArray;
};
