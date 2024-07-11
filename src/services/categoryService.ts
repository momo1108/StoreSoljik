import { db } from '@/firebase';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';

export const createCategory = async (name: string) => {
  await setDoc(doc(db, 'category', name), { count: 1 });
};
export const getCategory = async (name: string): Promise<number | null> => {
  const categoryDocument = await getDoc(doc(db, 'category', name));
  if (categoryDocument.exists()) return categoryDocument.data().count;
  else return null;
};

export const updateCategory = async (
  name: string,
  isAdd: boolean,
): Promise<void> => {
  const categoryDocument = await getDoc(doc(db, 'category', name));
  if (categoryDocument.exists()) {
    await setDoc(doc(db, 'category', name), {
      count: categoryDocument.data().count + (isAdd ? 1 : -1),
    });
  }
};

/**
 * 모든 카테고리명과 판매 상품의 갯수를 배열 형태로 리턴하는 함수
 * @returns [['카테고리명1', 개수1], ['카테고리명2', 개수2], ...]
 */
export const getAllCategories = async (): Promise<string[]> => {
  const querySnapshot = await getDocs(collection(db, 'category'));
  const result: string[] = [];
  querySnapshot.forEach((doc) => {
    result.push(doc.id);
  });
  return result;
};

/**
 * 상품이 1개 이상인 카테고리명들을 리턴하는 함수
 * @returns ['카테고리명1', '카테고리명2', ...]
 */
export const getValidCategories = async (): Promise<string[]> => {
  const querySnapshot = await getDocs(collection(db, 'category'));
  const result: string[] = [];
  querySnapshot.forEach((doc) => {
    if (doc.data().count > 0) result.push(doc.id);
  });
  return result;
};

/**
 * 모든 카테고리명과 판매 상품의 갯수를 배열 형태로 리턴하는 함수
 * @returns [['카테고리명1', 개수1], ['카테고리명2', 개수2], ...]
 */
export const getCategoryCountMap = async (): Promise<{
  [key: string]: number;
}> => {
  const querySnapshot = await getDocs(collection(db, 'category'));
  const documentArray: [string, number][] = [];
  querySnapshot.forEach((doc) => {
    documentArray.push([doc.id, doc.data().count]);
  });
  const result = documentArray.reduce(
    (prev, cur) => ({ ...prev, [cur[0]]: cur[1] }),
    {},
  );
  return result;
};
