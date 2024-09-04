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

const History: React.FC = () => {
  const {
    allOrderData,
    allOrderError,
    allOrderStatus,
    orderStatusCount,
    orderStatus,
    setOrderStatus,
    orderStatusMapKrToEn,
    orderStatusMapEnToKr,
    data,
    dataCategorizedByDate,
    status,
    error,
    isFetchingNextPage,
    isLoading,
    isPending,
    ref,
    pageSize,
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
                          {orderStatusCount[status as KoreanOrderStatus]}
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
                        setOrderStatus(
                          orderStatusMapKrToEn[
                            status as KoreanOrderStatus | '전체'
                          ],
                        )
                      }
                      styleType={
                        orderStatus ===
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
                        {orderStatusCount[status as KoreanOrderStatus | '전체']}
                        )
                      </span>
                    </S.OrderListMenuButton>
                  </li>
                ),
              )}
            </S.OrderListMenu>
            <S.OrderListInfoContainer>
              {dataCategorizedByDate &&
              Object.keys(dataCategorizedByDate).length ? (
                Object.keys(dataCategorizedByDate)
                  .sort()
                  .reverse()
                  .map((buyDate) => (
                    <S.OrderInfoPerDateContainer
                      key={`infoContainer_${buyDate}`}
                    >
                      <H4>{buyDate}</H4>
                      {dataCategorizedByDate[buyDate].map((order) => (
                        <S.OrderInfoBox>
                          <S.OrderInfoMenuBox>
                            <H4>
                              {[
                                '주문 완료',
                                '발송 대기',
                                '발송 시작',
                                '주문 취소',
                              ].map((status) => (
                                <Fragment
                                  key={`orderListElementMenu_${status}`}
                                >
                                  <span
                                    className={
                                      orderStatusMapKrToEn[
                                        status as KoreanOrderStatus
                                      ] === order.orderStatus
                                        ? status === '주문 취소'
                                          ? 'activeCancel'
                                          : 'active'
                                        : 'inactive'
                                    }
                                  >
                                    {status}
                                  </span>
                                  {status !== '주문 취소' ? (
                                    status === '발송 시작' ? (
                                      <svg
                                        className='verticalMinusIcon'
                                        viewBox='0 0 3 20'
                                        width='3'
                                        height='20'
                                      >
                                        <path
                                          d='M1.5,0 1.5,20'
                                          strokeDasharray='2 1'
                                        />
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
                              ))}
                            </H4>
                            <Button
                              styleType={
                                [
                                  OrderStatus.ShipmentStarted,
                                  OrderStatus.OrderCancelled,
                                ].includes(order.orderStatus)
                                  ? 'disabled'
                                  : 'primary'
                              }
                            >
                              주문 취소
                            </Button>
                          </S.OrderInfoMenuBox>
                          <S.OrderInfoContentBox>
                            <S.OrderImage
                              src={
                                order.cartItemsArray[0].productImageUrlArray[0]
                              }
                              alt={order.cartItemsArray[0].productName}
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
                                  {order.cartItemsArray
                                    .reduce(
                                      (prev, cur) =>
                                        prev +
                                        cur.productPrice * cur.productQuantity,
                                      0,
                                    )
                                    .toLocaleString()}{' '}
                                  원
                                </strong>
                              </p>
                              <S.OrderDetailButton>
                                <CgDetailsMore /> 자세히 보기
                              </S.OrderDetailButton>
                            </S.OrderContentBox>
                          </S.OrderInfoContentBox>
                          <S.OrderDetailBox>hello</S.OrderDetailBox>
                        </S.OrderInfoBox>
                      ))}
                    </S.OrderInfoPerDateContainer>
                  ))
              ) : (
                <S.OrderInfoPerDateContainer>
                  <H3>구매 내역 정보가 없습니다.</H3>
                </S.OrderInfoPerDateContainer>
              )}
            </S.OrderListInfoContainer>
          </S.OrderListContainer>
        </S.CategoryContainer>
      </Main>
    </>
  );
};

export default History;
