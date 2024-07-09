import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import * as S from './Detail.Style';
import { useParams } from 'react-router-dom';

const Detail: React.FC = () => {
  const param = useParams();
  console.log(param);
  return (
    <>
      <Header userType='buyer' />
      <Main>
        <S.DetailContainer>hi</S.DetailContainer>
      </Main>
    </>
  );
};

export default Detail;
