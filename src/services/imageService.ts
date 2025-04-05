import { storage } from '@/firebase/storage';
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from 'firebase/storage';

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
