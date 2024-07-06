import { db, storage } from '@/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, listAll, ref } from 'firebase/storage';

const deleteProductImages = async (id: string) => {
  // 판매 상품 경로의 이미지 폴더의 ref 를 불러옵니다.
  const listRef = ref(storage, id);

  // 폴더 내부의 파일 ref 를 모두 불러와서 각각에 대해 삭제 작업을 수행합니다.
  const folderRef = await listAll(listRef);
  for (const imageRef of folderRef.items) {
    await deleteObject(imageRef);
  }
};

const deleteProductDocument = async (id: string) => {
  // 판매 상품의 id 에 맞는 Document 를 삭제합니다.
  await deleteDoc(doc(db, 'product', id));
};

export const deleteProduct = async (id: string) => {
  await deleteProductDocument(id);
  await deleteProductImages(id);
};
