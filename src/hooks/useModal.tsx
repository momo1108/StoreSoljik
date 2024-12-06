import { useState, useContext, createContext } from 'react';
import { Children } from '@/types/GlobalType';

type AccountType = '구매자' | '판매자';

export interface UserInfo {
  uid: string;
  email: string;
  accountType: AccountType;
  nickname: string;
}

interface ModalContextProps {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextProps>({
  isOpen: false,
  openModal: () => null,
  closeModal: () => null,
});

export const ModalProvider = ({ children }: Children) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = () => {
    document.body.style.cssText = `
      position: fixed; 
      top: -${window.scrollY}px;
      overflow-y: scroll;
      width: 100%;`;
    setIsOpen(true);
  };
  const closeModal = () => {
    const scrollY = document.body.style.top;
    document.body.style.cssText = '';
    window.scrollTo(0, -parseInt(scrollY || '0', 10));
    setIsOpen(false);
  };
  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal 는 ModalProvider 내부에서만 사용이 가능합니다.');
  }
  return context;
};
