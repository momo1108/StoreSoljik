import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import * as S from './History.Style';
import { H2, H3, H4 } from '@/components/ui/header/Header.Style';
import {
  allOrderStatusArray,
  KoreanOrderStatus,
  koreanOrderStatusMap,
  OrderStatus,
} from '@/types/FirebaseType';
import { Fragment } from 'react';
import Button from '@/components/ui/button/Button';
import StatusBar from '@/components/ui/statusbar/StatusBar';
import { Link } from 'react-router-dom';
import HorizontalSelect from '@/components/ui/filter/horizontal/HorizontalSelect';
import Picture from '@/components/ui/picture/Picture';
import { useHistory, useStatusCountMap } from './useHistory';

const OrderStatusList: React.FC = () => {
  const orderStatusCountMap = useStatusCountMap();

  return (
    <S.OrderStatusList>
      {['주문 완료', '발송 대기', '발송 시작', '주문 취소'].map((status) => (
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
      ))}
    </S.OrderStatusList>
  );
};

const OrderListInfoContainer: React.FC = () => {
  const orderStatusCountMap = useStatusCountMap();
  const {
    dateOrderDataEntries,
    orderStatusForList,
    setOrderStatusForList,
    orderStatusMapKrToEn,
    ref,
    isCancelingOrder,
    cancelOrder,
  } = useHistory();
  return (
    <>
      <HorizontalSelect
        options={allOrderStatusArray
          .filter((status) => status !== OrderStatus.OrderCreated)
          .map((status) => ({
            name: `${koreanOrderStatusMap[status]} (${orderStatusCountMap[koreanOrderStatusMap[status]]})`,
            value: status,
          }))}
        state={orderStatusForList}
        handleChangeOption={(option) =>
          setOrderStatusForList(option.value as OrderStatus)
        }
      />
      <S.OrderListInfoContainer>
        {dateOrderDataEntries ? (
          dateOrderDataEntries.map(([buyDate, timeOrderDataEntries]) => (
            <S.OrderInfoPerDateContainer key={`infoContainer_${buyDate}`}>
              <H4>{buyDate}</H4>
              {timeOrderDataEntries.map(([buyTime, orderDataArray]) => (
                <S.OrderInfoBox key={`infoContainer_${buyDate}_${buyTime}`}>
                  <div>
                    <S.OrderDateP>
                      주문 일시 : {`${buyDate} ${buyTime}`}
                    </S.OrderDateP>
                    <H4 className='hideTextOverflow'>
                      {orderDataArray[0].orderName}
                    </H4>
                  </div>
                  {orderDataArray.map((order) => (
                    <Fragment
                      key={`${order.batchOrderId}_${order.orderData.id}`}
                    >
                      <S.OrderInfoContentBox>
                        <Picture
                          imageUrlMap={
                            order.orderData.productImageUrlMapArray[0]
                          }
                          size={120}
                        />
                        {/* <S.OrderImage
                    src={order.orderData.productImageUrlArray[0]}
                    alt={order.orderData.productName}
                  /> */}
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
                                [
                                  OrderStatus.ShipmentStarted,
                                  OrderStatus.OrderCancelled,
                                ].includes(order.orderStatus)
                                  ? 'disabled'
                                  : 'primary'
                              }
                              disabled={
                                [
                                  OrderStatus.ShipmentStarted,
                                  OrderStatus.OrderCancelled,
                                ].includes(order.orderStatus) ||
                                isCancelingOrder
                              }
                              onClick={() => cancelOrder(order)}
                            >
                              주문 취소
                            </Button>
                          </S.OrderContentMenuBox>
                          <S.OrderContentDescrBox>
                            <Link to={`/detail/${order.orderData.id}`}>
                              <H4 className='productNameHeader'>
                                {order.orderData.productName}
                              </H4>
                            </Link>
                            <p>
                              {order.orderData.productPrice.toLocaleString()} 원
                              ㆍ{' '}
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
              ))}
            </S.OrderInfoPerDateContainer>
          ))
        ) : (
          <S.OrderInfoPerDateContainer>
            <S.EmptyOrderInfoBox>
              <H3>구매 내역 정보가 없습니다.</H3>
            </S.EmptyOrderInfoBox>
          </S.OrderInfoPerDateContainer>
        )}

        <S.InViewDiv ref={ref}></S.InViewDiv>
      </S.OrderListInfoContainer>
    </>
  );
};

const History: React.FC = () => {
  return (
    <>
      <Header userType={'buyer'}></Header>
      <Main>
        <S.HistoryContainer>
          <H2>구매 내역</H2>
          <S.OrderStatusContainer>
            <OrderStatusList />
          </S.OrderStatusContainer>
          <S.OrderListContainer>
            <H3>구매 내역 목록</H3>
            <OrderListInfoContainer />
          </S.OrderListContainer>
        </S.HistoryContainer>
      </Main>
    </>
  );
};

export default History;
