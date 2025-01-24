import {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  useEffect,
} from 'react';
import { useFirebaseAuth } from './useFirebaseAuth';
import { ProductSchema } from '@/types/FirebaseType';

export interface CartItem {
  id: string;
  sellerId: string;
  sellerEmail: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  productImageUrlMapArray: Record<string, string>[];
  // 추가적인 상품 정보...
}

interface CartItemsContextType {
  items: CartItem[];
  cartSize: number;
  totalPrice: number;
  addItem: (product: ProductSchema, productQuantity: number) => void;
  updateItem: (
    product: ProductSchema,
    productQuantity: number,
    maxQuantity?: number,
  ) => void;
  removeItem: (product: ProductSchema) => void;
  checkItemIsInCart: (product: ProductSchema | undefined) => boolean;
  clearCart: () => void;
}

const CartItemsContext = createContext<CartItemsContextType | undefined>(
  undefined,
);

export const useCartItems = () => {
  const context = useContext(CartItemsContext);
  if (!context) {
    throw new Error(
      'useCartItems 는 CartItemsProvider 내부에서만 사용이 가능합니다.',
    );
  }
  return context;
};

interface CartItemsProviderProps {
  children: ReactNode;
}

/**
 * 장바구니 내 데이터를 저장할 Context 의 Provider
 * LocalStorage 를 체크해서 장바구니 상태를 초기화합니다.
 */
export const CartItemsProvider = ({ children }: CartItemsProviderProps) => {
  const { userInfo } = useFirebaseAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    loadCartInfo();
    window.addEventListener('focus', loadCartInfo);
  }, []);

  useEffect(() => {
    // items 의 초기값이 localStorage 를 덮어쓰는 것을 방지하기 위해 ready state 를 사용
    if (ready) {
      localStorage.setItem(`cartItems_${userInfo?.uid}`, JSON.stringify(items));

      const handleBeforeUnload = () => {
        localStorage.setItem(
          `cartItems_${userInfo?.uid}`,
          JSON.stringify(items),
        );
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    } else setReady(true);
  }, [items, ready]);

  const totalPrice = items.reduce(
    (accPrice, item) => accPrice + item.productPrice * item.productQuantity,
    0,
  );

  const loadCartInfo = () => {
    const savedCartItems = localStorage.getItem(`cartItems_${userInfo?.uid}`);
    if (savedCartItems) setItems(JSON.parse(savedCartItems) as CartItem[]);
  };

  const addItem = (product: ProductSchema, productQuantity: number) => {
    loadCartInfo();

    setItems((prevItems) => [
      ...prevItems,
      {
        id: product.id,
        sellerId: product.sellerId,
        sellerEmail: product.sellerEmail,
        productName: product.productName,
        productPrice: product.productPrice,
        productQuantity,
        productImageUrlMapArray: product.productImageUrlMapArray,
      },
    ]);
  };

  const updateItem = (
    product: ProductSchema,
    productQuantity: number,
    maxQuantity: number = 200,
  ) => {
    loadCartInfo();

    if (isNaN(productQuantity)) return;

    if (productQuantity < 1) productQuantity = 1;
    else if (productQuantity > maxQuantity) productQuantity = maxQuantity;

    setItems((prevItems) =>
      prevItems.map(
        (item): CartItem =>
          item.id === product.id ? { ...item, productQuantity } : item,
      ),
    );
  };

  const removeItem = (product: ProductSchema) => {
    loadCartInfo();
    setItems((prevItems) => prevItems.filter((item) => item.id !== product.id));
  };

  const checkItemIsInCart = (product: ProductSchema | undefined) =>
    product ? !!items.find((item) => item.id === product.id) : false;

  const clearCart = () => {
    setItems([]);
  };

  const value = useMemo(
    () => ({
      items,
      cartSize: items.length,
      totalPrice,
      addItem,
      updateItem,
      removeItem,
      checkItemIsInCart,
      clearCart,
    }),
    [items],
  );

  return (
    <CartItemsContext.Provider value={value}>
      {children}
    </CartItemsContext.Provider>
  );
};
