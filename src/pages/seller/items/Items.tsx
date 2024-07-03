import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import * as S from './Items.Style';

const Items: React.FC = () => {
  return (
    <>
      <Header userType={'seller'}></Header>
      <Main>hello</Main>
    </>
  );
};

export default Items;
