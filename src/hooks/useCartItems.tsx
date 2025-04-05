import {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import { useFirebaseAuth } from './useFirebaseAuth';
import { ProductSchema } from '@/types/FirebaseType';
import { useStateWithRef } from './useStateWithRef';

export interface CartItem {
  id: string;
  sellerId: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  productImageUrlMapArray: Record<string, string>[];
  // 추가적인 상품 정보...
}

type CartItemsStateContextType = {
  items: CartItem[];
  checkItemIsInCart: (product: ProductSchema | undefined) => boolean;
  cartSize: number;
  totalPrice: number;
};

type CartItemsActionsContextType = {
  addItem: (product: ProductSchema, quantity: number) => void;
  updateItem: (product: ProductSchema, quantity: number, max?: number) => void;
  removeItem: (product: ProductSchema) => void;
  clearCart: () => void;
  getItemsRef: () => React.MutableRefObject<CartItem[]>;
};

// CartItemsStateContext.ts
export const CartItemsStateContext = createContext<
  CartItemsStateContextType | undefined
>(undefined);

// CartItemsActionsContext.ts
export const CartItemsActionsContext = createContext<
  CartItemsActionsContextType | undefined
>(undefined);

export const useCartItemsState = () => {
  const context = useContext(CartItemsStateContext);
  if (!context) {
    throw new Error(
      'useCartItemsState 는 CartItemsProvider 내부에서만 사용이 가능합니다.',
    );
  }
  return context;
};

export const useCartItemsActions = () => {
  const context = useContext(CartItemsActionsContext);
  if (!context) {
    throw new Error(
      'useCartItemsActions 는 CartItemsProvider 내부에서만 사용이 가능합니다.',
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
  const [items, setItems, itemsRef] = useStateWithRef<CartItem[]>([]);
  const [ready, setReady] = useState<boolean>(false);

  const loadCartInfo = useCallback(() => {
    if (userInfo) {
      const savedCartItems = localStorage.getItem(`cartItems_${userInfo.uid}`);
      if (savedCartItems) setItems(JSON.parse(savedCartItems) as CartItem[]);
    }
  }, [userInfo]);

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

  const cartSize = useMemo(() => items.length, [items]);

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (accPrice, item) => accPrice + item.productPrice * item.productQuantity,
        0,
      ),
    [items],
  );

  const checkItemIsInCart = useCallback(
    (product: ProductSchema | undefined) =>
      product ? !!items.find((item) => item.id === product.id) : false,
    [items],
  );

  const addItem = useCallback(
    (product: ProductSchema, productQuantity: number) => {
      loadCartInfo();

      setItems((prevItems) => [
        ...prevItems,
        {
          id: product.id,
          sellerId: product.sellerId,
          productName: product.productName,
          productPrice: product.productPrice,
          productQuantity,
          productImageUrlMapArray: product.productImageUrlMapArray,
        },
      ]);
    },
    [loadCartInfo],
  );

  const updateItem = useCallback(
    (
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
    },
    [loadCartInfo],
  );

  const removeItem = useCallback(
    (product: ProductSchema) => {
      loadCartInfo();
      setItems((prevItems) =>
        prevItems.filter((item) => item.id !== product.id),
      );
    },
    [loadCartInfo],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemsRef = useCallback(() => itemsRef, [itemsRef]);

  const stateValue = useMemo(() => {
    return { items, cartSize, totalPrice, checkItemIsInCart };
  }, [items, cartSize, totalPrice, checkItemIsInCart]);

  const actionsValue = useMemo(() => {
    return {
      addItem,
      updateItem,
      removeItem,
      clearCart,
      getItemsRef,
    };
  }, [addItem, updateItem, removeItem, clearCart, getItemsRef]);

  return (
    <CartItemsStateContext.Provider value={stateValue}>
      <CartItemsActionsContext.Provider value={actionsValue}>
        {children}
      </CartItemsActionsContext.Provider>
    </CartItemsStateContext.Provider>
  );
};
