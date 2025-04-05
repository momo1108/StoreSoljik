import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import { H3, H4 } from '@/components/ui/header/Header.Style';
import * as S from './Items.Style';
import { RiListCheck } from 'react-icons/ri';
import HorizontalCard from '@/components/ui/productcard/horizontal/HorizontalCard';
import useItems from './useItems';
import Spinner from '@/components/ui/spinner/Spinner';
import Button from '@/components/ui/button/Button';
import { BiError } from 'react-icons/bi';

const ItemsListContentBox: React.FC = () => {
  const {
    registeredData,
    error,
    status,
    isFetchingNextPage,
    isLoading,
    ref,
    handleClickUpdate,
    handleClickDelete,
  } = useItems();
  return (
    <S.ItemsListContentBox>
      {status === 'pending' ? (
        <S.SpinnerBox>
          <Spinner spinnerSize={32}>판매 상품을 불러오는 중입니다.</Spinner>
        </S.SpinnerBox>
      ) : status === 'error' ? (
        <S.ErrorBox>
          {error?.message || '판매 상품을 불러오지 못했습니다.'}
        </S.ErrorBox>
      ) : registeredData.length ? (
        registeredData.map((item) => {
          return (
            <HorizontalCard
              data={item}
              key={item.id}
              handleClickUpdate={() => handleClickUpdate(item)}
              handleClickDelete={() => handleClickDelete(item)}
            />
          );
        })
      ) : (
        <S.EmptyBox>
          <BiError size={200} />
          등록된 상품이 없습니다.
        </S.EmptyBox>
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
  );
};

const Items: React.FC = () => {
  const { handleClickRegistration } = useItems();
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
              <Button styleType='primary' onClick={handleClickRegistration}>
                판매 상품 등록
              </Button>
            </S.ItemsListHeader>
            <ItemsListContentBox />
          </S.ItemsListContainer>
        </S.ItemsContainer>
      </Main>
    </>
  );
};

export default Items;
