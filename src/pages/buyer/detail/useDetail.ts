import { ProductSchema } from '@/firebase';
import { fetchProducts, getProductData } from '@/services/productService';
import { QueryKey, useQuery } from '@tanstack/react-query';
import { where } from 'firebase/firestore';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const useDetail = () => {
  const navigate = useNavigate();
  const param = useParams();
  if (!param.id) {
    alert('존재하지 않는 상품 페이지입니다.');
    navigate('/');
  }

  const [cartItemQuantity, setCartItemQuantity] = useState<string>('');
  const handleOnchangeQuantityInput: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    try {
      const parsedValue = parseInt(event.target.value);
      let valueToSet = '1';
      if (parsedValue < 1) valueToSet = '1';
      else if (parsedValue > 200) valueToSet = '200';
      else valueToSet = parsedValue.toString();
      setCartItemQuantity(valueToSet);
    } catch {
      setCartItemQuantity('0');
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
  const { data, status, error } = useQuery<ProductSchema>({
    queryKey: ['product', param.id],
    queryFn: fetchProductdata,
  });

  const fetchProductRecommendList = async ({
    queryKey,
  }: {
    queryKey: QueryKey;
  }) => {
    const [, , productCategory] = queryKey;
    const productData = await fetchProducts({
      filters: [where('productCategory', '==', productCategory)],
      pageSize: 8,
    });

    if (productData) return productData;
    else {
      const errorInstance = new Error('존재하지 않는 상품입니다.');
      errorInstance.name = 'firebase.store.product.read';
      throw errorInstance;
    }
  };
  const {
    data: recommendData,
    status: recommendStatus,
    error: recommendError,
  } = useQuery<ProductSchema[]>({
    queryKey: ['product', param.id, data?.productCategory, 'recommendation'],
    queryFn: fetchProductRecommendList,
  });

  console.log(recommendData, recommendStatus, recommendError);

  useEffect(() => {
    if (error && status === 'error') {
      alert(error.message);
      navigate(-1);
    }
  }, [status, error]);

  return {
    cartItemQuantity,
    handleOnchangeQuantityInput,
    data,
    status,
    error,
    recommendData,
    recommendStatus,
    recommendError,
  };
};

export default useDetail;
