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
import HorizontalSelect from '@/components/ui/filter/horizontal/HorizontalSelect';
import { H3, H4 } from '@/components/ui/header/Header.Style';
import { getIsoDate, getIsoDay, getIsoTime } from '@/utils/utils';
import { FaBox, FaClock } from 'react-icons/fa6';
import { IoReceipt } from 'react-icons/io5';
import Picture from '@/components/ui/picture/Picture';

const OrderListContainer: React.FC = () => {
  const {
    selectedOrderStatus,
    setSelectedOrderStatus,
    productList,
    selectedProduct,
    setSelectedProduct,
    orderDataPerDate,
    handleChangeOptionOrderStatus,
    ref,
  } = useManagement();
  return (
    <>
      <S.OrderListFilter>
        {/* 주문 상태, 상품을 사용한 필터 */}
        <HorizontalSelect
          options={allOrderStatusArray
            .filter((status) => status !== OrderStatus.OrderCreated)
            .map((status) => ({
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
            <VerticalSelect.OptionItem value={undefined} text={'전체'} />
            {productList
              .sort((p1, p2) => (p1.productName > p2.productName ? 1 : -1))
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
        {orderDataPerDate.length ? (
          orderDataPerDate.map(([month, orderDataArray]) => (
            <S.OrderPerMonthContainer key={`orderContainer_${month}`}>
              <H4>{month}</H4>
              {/* 날짜 | 주문시간, 주문상품 | 주문 수량, 상품 금액 + 총 금액 */}
              {orderDataArray.map((order) => (
                <S.OrderInfoBox key={`order_${order.orderId}`}>
                  <S.DayBox>
                    <strong>{getIsoDay(order.createdAt)}</strong>
                    <H3>{getIsoDate(order.createdAt).split('-')[2]}</H3>
                  </S.DayBox>
                  <Picture
                    imageUrlMap={order.orderData.productImageUrlMapArray[0]}
                    size={52}
                    alt={`${order.orderData.productName}_이미지`}
                  />
                  <S.ProductBox>
                    <div className='date'>
                      <FaClock />
                      <span>
                        {getIsoDate(order.createdAt)}{' '}
                        {getIsoTime(order.createdAt)}
                      </span>
                    </div>
                    <div className='product'>
                      <FaBox />
                      <p
                        className='hideTextOverflow'
                        title={order.orderData.productName}
                      >
                        {order.orderData.productName}
                      </p>
                    </div>
                  </S.ProductBox>
                  <S.PaymentBox>
                    <div className='totalPrice'>
                      <IoReceipt />
                      <p>
                        {(
                          order.orderData.productPrice *
                          order.orderData.productQuantity
                        ).toLocaleString()}{' '}
                        원
                      </p>
                    </div>
                    <p className='priceAndCount'>
                      ( {order.orderData.productPrice.toLocaleString()} 원 *{' '}
                      {order.orderData.productQuantity.toLocaleString()} 개 )
                    </p>
                  </S.PaymentBox>
                  <S.StatusSelectBox>
                    <VerticalSelect>
                      <VerticalSelect.Title>
                        주문 상태 변경
                      </VerticalSelect.Title>
                      <VerticalSelect.State
                        stateText={koreanOrderStatusMap[order.orderStatus]}
                      />
                      <VerticalSelect.OptionList
                        state={order.orderStatus}
                        handleChangeOption={(value) =>
                          handleChangeOptionOrderStatus(value, order)
                        }
                      >
                        {allOrderStatusArray
                          .filter(
                            (status) =>
                              ![
                                OrderStatus.All,
                                OrderStatus.OrderCreated,
                              ].includes(status),
                          )
                          .map((status) => (
                            <VerticalSelect.OptionItem
                              key={status}
                              text={koreanOrderStatusMap[status]}
                              value={status}
                            />
                          ))}
                      </VerticalSelect.OptionList>
                    </VerticalSelect>
                  </S.StatusSelectBox>
                </S.OrderInfoBox>
              ))}
            </S.OrderPerMonthContainer>
          ))
        ) : (
          <S.OrderPerMonthContainer>
            <S.EmptyOrderInfoBox>
              <H4>해당하는 주문 정보가 없습니다.</H4>
            </S.EmptyOrderInfoBox>
          </S.OrderPerMonthContainer>
        )}
        <div ref={ref} />
      </S.OrderListContainer>
    </>
  );
};

const Management: React.FC = () => {
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
            <OrderListContainer />
          </S.BodyContainer>
        </S.ManagementContainer>
      </Main>
    </>
  );
};

export default Management;
