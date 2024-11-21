import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import { H3, H4 } from '@/components/ui/header/Header.Style';
import * as S from './Items.Style';
import { RiListCheck } from 'react-icons/ri';
import HorizontalCard from '@/components/ui/productcard/horizontal/HorizontalCard';
import useItems from './useItems';
import Spinner from '@/components/ui/spinner/Spinner';
import Button from '@/components/ui/button/Button';

const Items: React.FC = () => {
  const {
    onClickRegistration,
    data,
    error,
    status,
    isFetchingNextPage,
    isLoading,
    ref,
    navigateToUpdate,
    deleteItem,
  } = useItems();
  return (
    <>
      <Header userType={'seller'}></Header>
      <Main>
        <S.ItemsContainer>
          <S.ItemsTitleHeader>
            <RiListCheck />
            판매 상품 관리
          </S.ItemsTitleHeader>
          <H3>판매 상품 상세 목록</H3>
          <S.ItemsListContainer>
            <S.ItemsListHeader>
              <H4>등록된 상품들</H4>
              <Button styleType='primary' onClick={onClickRegistration}>
                판매 상품 등록
              </Button>
            </S.ItemsListHeader>
            <S.ItemsListContentBox>
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
                data?.pages.map((page) => {
                  return page.dataArray.map((item) => {
                    return (
                      <HorizontalCard
                        data={item}
                        key={item.id}
                        handleClickUpdate={() => navigateToUpdate(item)}
                        handleClickDelete={() => {
                          if (
                            confirm(
                              `"${item.productName}" 상품을 삭제하시겠습니까?`,
                            )
                          )
                            deleteItem.mutate({
                              id: item.id,
                              category: item.productCategory,
                            });
                        }}
                      />
                    );
                  });
                })
              )}
              {!isLoading && isFetchingNextPage && (
                <S.SpinnerBox>
                  <Spinner spinnerSize={32}>
                    다음 판매 상품들을 불러오는 중입니다.
                  </Spinner>
                </S.SpinnerBox>
              )}
              <S.InViewDiv ref={ref}></S.InViewDiv>
            </S.ItemsListContentBox>
          </S.ItemsListContainer>
        </S.ItemsContainer>
      </Main>
    </>
  );
};

export default Items;
