import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import useCategory from './useCategory';
import VerticalCard from '@/components/ui/productcard/vertical/VerticalCard';
import * as S from './Category.Style';
import HorizontalSelect from '@/components/ui/filter/horizontal/HorizontalSelect';
import Spinner from '@/components/ui/spinner/Spinner';
import { H2 } from '@/components/ui/header/Header.Style';
import { ProductDirection, ProductField } from '@/services/productService';

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
          <S.FilterConatiner>
            <S.FilterBox>
              <S.Title>카테고리</S.Title>
              <HorizontalSelect
                options={
                  categories.length
                    ? [
                        { name: '전체', value: '전체' },
                        ...categories.map((categoryName) => ({
                          name: categoryName,
                          value: categoryName,
                        })),
                      ]
                    : []
                }
                state={filterOptions.category}
                handleChangeOption={(option) =>
                  setFilterOptions({
                    category: option.value,
                    field: 'createdAt',
                    direction: 'desc',
                  })
                }
                disabled={isPending}
              />
            </S.FilterBox>
            <S.FilterBox>
              <S.Title>정렬 기준</S.Title>
              <HorizontalSelect
                options={[
                  { name: '등록날짜순', value: 'createdAt' },
                  { name: '가격순', value: 'productPrice' },
                  { name: '판매량순', value: 'productSalesrate' },
                ]}
                state={filterOptions.field}
                handleChangeOption={(option) =>
                  setFilterOptions((prevFilter) => ({
                    ...prevFilter,
                    field: option.value as ProductField,
                    direction: 'desc',
                  }))
                }
                disabled={isPending}
              />
            </S.FilterBox>
            <S.FilterBox>
              <S.Title>정렬 순서</S.Title>
              <HorizontalSelect
                options={[
                  { name: '내림차순', value: 'desc' },
                  { name: '오름차순', value: 'asc' },
                ]}
                state={filterOptions.direction}
                handleChangeOption={(option) =>
                  setFilterOptions((prevFilter) => ({
                    ...prevFilter,
                    direction: option.value as ProductDirection,
                  }))
                }
                disabled={isPending}
              />
            </S.FilterBox>
          </S.FilterConatiner>
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
