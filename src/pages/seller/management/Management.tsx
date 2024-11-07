import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import useManagement from './useManagement';
import * as S from './Management.Style';
import { IoMdSettings } from 'react-icons/io';
import { BsTable } from 'react-icons/bs';
import VerticalSelect from '@/components/ui/filter/vertical/VerticalSelect';

const Management: React.FC = () => {
  const { productList, selectedProduct, setSelectedProduct } = useManagement();

  // https://dribbble.com/search/information-table
  return (
    <>
      <Header userType={'seller'}></Header>
      <Main>
        <S.ManagementContainer>
          <S.ManagementTitleBox>
            <S.ManagementTitleHeader>
              <IoMdSettings />
              주문 상태 관리
            </S.ManagementTitleHeader>
            <p>판매 등록된 상품들의 주문을 확인하고 상태를 갱신해주세요.</p>
          </S.ManagementTitleBox>
          <S.ManagementBodyContainer>
            <S.ManagementBodyHeader>
              <BsTable /> 주문목록표
            </S.ManagementBodyHeader>
            <S.ManagementOrderListFilter>
              {/* 주문 상태, 상품을 사용한 필터 */}
              <VerticalSelect>
                <VerticalSelect.Title>상품 목록</VerticalSelect.Title>
                <VerticalSelect.State state={selectedProduct?.productName} />
                <VerticalSelect.OptionList
                  handleChangeOption={setSelectedProduct}
                >
                  {productList.map((product) => (
                    <VerticalSelect.OptionItem
                      key={product.id}
                      value={product}
                      text={product.productName}
                      isActive={product.id === selectedProduct?.id}
                    />
                  ))}
                </VerticalSelect.OptionList>
              </VerticalSelect>
            </S.ManagementOrderListFilter>
          </S.ManagementBodyContainer>
        </S.ManagementContainer>
      </Main>
    </>
  );
};

export default Management;
