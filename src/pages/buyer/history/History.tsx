import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import * as S from './History.Style';
import { H2, H3 } from '@/components/ui/header/Header.Style';
import useHistory from './useHistory';
import { OrderStatus } from '@/types/FirebaseType';
import { useState } from 'react';

const History: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<OrderStatus | 'All'>('All');
  useHistory();
  console.log('history');

  return (
    <>
      <Header userType={'buyer'}></Header>
      <Main>
        <S.CategoryContainer>
          <H2>구매 내역</H2>
          <nav>
            <S.OrderStatusMenuList>
              <li>
                <button onClick={() => setSelectedItem('All')}>메뉴 1</button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedItem(OrderStatus.OrderCompleted)}
                >
                  메뉴 2
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedItem(OrderStatus.AwaitingShipment)}
                >
                  메뉴 3
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedItem(OrderStatus.ShipmentStarted)}
                >
                  메뉴 4
                </button>
              </li>
            </S.OrderStatusMenuList>
            {selectedItem}
          </nav>
          <H3>구매 내역 목록</H3>
          <div>
            <p>Selected Item: {selectedItem}</p>
          </div>
        </S.CategoryContainer>
      </Main>
    </>
  );
};

export default History;
