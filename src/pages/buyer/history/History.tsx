import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import * as S from './History.Style';
import { H2, H3 } from '@/components/ui/header/Header.Style';
import useHistory from './useHistory';
import { KoreanOrderStatus, OrderStatus } from '@/types/FirebaseType';
import { Fragment, useState } from 'react';
import { FaGreaterThan } from 'react-icons/fa';
import { TbMinusVertical } from 'react-icons/tb';

const History: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<OrderStatus | 'All'>('All');
  const {
    allOrderData,
    allOrderError,
    allOrderStatus,
    orderStatusCount,
    orderStatus,
    setOrderStatus,
    data,
    status,
    error,
    isFetchingNextPage,
    isLoading,
    isPending,
    ref,
    pageSize,
  } = useHistory();
  console.log('history');

  return (
    <>
      <Header userType={'buyer'}></Header>
      <Main>
        <S.CategoryContainer>
          <H2>구매 내역</H2>
          <S.OrderStatusContainer>
            <H3>주문 현황</H3>
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
                          stroke='#2d3648'
                          strokeWidth={3}
                        >
                          <path d='M1.5,0 1.5,20' fill='none' />
                        </svg>
                      ) : (
                        <svg
                          className='greaterThanIcon'
                          viewBox='0 0 10 20'
                          width='10'
                          height='20'
                          stroke='#2d3648'
                          strokeWidth={3}
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
          <nav>
            <S.OrderStatusMenuList>
              <li>
                <button onClick={() => setSelectedItem('All')}>메뉴 1</button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedItem(OrderStatus.OrderCompleted)}
                >
                  메뉴 2
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedItem(OrderStatus.AwaitingShipment)}
                >
                  메뉴 3
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedItem(OrderStatus.ShipmentStarted)}
                >
                  메뉴 4
                </button>
              </li>
            </S.OrderStatusMenuList>
            {selectedItem}
          </nav>
          <H3>구매 내역 목록</H3>
          <div>
            <p>Selected Item: {selectedItem}</p>
          </div>
        </S.CategoryContainer>
      </Main>
    </>
  );
};

export default History;
