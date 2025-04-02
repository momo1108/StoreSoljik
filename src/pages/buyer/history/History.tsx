import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import * as S from './History.Style';
import { H2, H3 } from '@/components/ui/header/Header.Style';
import OrderStatusList from './components/OrderStatusList';
import OrderListInfoContainer from './components/OrderListInfoContainer';

const History: React.FC = () => {
  return (
    <>
      <Header userType={'buyer'}></Header>
      <Main>
        <S.HistoryContainer>
          <H2>구매 내역</H2>
          <S.OrderStatusContainer>
            <OrderStatusList />
          </S.OrderStatusContainer>
          <S.OrderListContainer>
            <H3>구매 내역 목록</H3>
            <OrderListInfoContainer />
          </S.OrderListContainer>
        </S.HistoryContainer>
      </Main>
    </>
  );
};

export default History;
