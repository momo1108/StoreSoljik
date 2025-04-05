import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface CartUIStateContextType {
  isOpen: boolean;
}

interface CartUIActionsContextType {
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartUIStateContext = createContext<CartUIStateContextType | undefined>(
  undefined,
);
const CartUIActionsContext = createContext<
  CartUIActionsContextType | undefined
>(undefined);

export const useCartUIState = () => {
  const context = useContext(CartUIStateContext);
  if (!context) {
    throw new Error(
      'useCartUIState 는 CartUIStateProvider 내부에서만 사용이 가능합니다.',
    );
  }
  return context;
};

export const useCartUIActions = () => {
  const context = useContext(CartUIActionsContext);
  if (!context) {
    throw new Error(
      'useCartUIActions 는 CartUIActionsProvider 내부에서만 사용이 가능합니다.',
    );
  }
  return context;
};

interface CartUIProviderProps {
  children: ReactNode;
}

export const CartUIProvider = ({ children }: CartUIProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCart = () => {
    setIsOpen((prev) => !prev);
  };

  const openCart = () => {
    setIsOpen(true);
  };

  const closeCart = () => {
    setIsOpen(false);
  };

  const cartUIStateValue = useMemo(() => {
    return {
      isOpen,
    };
  }, [isOpen]);

  const cartUIActionsValue = useMemo(() => {
    return {
      toggleCart,
      openCart,
      closeCart,
    };
  }, []);

  return (
    <CartUIStateContext.Provider value={cartUIStateValue}>
      <CartUIActionsContext.Provider value={cartUIActionsValue}>
        {children}
      </CartUIActionsContext.Provider>
    </CartUIStateContext.Provider>
  );
};
