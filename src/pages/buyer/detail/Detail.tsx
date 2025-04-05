import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import * as S from './Detail.Style';
import { H2, H3, H4 } from '@/components/ui/header/Header.Style';
import useDetail from './useDetail';
import Carousel from '@/components/ui/carousel/Carousel';
import { Link } from 'react-router-dom';
import Loading from '@/pages/loading/Loading';
import Button from '@/components/ui/button/Button';
import { BiError } from 'react-icons/bi';
import { useTheme } from 'styled-components';
import HR from '@/components/ui/hr/HR';
import ChattingContainer from './components/ChattingContainer';
import InfoPricingBox from './components/InfoPricingBox';

const Detail: React.FC = () => {
  const {
    data,
    status,
    error,
    refetch,
    recommendData,
    recommendStatus,
    // recommendError,
  } = useDetail();
  const theme = useTheme();

  return (
    <>
      <Header userType='buyer' />
      <Main>
        {status === 'pending' ? (
          <Loading />
        ) : status === 'error' ? (
          <S.ErrorBox>
            <BiError size={200} />
            <H3>판매 상품을 불러오지 못했습니다.</H3>
            <H4>{error?.message}</H4>
            <Button styleType='primary' onClick={() => refetch()}>
              재시도
            </Button>
          </S.ErrorBox>
        ) : data ? (
          <S.DetailContainer>
            <S.ImageContainer>
              <S.CarouselWrapper>
                <Carousel data={data.productImageUrlMapArray} size={500} />
              </S.CarouselWrapper>
              <ChattingContainer />
            </S.ImageContainer>
            <S.InfoContainer>
              <S.InfoHeaderP>
                <Link to='/category'>카테고리</Link> {'>'}{' '}
                <Link to='/category' state={{ category: data.productCategory }}>
                  {data.productCategory}
                </Link>
              </S.InfoHeaderP>
              <S.InfoBodyWrapper>
                <S.InfoDescriptionBox>
                  <H3>{data.productName}</H3>
                  <S.PriceDiv>
                    <H4>판매가</H4>
                    <H2>{data.productPrice.toLocaleString()} 원</H2>
                  </S.PriceDiv>
                  <S.DescriptionP>{data.productDescription}</S.DescriptionP>
                </S.InfoDescriptionBox>
                <HR color={theme.color.brighterGray} />
                <InfoPricingBox data={data} />
                <HR color={theme.color.brighterGray} />
                <S.RecommendationBox>
                  <H3>추천 상품</H3>
                  <p>같은 카테고리의 다른 최신 상품들을 살펴보세요!</p>
                  <S.RecommendationImageList>
                    {recommendStatus === 'pending' ? (
                      <S.RecommendationSpinner spinnerSize={30}>
                        추천 상품을 불러오는 중입니다.
                      </S.RecommendationSpinner>
                    ) : recommendStatus === 'error' ? (
                      <S.RecommendationErrorBox>
                        <BiError size={200} />
                        <span>{'추천 상품을 불러오지 못했습니다.'}</span>
                        <span>{error?.message}</span>
                      </S.RecommendationErrorBox>
                    ) : recommendData ? (
                      recommendData.result
                        .slice(0, 10)
                        .map((product) => (
                          <S.RecommendationVerticalCard
                            key={`recommend_${product.id}`}
                            data={product}
                          />
                        ))
                    ) : (
                      <S.RecommendationErrorBox>
                        <BiError size={200} />
                        <span>{'추천 상품이 없습니다.'}</span>
                      </S.RecommendationErrorBox>
                    )}
                  </S.RecommendationImageList>
                </S.RecommendationBox>
              </S.InfoBodyWrapper>
            </S.InfoContainer>
          </S.DetailContainer>
        ) : (
          <S.ErrorBox>
            <BiError size={200} />
            <H3>존재하지 않는 상품입니다.</H3>
            <Button styleType='primary' onClick={() => refetch()}>
              재시도
            </Button>
          </S.ErrorBox>
        )}
      </Main>
    </>
  );
};

export default Detail;
