import { db } from '@/firebase.ts';
import { CartItem } from '@/hooks/useCartItems';
import { getProductList, uploadProductImage } from '@/services/productService';
import { OrderSchema, ProductSchema } from '@/types/FirebaseType';
import { buildFirestoreQuery } from '@/utils/firebaseUtils';
import { imgToResizedBlob } from '@/utils/imageUtils';
import {
  deleteField,
  doc,
  DocumentReference,
  getDocs,
  runTransaction,
  updateDoc,
} from 'firebase/firestore';

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = (err) => {
      console.error(err);
      reject(new Error('Image failed to load'));
    };
  });
};

/**
 * 기존의 프로젝트 이미지들을 리사이징해서 다시 저장함과 동시에, 기존 프로젝트의 타입들과 DB 스키마들을 변경된 형태로 수정해야 한다.
 * 다만 기존의 데이터 타입을 사용해 수정을 진행하기 때문에, ProductSchema & { productImageUrlArray: string[]; } 같은 형태로 임시 타입 처리를 진행한다.
 */
const resizeFirebaseImage = async () => {
  // 모든 상품들의 id 를 가져오고, 각 id별로 반복문을 통해 원본 이미지를 리사이징해서 리사이징된 이미지들을 다시 저장한다. 원본은 나중에 성능 비교 후 삭제
  // Storage 서비스에서 파일명을 수정하는 메서드는 따로 제공하지 않기 때문에 삭제 후 재업로드 방식을 사용한다.
  try {
    const productList = (await getProductList()) as (ProductSchema & {
      productImageUrlArray: string[];
    })[];
    console.log(productList);
    for (let i = 0; i < productList.length; i++) {
      const product = productList[i];
      const productImageUrlMapArray: Record<string, string>[] = [];
      console.log(product);

      for (let j = 0; j < product.productImageUrlArray.length; j++) {
        console.log(j);
        const productImageUrlMap: Record<string, string> = {
          original: '',
          original_webp: '',
          '250px': '',
          '250px_webp': '',
          '600px': '',
          '600px_webp': '',
        };
        const url = product.productImageUrlArray[j].replace(
          'https://firebasestorage.googleapis.com',
          'http://localhost:5173/firebasestorage',
        );
        let image = await loadImage(url);
        const sizeList = [0, 300, 600];
        const sizeNameList = ['original', '250px', '600px'];

        const returnBlobCallback =
          (
            fileName: string,
            fileType: string,
            imageUrlMapKey: string,
          ): BlobCallback =>
          async (blob) => {
            if (!blob) return;
            else {
              const newFile = new File([blob], fileName, {
                type: fileType,
                lastModified: new Date().getTime(),
              });
              productImageUrlMap[imageUrlMapKey] = await uploadProductImage(
                `${product.id}/${newFile.name}`,
                newFile,
              );
            }
          };

        for (let sizeIndex = 0; sizeIndex < 3; sizeIndex++) {
          const size = sizeList[sizeIndex];

          if (image.width > size || image.height > size) {
            imgToResizedBlob(
              image,
              'jpg',
              returnBlobCallback(
                `${j}_${sizeNameList[sizeIndex]}.jpg`,
                'jpg',
                `${sizeNameList[sizeIndex]}`,
              ),
              size,
            );
            imgToResizedBlob(
              image,
              'webp',
              returnBlobCallback(
                `${j}_${sizeNameList[sizeIndex]}.webp`,
                'webp',
                `${sizeNameList[sizeIndex]}_webp`,
              ),
              size,
            );
          }
        }

        productImageUrlMapArray.push(productImageUrlMap);
      }

      await updateDoc(doc(db, 'product', product.id), {
        productImageUrlMapArray,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * OrderSchema 의 OrderData 내부에 이미지 관련 링크들도 리팩토링이 필요하다.
 */
const refactorOrderData = async () => {
  try {
    const orderDocumentSnapshots = await getDocs(
      buildFirestoreQuery({
        db,
        collectionName: 'order',
      }),
    );

    await runTransaction(db, async (transaction) => {
      const orderRefDataMapArray: {
        ref: DocumentReference;
        newOrderData: CartItem & {
          productImageUrlArray?: string[];
        };
      }[] = [];

      for (let i = 0; i < orderDocumentSnapshots.docs.length; i++) {
        const orderSnapshot = orderDocumentSnapshots.docs[i];
        const orderDocument = orderSnapshot.data() as OrderSchema;
        const newOrderData = orderDocument.orderData as CartItem & {
          productImageUrlArray?: string[];
        };
        // delete newOrderData.productImageUrlArray;

        const productSnapshot = await transaction.get(
          doc(db, 'product', newOrderData.id),
        );
        const productData = productSnapshot.data() as ProductSchema & {
          productImageUrlArray?: string[];
        };
        // newOrderData.productImageUrlMapArray =
        //   productData.productImageUrlMapArray;
        newOrderData.productImageUrlArray = productData.productImageUrlArray;

        // console.dir(newOrderData);
        orderRefDataMapArray.push({ ref: orderSnapshot.ref, newOrderData });
      }

      console.dir(
        orderRefDataMapArray.map(
          (map) => map.newOrderData.productImageUrlArray,
        ),
      );

      // orderRefDataMapArray.forEach((orderRefDataMap) => {
      //   transaction.update(orderRefDataMap.ref, {
      //     orderData: orderRefDataMap.newOrderData,
      //   });
      // });
    });
  } catch (err) {
    throw new Error(err as string);
  } finally {
    console.log('done');
  }
};

const refactorProductEmailField = async () => {
  /**
   * 삭제가 필요한 필드 (product - sellerEmail, sellerNickname)
   */
  try {
    const productDocumentSnapshots = await getDocs(
      buildFirestoreQuery({
        db,
        collectionName: 'product',
      }),
    );

    await runTransaction(db, async (transaction) => {
      for (let i = 0; i < productDocumentSnapshots.docs.length; i++) {
        const productSnapshot = productDocumentSnapshots.docs[i];
        transaction.update(productSnapshot.ref, {
          sellerEmail: deleteField(),
          sellerNickname: deleteField(),
        });
      }
    });
  } catch (err) {
    throw new Error(err as string);
  } finally {
    console.log('done');
  }
};

const refactorOrderDataEmailField = async () => {
  /**
   * 삭제가 필요한 필드 (order - orderData-sellerEmail)
   */
  try {
    const orderDocumentSnapshots = await getDocs(
      buildFirestoreQuery({
        db,
        collectionName: 'order',
      }),
    );

    await runTransaction(db, async (transaction) => {
      for (let i = 0; i < orderDocumentSnapshots.docs.length; i++) {
        const orderSnapshot = orderDocumentSnapshots.docs[i];
        const orderDocument = orderSnapshot.data();
        delete orderDocument.orderData.sellerEmail;
        transaction.update(orderSnapshot.ref, {
          orderData: { ...orderDocument.orderData },
        });
      }
    });
  } catch (err) {
    throw new Error(err as string);
  } finally {
    console.log('done');
  }
};

const refactorOrderBatchIdField = async () => {
  /**
   * 변경이 필요한 필드 (order - batchOrderId)
   */
  try {
    const orderDocumentSnapshots = await getDocs(
      buildFirestoreQuery({
        db,
        collectionName: 'order',
      }),
    );

    await runTransaction(db, async (transaction) => {
      for (let i = 0; i < orderDocumentSnapshots.docs.length; i++) {
        const orderSnapshot = orderDocumentSnapshots.docs[i];
        const orderDocument = orderSnapshot.data() as OrderSchema;
        const batchOrderId = [
          orderDocument.buyerId,
          orderDocument.batchOrderId.split('_')[1],
        ].join('_');
        // console.log(batchOrderId);
        transaction.update(orderSnapshot.ref, {
          batchOrderId,
        });
      }
    });
  } catch (err) {
    throw new Error(err as string);
  } finally {
    console.log('done');
  }
};

refactorOrderBatchIdField();
