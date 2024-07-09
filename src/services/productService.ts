import { db, storage } from '@/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
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
