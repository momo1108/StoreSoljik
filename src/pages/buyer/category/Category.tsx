import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import * as S from './Category.Style';

const Category: React.FC = () => {
  return (
    <>
      <Header userType={'buyer'}></Header>
      <Main>hello</Main>
    </>
  );
};

export default Category;
