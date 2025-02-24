import { useCartItems } from '@/hooks/useCartItems';
import { useCartUI } from '@/hooks/useCartUI';
import useFirebaseListener from '@/hooks/useFirestoreListener';
import { fetchProducts, getProductData } from '@/services/productService';
import { ProductSchema } from '@/types/FirebaseType';
import { getProperSizeImageUrl, preloadImages } from '@/utils/imageUtils';
import { QueryKey, useQuery } from '@tanstack/react-query';
import { orderBy, where } from 'firebase/firestore';
import { ChangeEventHandler, useEffect, useRef, useState } from 'react';
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
  const { isOpen, toggleCart } = useCartUI();
  const { checkItemIsInCart, addItem } = useCartItems();

  // 구매 수량 state (input 의 value 로 사용되므로 string 타입 사용)
  const [cartItemQuantity, setCartItemQuantity] = useState<string>('1');
  /**
   * 구매 수량 input 태그의 onchange 이벤트 핸들러 함수.
   * 값의 범위를 1 ~ 200 으로 제한합니다.
   * @param event 이벤트 객체
   */
  const handleOnchangeQuantityInput: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const parsedValue = parseInt(event.target.value);
    if (isNaN(parsedValue)) setCartItemQuantity('1');
    else {
      let valueToSet = '1';
      if (parsedValue < 1) valueToSet = '1';
      else if (parsedValue > 200) valueToSet = '200';
      else valueToSet = parsedValue.toString();
      setCartItemQuantity(valueToSet);
    }
  };

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
    if (data && recommendData && recommendData.result.length) {
      const detailImageUrls: string[] = [];
      const preloadImageUrls: string[] = [];

      data.productImageUrlMapArray.forEach((imageMap) => {
        detailImageUrls.push(imageMap['600px'], imageMap['600px_webp']);
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
          console.error(error);
        });
    }
  }, [data, recommendData]);

  // console.log(recommendData, recommendStatus, recommendError);

  const isProductInCart: boolean = checkItemIsInCart(data);
  const handleClickPurchase = () => {
    if (data) {
      if (!isProductInCart) addItem(data, parseInt(cartItemQuantity));
      navigate('/purchase', {
        state: {
          prevRoute: window.location.pathname,
        },
      });
    }
  };

  useEffect(() => {
    // 여기서 추천상품 스크롤 초기화?
    setCartItemQuantity('1');
    if (isOpen) toggleCart();
  }, [param.id]);

  const { messagesDailyArray, sendMessage } = useFirebaseListener();
  const chattingBoxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chattingBoxRef.current)
      chattingBoxRef.current.scrollTop = chattingBoxRef.current.scrollHeight;
  }, [messagesDailyArray]);
  const [message, setMessage] = useState<string>('');
  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage(message);
      setMessage('');
    }
  };

  return {
    cartItemQuantity,
    handleOnchangeQuantityInput,
    data,
    status,
    error,
    refetch,
    recommendData,
    recommendStatus,
    recommendError,
    handleClickPurchase,
    isProductInCart,
    addItem,
    message,
    setMessage,
    handleKeydown,
    chattingBoxRef,
  };
};

export default useDetail;
