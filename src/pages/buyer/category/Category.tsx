import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import * as S from './Category.Style';
import { H2 } from '@/components/ui/header/Header.Style';
import CategoryMain from './components/CategoryMain';

const Category: React.FC = () => {
  return (
    <>
      <Header userType={'buyer'}></Header>
      <Main>
        <S.CategoryContainer>
          <H2>카테고리별 상품 조회</H2>
          <CategoryMain />
        </S.CategoryContainer>
      </Main>
    </>
  );
};

export default Category;
