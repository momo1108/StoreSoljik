import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import useCategory from './useCategory';
import VerticalCard from '@/components/ui/productcard/verticalcard/VerticalCard';
import * as S from './Category.Style';
import VerticalSelect from '@/components/ui/filter/VerticalSelect';
import Spinner from '@/components/ui/spinner/Spinner';
import { H2 } from '@/components/ui/header/Header.Style';

const Category: React.FC = () => {
  const {
    categories,
    filterOptions,
    setFilterOptions,
    data,
    status,
    error,
    isFetchingNextPage,
    isLoading,
    isPending,
    ref,
  } = useCategory();

  return (
    <>
      <Header userType={'buyer'}></Header>
      <Main>
        <S.CategoryContainer>
          <H2>카테고리별 상품 조회</H2>
          <S.FilterBox>
            {[
              {
                title: '카테고리',
                type: 'category',
                options: categories.length
                  ? [
                      { name: '전체', value: '전체' },
                      ...categories.map((categoryName) => ({
                        name: categoryName,
                        value: categoryName,
                      })),
                    ]
                  : [],
              },
              {
                title: '정렬 기준',
                type: 'field',
                options: [
                  { name: '등록날짜순', value: 'createdAt' },
                  { name: '가격순', value: 'productPrice' },
                  { name: '판매량순', value: 'productSalesrate' },
                ],
              },
              {
                title: '정렬 순서',
                type: 'direction',
                options: [
                  { name: '내림차순', value: 'desc' },
                  { name: '오름차순', value: 'asc' },
                ],
              },
            ].map((filterInfo) => (
              <VerticalSelect
                title={filterInfo.title}
                type={filterInfo.type as 'field' | 'direction' | 'category'}
                options={filterInfo.options}
                getter={filterOptions}
                setter={setFilterOptions}
                disabled={isPending}
                key={`select_${filterInfo.type}`}
              />
            ))}
          </S.FilterBox>
          <S.ProductCardList>
            {status === 'pending' ? (
              <S.SpinnerBox>
                <Spinner spinnerSize={32}>
                  판매 상품을 불러오는 중입니다.
                </Spinner>
              </S.SpinnerBox>
            ) : status === 'error' ? (
              <S.ErrorBox>
                {error?.message || '판매 상품을 불러오지 못했습니다.'}
              </S.ErrorBox>
            ) : (
              data?.pages.map((page, pageIndex) =>
                page.dataArray.map((product, productIndex) => (
                  <VerticalCard
                    key={`page${pageIndex}_product${productIndex}`}
                    data={product}
                  />
                )),
              )
            )}
            {!isLoading && isFetchingNextPage && (
              <S.SpinnerBox>
                <Spinner spinnerSize={32}>
                  다음 판매 상품들을 불러오는 중입니다.
                </Spinner>
              </S.SpinnerBox>
            )}
            <S.InViewDiv ref={ref}></S.InViewDiv>
          </S.ProductCardList>
        </S.CategoryContainer>
      </Main>
    </>
  );
};

export default Category;
