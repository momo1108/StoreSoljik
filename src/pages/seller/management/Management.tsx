import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import useManagement from './useManagement';
import * as S from './Management.Style';
import { H2 } from '@/components/ui/header/Header.Style';

const Management: React.FC = () => {
  const {} = useManagement();

  return (
    <>
      <Header userType={'seller'}></Header>
      <Main>
        <S.ManagementContainer>
          <H2>주문 상태 관리</H2>
        </S.ManagementContainer>
      </Main>
    </>
  );
};

export default Management;
