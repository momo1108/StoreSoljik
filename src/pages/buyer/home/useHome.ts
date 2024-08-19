import { getValidCategories } from '@/services/categoryService';
import { fetchProducts } from '@/services/productService';
import { ProductSchema } from '@/types/FirebaseType';
import { useQueries, useQuery } from '@tanstack/react-query';
import { orderBy, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const useHome = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryFetchStatus, setCategoryFetchStatus] = useState<
    'pending' | 'success' | 'error'
  >('pending');
  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await getValidCategories();
        setCategories(data);
        setCategoryFetchStatus('success');
      } catch (error) {
        setCategoryFetchStatus('error');
        toast.error(
          `카테고리 데이터를 불러오는 중 에러가 발생했습니다.\n${error}`,
        );
      }
    };

    getCategories();
  }, []);

  const {
    data: hotProductsArray,
    status: hotProductsStatus,
    error: hotProductsError,
  } = useQuery<ProductSchema[]>({
    queryKey: ['products', 'hot'],
    queryFn: async () =>
      await fetchProducts({
        sortOrders: [
          orderBy('productSalesrate', 'desc'),
          orderBy('createdAt', 'desc'),
        ],
        pageSize: 8,
      }),
  });

  const recentProductsQueryPerCategory = useQueries({
    queries: categories.map((category) => ({
      queryKey: ['products', category, 'recent'],
      queryFn: async () => ({
        category,
        result: await fetchProducts({
          filters: [where('productCategory', '==', category)],
          sortOrders: [orderBy('createdAt', 'desc')],
          pageSize: 8,
        }),
      }),
    })),
    combine: (results) => {
      return results.map((categoryQuery) => ({
        data: categoryQuery.data,
        status: categoryQuery.status,
        error: categoryQuery.error,
      }));
    },
  });

  return {
    hotProductsArray,
    hotProductsStatus,
    hotProductsError,
    categories,
    categoryFetchStatus,
    recentProductsQueryPerCategory,
  };
};

export default useHome;
