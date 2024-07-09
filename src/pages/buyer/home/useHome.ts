import { db, ProductSchema } from '@/firebase';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useMemo } from 'react';

type ProductPerCategory = {
  [key: string]: ProductSchema[];
} | null;

const useHome = () => {
  const { data: allProductArray } = useQuery<ProductSchema[]>({
    queryKey: ['product', 'buyer'],
    queryFn: async () => {
      const querySnapshot = await getDocs(
        query(collection(db, 'product'), orderBy('productSalesrate', 'desc')),
      );
      const documentArray = querySnapshot.docs.map(
        (doc) => doc.data() as ProductSchema,
      );

      return documentArray;
    },
  });

  const productPerCategory = useMemo<ProductPerCategory>(() => {
    if (allProductArray) {
      const ppc = allProductArray.reduce(
        (prev: Record<string, ProductSchema[]>, cur: ProductSchema) => {
          if (prev[cur.productCategory])
            return {
              ...prev,
              [cur.productCategory]: [...prev[cur.productCategory], cur],
            } as Record<string, ProductSchema[]>;
          else
            return {
              ...prev,
              [cur.productCategory]: [cur],
            } as Record<string, ProductSchema[]>;
        },
        {} as Record<string, ProductSchema[]>,
      );
      return ppc;
    } else return null;
  }, [allProductArray]);

  return { allProductArray, productPerCategory };
};

export default useHome;
