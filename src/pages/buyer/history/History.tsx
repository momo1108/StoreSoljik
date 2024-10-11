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
    selectedBatchOrder,
    setSelectedBatchOrder,
    getGroupedOrderTotalPrice,
    allOrderData,
    allOrderError,
    allOrderStatus,
    batchOrderDataMap,
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
  const { isOpen, openModal } = useModal();

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
                {batchOrderDataMap && Object.keys(batchOrderDataMap).length ? (
                  Object.entries(batchOrderDataMap)
                    .sort(([date1], [date2]) => (date1 < date2 ? -1 : 1))
                    .reverse()
                    .map(([buyDate, batchOrderData]) => (
                      <Fragment key={`infoContainer_${buyDate}`}>
                        <H4>{buyDate}</H4>
                        {batchOrderData.map((order) => (
                          <S.OrderInfoBox
                            key={`${order.batchOrderId}_${order.orderData.id}`}
                          >
                            <S.OrderInfoMenuBox>
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
                            </S.OrderInfoMenuBox>
                            <S.OrderInfoContentBox>
                              <S.OrderImage
                                src={order.orderData.productImageUrlArray[0]}
                                alt={order.orderData.productName}
                              />
                              <S.OrderContentBox>
                                <div>
                                  <S.OrderDateP>
                                    주문 일시 : {getIsoDate(order.createdAt)}{' '}
                                    {getIsoTime(order.createdAt)}
                                  </S.OrderDateP>
                                  <H4 className='hideTextOverflow'>
                                    {order.orderName}
                                  </H4>
                                </div>
                                <p>
                                  총 결제 가격 :{' '}
                                  <strong>
                                    {getGroupedOrderTotalPrice(
                                      batchOrderData,
                                    ).toLocaleString()}{' '}
                                    원
                                  </strong>
                                </p>
                                <S.OrderDetailButton
                                  onClick={() => {
                                    setSelectedBatchOrder(batchOrderData);
                                    openModal();
                                  }}
                                >
                                  <CgDetailsMore /> 자세히 보기
                                </S.OrderDetailButton>
                              </S.OrderContentBox>
                            </S.OrderInfoContentBox>
                          </S.OrderInfoBox>
                        ))}
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
      {selectedBatchOrder && isOpen ? (
        <Modal>
          <Modal.Title>주문 상세 정보</Modal.Title>
          <HR borderStyle='dashed' />

          {/* <StatusBar>
            {['주문 완료', '발송 대기', '발송 시작', '주문 취소'].map(
              (status) => (
                <Fragment key={`selectedOrderDetailStatus_${status}`}>
                  <StatusBar.Status
                    isActive={
                      orderStatusMapKrToEn[status as KoreanOrderStatus] ===
                      selectedBatchOrder.orderStatus
                    }
                    statusType={status === '주문 취소' ? 'danger' : 'normal'}
                  >
                    {status}
                  </StatusBar.Status>
                  {status !== '주문 취소' ? (
                    <StatusBar.Boundary
                      boundaryType={status === '발송 시작' ? 'line' : 'bracket'}
                    />
                  ) : (
                    <></>
                  )}
                </Fragment>
              ),
            )}
          </StatusBar> */}
          <HR borderStyle='dashed' />
          <Modal.Body>
            {selectedBatchOrder.map(({ batchOrderId, orderData }) => (
              <S.OrderDetailListItemBox
                key={`${batchOrderId}_${orderData.productName}`}
              >
                <S.CarouselWrapperBox>
                  <Carousel data={orderData.productImageUrlArray} size={100} />
                </S.CarouselWrapperBox>
                <S.ItemInfoBox>
                  <H4 className='hideTextOverflow'>{orderData.productName}</H4>
                  <strong>₩ {orderData.productPrice.toLocaleString()}</strong>
                </S.ItemInfoBox>
                <S.ItemQuantityStrong>
                  {orderData.productQuantity.toLocaleString()} 개
                </S.ItemQuantityStrong>
              </S.OrderDetailListItemBox>
            ))}
          </Modal.Body>
          <HR borderStyle='dashed' />
          <Modal.Body>
            <S.OrderTotalPriceBox>
              <H4>총 결제액</H4>
              <strong>
                ₩{' '}
                {getGroupedOrderTotalPrice(selectedBatchOrder).toLocaleString()}
              </strong>
            </S.OrderTotalPriceBox>
          </Modal.Body>
        </Modal>
      ) : (
        <></>
      )}
    </>
  );
};

export default History;
