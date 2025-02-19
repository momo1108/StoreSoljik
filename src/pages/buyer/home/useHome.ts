import useIdleCallback from '@/hooks/useIdleCallback';
import { getValidCategories } from '@/services/categoryService';
import { fetchProducts } from '@/services/productService';
import { ProductSchema } from '@/types/FirebaseType';
import { getProperSizeImageUrl, preloadImages } from '@/utils/imageUtils';
import { useQueries, useQuery } from '@tanstack/react-query';
import { orderBy, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
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
    queryFn: async () => {
      const result = await fetchProducts({
        sortOrders: [
          orderBy('productSalesrate', 'desc'),
          orderBy('createdAt', 'desc'),
        ],
        pageSize: 5,
      });
      return result;
    },
  });

  const recentProductsQueryPerCategory = useQueries({
    queries: categories.map((category) => ({
      queryKey: ['products', category, 'recent'],
      queryFn: async () => {
        const result = await fetchProducts({
          filters: [where('productCategory', '==', category)],
          sortOrders: [orderBy('createdAt', 'desc')],
          pageSize: 4,
        });
        return {
          category,
          result,
        };
      },
    })),
    combine: (results) => {
      return results.map((categoryQuery) => ({
        data: categoryQuery.data,
        status: categoryQuery.status,
        error: categoryQuery.error,
      }));
    },
  });

  const validPreloadImageUrls = useMemo<string[]>(() => {
    if (
      hotProductsArray &&
      recentProductsQueryPerCategory.every(
        (query) => query.status === 'success',
      )
    ) {
      const urls: string[] = [];
      hotProductsArray.forEach((product) => {
        const imageMap = getProperSizeImageUrl(
          product.productImageUrlMapArray[0],
          600,
        );
        urls.push(imageMap.original, imageMap.webp);
      });
      recentProductsQueryPerCategory.forEach((query) => {
        query.data?.result.forEach((product) => {
          const imageMap = getProperSizeImageUrl(
            product.productImageUrlMapArray[0],
            600,
          );
          urls.push(imageMap.original, imageMap.webp);
        });
      });
      return urls;
    }
    return [];
  }, [hotProductsArray, recentProductsQueryPerCategory]);

  useIdleCallback(() => {
    if (validPreloadImageUrls.length > 0) {
      preloadImages(validPreloadImageUrls);
    }
  }, [validPreloadImageUrls]);

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
