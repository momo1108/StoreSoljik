import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import * as S from './History.Style';
import { H2, H3 } from '@/components/ui/header/Header.Style';

const History: React.FC = () => {
  return (
    <>
      <Header userType={'buyer'}></Header>
      <Main>
        <S.CategoryContainer>
          <H2>구매 내역</H2>
          <S.OrderStatusBox>상태별 디스플레이 영역</S.OrderStatusBox>
          <H3>구매 내역 목록</H3>
        </S.CategoryContainer>
      </Main>
    </>
  );
};

export default History;
