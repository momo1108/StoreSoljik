import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import { useParams } from 'react-router-dom';
// import * as S from './Category.Style';

const Category: React.FC = () => {
  const param = useParams();
  console.log(param);
  return (
    <>
      <Header userType={'buyer'}></Header>
      <Main>hello</Main>
    </>
  );
};

export default Category;
