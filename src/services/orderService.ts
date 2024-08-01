import { db } from '@/firebase';
import { OrderSchema, ProductSchema } from '@/types/FirebaseType';
import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  where,
} from 'firebase/firestore';
import { toast } from 'sonner';

/*
############################################################
            Firestore - 주문 관련 코드
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
