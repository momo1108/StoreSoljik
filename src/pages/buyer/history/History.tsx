import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import * as S from './History.Style';
import { H2, H3 } from '@/components/ui/header/Header.Style';
import useHistory from './useHistory';
import { OrderStatus } from '@/types/FirebaseType';
import { createContext, memo, useContext, useState } from 'react';

type HistoryContextType = {
  selectedItem: OrderStatus | 'All';
  setSelectedItem: React.Dispatch<React.SetStateAction<OrderStatus | 'All'>>;
};
const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const HistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedItem, setSelectedItem] = useState<OrderStatus | 'All'>('All');

  return (
    <HistoryContext.Provider value={{ selectedItem, setSelectedItem }}>
      {children}
    </HistoryContext.Provider>
  );
};

const useHistoryContext = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error(
      'useCartUI 는 CartUIProvider 내부에서만 사용이 가능합니다.',
    );
  }
  return context;
};

// HistoryMenu 컴포넌트
const HistoryMenu = memo(() => {
  console.log('HistoryMenu rendered');
  const { selectedItem, setSelectedItem } = useHistoryContext();
  return (
    <nav>
      <S.OrderStatusMenuList>
        <li>
          <button onClick={() => setSelectedItem('All')}>메뉴 1</button>
        </li>
        <li>
          <button onClick={() => setSelectedItem(OrderStatus.OrderCompleted)}>
            메뉴 2
          </button>
        </li>
        <li>
          <button onClick={() => setSelectedItem(OrderStatus.AwaitingShipment)}>
            메뉴 3
          </button>
        </li>
        <li>
          <button onClick={() => setSelectedItem(OrderStatus.ShipmentStarted)}>
            메뉴 4
          </button>
        </li>
      </S.OrderStatusMenuList>
      {selectedItem}
    </nav>
  );
});

// HistoryList 컴포넌트
const HistoryList = memo(() => {
  const { selectedItem } = useHistoryContext();
  console.log('HistoryList rendered');
  return (
    <div>
      <p>Selected Item: {selectedItem}</p>
    </div>
  );
});

const History: React.FC = () => {
  console.log('history');

  return (
    <HistoryProvider>
      <Header userType={'buyer'}></Header>
      <Main>
        <S.CategoryContainer>
          <H2>구매 내역</H2>
          <HistoryMenu />
          <H3>구매 내역 목록</H3>
          <HistoryList />
        </S.CategoryContainer>
      </Main>
    </HistoryProvider>
  );
};

export default History;
