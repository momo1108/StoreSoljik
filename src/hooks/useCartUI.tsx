import { createContext, useContext, useState, ReactNode } from 'react';

interface CartUIContextType {
  isOpen: boolean;
  toggleCart: () => void;
}

const CartUIContext = createContext<CartUIContextType | undefined>(undefined);

export const useCartUI = () => {
  const context = useContext(CartUIContext);
  if (!context) {
    throw new Error(
      'useCartUI 는 CartUIProvider 내부에서만 사용이 가능합니다.',
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

  return (
    <CartUIContext.Provider value={{ isOpen, toggleCart }}>
      {children}
    </CartUIContext.Provider>
  );
};
