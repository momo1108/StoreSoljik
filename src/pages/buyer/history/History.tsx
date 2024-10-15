import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import * as S from './History.Style';
import { H2, H3, H4 } from '@/components/ui/header/Header.Style';
import useHistory from './useHistory';
import { KoreanOrderStatus, OrderStatus } from '@/types/FirebaseType';
import { Fragment } from 'react';
import Button from '@/components/ui/button/Button';
import { getIsoDate, getIsoTime } from '@/utils/utils';
import { CgDetailsMore } from 'react-icons/cg';
import Modal from '@/components/modal/Modal';
import { useModal } from '@/hooks/useModal';
import HR from '@/components/ui/hr/HR';
import Carousel from '@/components/ui/carousel/Carousel';
import StatusBar from '@/components/ui/statusbar/StatusBar';

const History: React.FC = () => {
  const {
    getGroupedOrderTotalPrice,
    allOrderData,
    allOrderError,
    allOrderStatus,
    batchOrderDataEntries,
    orderStatusCountMap,
    orderStatusForList,
    setOrderStatusForList,
    orderStatusMapKrToEn,
    orderStatusMapEnToKr,
    data,
    status,
    error,
    isFetchingNextPage,
    isLoading,
    isPending,
    ref,
    pageSize,
    isCancelingOrder,
    cancelOrder,
  } = useHistory();

  return (
    <>
      <Header userType={'buyer'}></Header>
      <Main>
        <S.CategoryContainer>
          <H2>구매 내역</H2>
          <S.OrderStatusContainer>
            <S.OrderStatusList>
              {['주문 완료', '발송 대기', '발송 시작', '주문 취소'].map(
                (status) => (
                  <Fragment key={`orderstatus_${status}`}>
                    <S.OrderStatusListElement
                      className={status === '주문 취소' ? 'lastLi' : ''}
                    >
                      <p className='statusCountP'>
                        <span className='statusCountSpan'>
                          {orderStatusCountMap[status as KoreanOrderStatus]}
                        </span>{' '}
                        건
                      </p>
                      <p>{status}</p>
                    </S.OrderStatusListElement>
                    {status !== '주문 취소' ? (
                      status === '발송 시작' ? (
                        <svg
                          className='verticalMinusIcon'
                          viewBox='0 0 3 20'
                          width='3'
                          height='20'
                        >
                          <path d='M1.5,0 1.5,20' strokeDasharray='2 1' />
                        </svg>
                      ) : (
                        <svg
                          className='greaterThanIcon'
                          viewBox='0 0 10 20'
                          width='10'
                          height='20'
                        >
                          <path d='M0,0 10,10 0,20' fill='none' />
                        </svg>
                      )
                    ) : (
                      <></>
                    )}
                  </Fragment>
                ),
              )}
            </S.OrderStatusList>
          </S.OrderStatusContainer>
          <S.OrderListContainer>
            <H3>구매 내역 목록</H3>
            <S.OrderListMenu>
              {['전체', '주문 완료', '발송 대기', '발송 시작', '주문 취소'].map(
                (status) => (
                  <li key={`orderMenu_${status}`}>
                    <S.OrderListMenuButton
                      onClick={() =>
                        setOrderStatusForList(
                          orderStatusMapKrToEn[
                            status as KoreanOrderStatus | '전체'
                          ],
                        )
                      }
                      styleType={
                        orderStatusForList ===
                        orderStatusMapKrToEn[
                          status as KoreanOrderStatus | '전체'
                        ]
                          ? 'primary'
                          : 'normal'
                      }
                    >
                      {status}
                      <span className='countSpan'>
                        (
                        {
                          orderStatusCountMap[
                            status as KoreanOrderStatus | '전체'
                          ]
                        }
                        )
                      </span>
                    </S.OrderListMenuButton>
                  </li>
                ),
              )}
            </S.OrderListMenu>
            <S.OrderListInfoContainer>
              <S.OrderInfoPerDateContainer>
                {batchOrderDataEntries ? (
                  batchOrderDataEntries.map(([buyDate, batchOrderData]) => (
                    <Fragment key={`infoContainer_${buyDate}`}>
                      <H4>{buyDate}</H4>
                      <S.OrderInfoBox>
                        <div>
                          <S.OrderDateP>
                            주문 일시 :{' '}
                            {getIsoDate(batchOrderData[0].createdAt)}{' '}
                            {getIsoTime(batchOrderData[0].createdAt)}
                          </S.OrderDateP>
                          <H4 className='hideTextOverflow'>
                            {batchOrderData[0].orderName}
                          </H4>
                        </div>
                        {batchOrderData.map((order) => (
                          <Fragment
                            key={`${order.batchOrderId}_${order.orderData.id}`}
                          >
                            <S.OrderInfoContentBox>
                              <S.OrderImage
                                src={order.orderData.productImageUrlArray[0]}
                                alt={order.orderData.productName}
                              />
                              <S.OrderContentBox>
                                <S.OrderContentMenuBox>
                                  <StatusBar>
                                    {[
                                      '주문 완료',
                                      '발송 대기',
                                      '발송 시작',
                                      '주문 취소',
                                    ].map((status) => (
                                      <Fragment
                                        key={`selectedOrderDetailStatus_${status}`}
                                      >
                                        <StatusBar.Status
                                          isActive={
                                            orderStatusMapKrToEn[
                                              status as KoreanOrderStatus
                                            ] === order.orderStatus
                                          }
                                          statusType={
                                            status === '주문 취소'
                                              ? 'danger'
                                              : 'normal'
                                          }
                                        >
                                          {status}
                                        </StatusBar.Status>
                                        {status !== '주문 취소' ? (
                                          <StatusBar.Boundary
                                            boundaryType={
                                              status === '발송 시작'
                                                ? 'line'
                                                : 'bracket'
                                            }
                                          />
                                        ) : (
                                          <></>
                                        )}
                                      </Fragment>
                                    ))}
                                  </StatusBar>
                                  <Button
                                    styleType={
                                      order.orderStatus ===
                                        OrderStatus.ShipmentStarted ||
                                      order.orderStatus ===
                                        OrderStatus.OrderCancelled
                                        ? 'disabled'
                                        : 'primary'
                                    }
                                    disabled={
                                      order.orderStatus ===
                                        OrderStatus.ShipmentStarted ||
                                      order.orderStatus ===
                                        OrderStatus.OrderCancelled ||
                                      isCancelingOrder
                                    }
                                    onClick={() => cancelOrder(order)}
                                  >
                                    주문 취소
                                  </Button>
                                </S.OrderContentMenuBox>
                                <S.OrderContentDescrBox>
                                  <H4>{order.orderData.productName}</H4>
                                  <p>
                                    {order.orderData.productPrice.toLocaleString()}{' '}
                                    원 ㆍ{' '}
                                    {order.orderData.productQuantity.toLocaleString()}{' '}
                                    개 ={' '}
                                    <span>
                                      {(
                                        order.orderData.productPrice *
                                        order.orderData.productQuantity
                                      ).toLocaleString()}{' '}
                                      원
                                    </span>
                                  </p>
                                </S.OrderContentDescrBox>
                              </S.OrderContentBox>
                            </S.OrderInfoContentBox>
                          </Fragment>
                        ))}
                      </S.OrderInfoBox>
                    </Fragment>
                  ))
                ) : (
                  <S.EmptyOrderInfoBox>
                    <H3>구매 내역 정보가 없습니다.</H3>
                  </S.EmptyOrderInfoBox>
                )}
              </S.OrderInfoPerDateContainer>

              <S.InViewDiv ref={ref}></S.InViewDiv>
            </S.OrderListInfoContainer>
          </S.OrderListContainer>
        </S.CategoryContainer>
      </Main>
    </>
  );
};

export default History;
