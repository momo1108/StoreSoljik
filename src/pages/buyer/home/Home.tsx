import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import { defaultSetiing } from '@/components/ui/carousel/Carousel';
import VerticalCard from '@/components/ui/productcard/verticalcard/VerticalCard';
import * as S from './Home.Style';
import { FaFire } from 'react-icons/fa6';
import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import useHome from './useHome';
import CardCarousel from '@/components/ui/cardcarousel/CardCarousel';

const Home: React.FC = () => {
  const { allProductArray, productPerCategory } = useHome();
  return (
    <>
      <Header userType='buyer' />
      <Main>
        <S.HomeContainer>
          <S.HotItemBox>
            <S.HomeTitleHeader>
              <FaFire /> 오늘의 핫 아이템!
            </S.HomeTitleHeader>
            {allProductArray ? (
              <S.HotItemCarouselWrapper>
                <CardCarousel
                  data={allProductArray.slice(0, 5)}
                  settings={{
                    ...defaultSetiing,
                    autoplay: true,
                    autoplaySpeed: 6000,
                  }}
                />
              </S.HotItemCarouselWrapper>
            ) : (
              <S.HotItemCarouselSkeleton />
            )}
          </S.HotItemBox>
          {productPerCategory ? (
            Object.keys(productPerCategory).map((category) => {
              return (
                <S.CategoryBox key={`category_${category}`}>
                  <S.CategoryHeaderBox>
                    <Link to={`/category`} state={{ category }}>
                      <S.CategoryHeader>{category}</S.CategoryHeader>
                    </Link>
                    <Link to={`/category`} state={{ category }}>
                      <S.CategoryButton>
                        <FiPlus /> 더보기
                      </S.CategoryButton>
                    </Link>
                  </S.CategoryHeaderBox>
                  <S.ProductCardList>
                    {productPerCategory[category]
                      .slice(0, 4)
                      .map((product, index) => (
                        <VerticalCard
                          key={`${category}_${index}`}
                          data={product}
                        />
                      ))}
                  </S.ProductCardList>
                </S.CategoryBox>
              );
            })
          ) : (
            <>
              <S.CategoryBox>
                <S.CategoryHeaderBox>
                  <S.CategoryHeader>카테고리1</S.CategoryHeader>
                  <S.CategoryButton>
                    <FiPlus /> 더보기
                  </S.CategoryButton>
                </S.CategoryHeaderBox>
                <S.ProductCardList>
                  <S.VerticalCardSkeleton />
                  <S.VerticalCardSkeleton />
                  <S.VerticalCardSkeleton />
                  <S.VerticalCardSkeleton />
                </S.ProductCardList>
              </S.CategoryBox>
              <S.CategoryBox>
                <S.CategoryHeader>카테고리2</S.CategoryHeader>
              </S.CategoryBox>
            </>
          )}
        </S.HomeContainer>
      </Main>
    </>
  );
};

export default Home;
