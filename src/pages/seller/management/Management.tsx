import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import * as S from './Management.Style';
import { IoMdSettings } from 'react-icons/io';
import { BsTable } from 'react-icons/bs';
import OrderListContainer from './components/OrderListContainer';

const Management: React.FC = () => {
  return (
    <>
      <Header userType={'seller'}></Header>
      <Main>
        <S.ManagementContainer>
          <S.TitleBox>
            <S.TitleHeader>
              <IoMdSettings />
              주문 상태 관리
            </S.TitleHeader>
            <p>판매 등록된 상품들의 주문을 확인하고 상태를 갱신해주세요.</p>
          </S.TitleBox>
          <S.BodyContainer>
            <S.BodyHeader>
              <BsTable /> 주문목록표
            </S.BodyHeader>
            <OrderListContainer />
          </S.BodyContainer>
        </S.ManagementContainer>
      </Main>
    </>
  );
};

export default Management;
