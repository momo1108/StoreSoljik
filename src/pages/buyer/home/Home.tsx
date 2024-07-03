import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import * as S from './Home.Style';

const Home: React.FC = () => {
  return (
    <>
      <Header userType='buyer' />
      <Main>hello</Main>
    </>
  );
};

export default Home;
