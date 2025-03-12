import { fetchProducts, getProductData } from '@/services/productService';
import { ProductSchema } from '@/types/FirebaseType';
import { getProperSizeImageUrl, preloadImages } from '@/utils/imageUtils';
import { QueryKey, useQuery } from '@tanstack/react-query';
import { orderBy, where } from 'firebase/firestore';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const useDetail = () => {
  const navigate = useNavigate();
  const param = useParams();
  if (!param.id) {
    toast.error('존재하지 않는 상품 페이지입니다.');
    setTimeout(() => {
      navigate('/');
    }, 1000);
  }

  const fetchProductdata = async ({ queryKey }: { queryKey: QueryKey }) => {
    const [, productId] = queryKey;
    const productData = await getProductData(productId as string);

    if (productData) return productData as ProductSchema;
    else {
      const errorInstance = new Error('존재하지 않는 상품입니다.');
      errorInstance.name = 'firebase.store.product.read';
      throw errorInstance;
    }
  };
  const fetchProductRecommendList = async ({
    queryKey,
  }: {
    queryKey: QueryKey;
  }) => {
    try {
      const [, productCategory] = queryKey;
      if (!productCategory) {
        return {
          category: '',
          result: [],
        };
      }

      const productData = await fetchProducts({
        filters: [
          where('productCategory', '==', productCategory),
          where('id', '!=', param.id),
        ],
        sortOrders: [orderBy('createdAt', 'desc')],
        pageSize: 5,
      });

      if (productData)
        return { category: productCategory as string, result: productData };
      else {
        const errorInstance = new Error('존재하지 않는 상품입니다.');
        errorInstance.name = 'firebase.store.product.read';
        throw errorInstance;
      }
    } catch (error) {
      console.error(error);
      return {
        category: '',
        result: [],
      };
    }
  };

  const { data, status, error, refetch } = useQuery<ProductSchema>({
    queryKey: ['product', param.id],
    queryFn: fetchProductdata,
    retry: false,
  });

  // console.log(data, status, error);

  const {
    data: recommendData,
    status: recommendStatus,
    error: recommendError,
  } = useQuery<{
    category: string;
    result: ProductSchema[];
  }>({
    queryKey: ['products', data?.productCategory, 'recommend'],
    queryFn: fetchProductRecommendList,
  });

  useEffect(() => {
    /**
     * 현재 상품의 이미지를 불러온 후에에 추천 상품 리스트의 이미지들을 preload 한다.
     */
    if (data && recommendData && recommendData.result.length) {
      const detailImageUrls: string[] = [];
      const preloadImageUrls: string[] = [];

      data.productImageUrlMapArray.forEach((imageMap) => {
        detailImageUrls.push(
          ...Object.values(getProperSizeImageUrl(imageMap, 600)),
        );
      });
      recommendData.result.forEach((product) => {
        preloadImageUrls.push(
          ...Object.values(
            getProperSizeImageUrl(product.productImageUrlMapArray[0], 600),
          ),
        );
      });

      // console.log(detailImageUrls, preloadImageUrls);

      preloadImages(detailImageUrls)
        .then(() => {
          preloadImages(preloadImageUrls);
        })
        .catch((error) => {
          console.dir(error);
        });
    }
  }, [data, recommendData]);

  // console.log(recommendData, recommendStatus, recommendError);

  return {
    data,
    status,
    error,
    refetch,
    recommendData,
    recommendStatus,
    recommendError,
  };
};

export default useDetail;
