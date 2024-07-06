import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import Carousel from '@/components/ui/carousel/Carousel';
// import * as S from './Home.Style';

const Home: React.FC = () => {
  return (
    <>
      <Header userType='buyer' />
      <Main>
        <Carousel width={500} height={500} />
      </Main>
    </>
  );
};

export default Home;
