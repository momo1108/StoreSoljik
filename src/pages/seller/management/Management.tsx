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
} from '@/types/FirebaseType';

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
              <VerticalSelect>
                <VerticalSelect.Title>주문 상태</VerticalSelect.Title>
                <VerticalSelect.State />
                <VerticalSelect.OptionList
                  state={selectedOrderStatus}
                  handleChangeOption={setSelectedOrderStatus}
                >
                  {allOrderStatusArray.map((status) => (
                    <VerticalSelect.OptionItem
                      key={status}
                      value={status}
                      text={koreanOrderStatusMap[status]}
                    />
                  ))}
                </VerticalSelect.OptionList>
              </VerticalSelect>
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
            <S.OrderListTable>
              {filteredOrderData?.map((order) => order.orderName)}
            </S.OrderListTable>
          </S.BodyContainer>
        </S.ManagementContainer>
      </Main>
    </>
  );
};

export default Management;
