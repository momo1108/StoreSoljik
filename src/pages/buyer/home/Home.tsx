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
import { H3 } from '@/components/ui/header/Header.Style';

const Home: React.FC = () => {
  const {
    hotProductsArray,
    hotProductsStatus,
    categoryFetchStatus,
    recentProductsQueryPerCategory,
  } = useHome();
  return (
    <>
      <Header userType='buyer' />
      <Main>
        <S.HomeContainer>
          <S.HotItemBox>
            <S.HomeTitleHeader>
              <FaFire /> 오늘의 핫 아이템!
            </S.HomeTitleHeader>
            {hotProductsStatus === 'pending' ? (
              <S.HotItemCarouselSkeleton />
            ) : hotProductsStatus === 'error' ? (
              <S.HotItemCarouselSkeleton>
                <H3>인기 상품 데이터를 불러오지 못했습니다.</H3>
              </S.HotItemCarouselSkeleton>
            ) : (
              <S.HotItemCarouselWrapper>
                <CardCarousel
                  data={hotProductsArray?.slice(0, 5) || []}
                  settings={{
                    ...defaultSetiing,
                    autoplay: true,
                    autoplaySpeed: 6000,
                  }}
                />
              </S.HotItemCarouselWrapper>
            )}
          </S.HotItemBox>
          {categoryFetchStatus === 'pending' ? (
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
                <S.CategoryHeaderBox>
                  <S.CategoryHeader>카테고리2</S.CategoryHeader>
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
            </>
          ) : categoryFetchStatus === 'error' ? (
            <>
              <S.CategoryBox>
                <S.CategoryHeaderBox>
                  <S.CategoryHeader>카테고리1</S.CategoryHeader>
                  <S.CategoryButton>
                    <FiPlus /> 더보기
                  </S.CategoryButton>
                </S.CategoryHeaderBox>
                <S.ProductCardList>
                  <S.ErrorBox>
                    <H3>카테고리 정보를 불러오지 못했습니다.</H3>
                  </S.ErrorBox>
                </S.ProductCardList>
              </S.CategoryBox>
              <S.CategoryBox>
                <S.CategoryHeaderBox>
                  <S.CategoryHeader>카테고리2</S.CategoryHeader>
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
            </>
          ) : (
            recentProductsQueryPerCategory.map((categoryQuery, index) => {
              return (
                <S.CategoryBox
                  key={`category_${categoryQuery.data?.category || `category_${index}`}`}
                >
                  <S.CategoryHeaderBox>
                    <Link
                      to={`/category`}
                      state={{ category: categoryQuery.data?.category }}
                    >
                      <S.CategoryHeader>
                        {categoryQuery.data?.category || `카테고리${index + 1}`}
                      </S.CategoryHeader>
                    </Link>
                    <Link
                      to={`/category`}
                      state={{ category: categoryQuery.data?.category }}
                    >
                      <S.CategoryButton>
                        <FiPlus /> 더보기
                      </S.CategoryButton>
                    </Link>
                  </S.CategoryHeaderBox>
                  <S.ProductCardList>
                    {categoryQuery.data?.result
                      .slice(0, 4)
                      .map((product, index) => (
                        <VerticalCard
                          key={`${categoryQuery.data?.category || `category_${index}`}_${index}`}
                          data={product}
                        />
                      )) || (
                      <>
                        <S.VerticalCardSkeleton />
                        <S.VerticalCardSkeleton />
                        <S.VerticalCardSkeleton />
                        <S.VerticalCardSkeleton />
                      </>
                    )}
                  </S.ProductCardList>
                </S.CategoryBox>
              );
            })
          )}
        </S.HomeContainer>
      </Main>
    </>
  );
};

export default Home;
