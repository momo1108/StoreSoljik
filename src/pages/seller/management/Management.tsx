import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import useManagement from './useManagement';
import * as S from './Management.Style';
import { IoMdSettings } from 'react-icons/io';
import { BsTable } from 'react-icons/bs';
import VerticalSelect from '@/components/ui/filter/vertical/VerticalSelect';
import {
  allOrderStatusArray,
  koreanOrderStatusMap,
  OrderStatus,
} from '@/types/FirebaseType';
import { MdFilterList } from 'react-icons/md';
import HorizontalSelect from '@/components/ui/filter/horizontal/HorizontalSelect';
import { H4 } from '@/components/ui/header/Header.Style';

const Management: React.FC = () => {
  const {
    selectedOrderStatus,
    setSelectedOrderStatus,
    productList,
    selectedProduct,
    setSelectedProduct,
    timeOrderStatus,
    filteredOrderData,
  } = useManagement();

  // https://dribbble.com/search/information-table
  return (
    <>
      <Header userType={'seller'}></Header>
      <Main>
        <S.ManagementContainer>
          <S.TitleBox>
            <S.TitleHeader>
              <IoMdSettings />
              주문 상태 관리
            </S.TitleHeader>
            <p>판매 등록된 상품들의 주문을 확인하고 상태를 갱신해주세요.</p>
          </S.TitleBox>
          <S.BodyContainer>
            <S.BodyHeader>
              <BsTable /> 주문목록표
            </S.BodyHeader>
            <S.OrderListFilter>
              {/* 주문 상태, 상품을 사용한 필터 */}
              <HorizontalSelect
                options={allOrderStatusArray.map((status) => ({
                  name: koreanOrderStatusMap[status],
                  value: status,
                }))}
                state={selectedOrderStatus}
                handleChangeOption={(option) =>
                  setSelectedOrderStatus(option.value as OrderStatus)
                }
              />
              <VerticalSelect useSearch>
                <VerticalSelect.Title>상품 목록</VerticalSelect.Title>
                <VerticalSelect.State placeholder='상품을 검색해주세요' />
                <VerticalSelect.OptionList
                  state={selectedProduct}
                  handleChangeOption={setSelectedProduct}
                >
                  {productList
                    .sort((p1, p2) =>
                      p1.productName > p2.productName ? 1 : -1,
                    )
                    .map((product) => (
                      <VerticalSelect.OptionItem
                        key={product.id}
                        value={product}
                        text={product.productName}
                      />
                    ))}
                </VerticalSelect.OptionList>
              </VerticalSelect>
            </S.OrderListFilter>
            <S.OrderListContainer>
              <S.OrderPerMonthContainer>
                {/* 날짜 | 주문시간, 주문상품 | 주문 수량, 상품 금액 + 총 금액 */}
                {filteredOrderData?.map((order) => <H4>몇월</H4>)}
              </S.OrderPerMonthContainer>
            </S.OrderListContainer>
          </S.BodyContainer>
        </S.ManagementContainer>
      </Main>
    </>
  );
};

export default Management;
