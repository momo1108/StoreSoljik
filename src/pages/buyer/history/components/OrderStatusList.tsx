import * as S from '../History.Style';
import { KoreanOrderStatus } from '@/types/FirebaseType';
import { Fragment } from 'react';
import { useStatusCountMap } from '../useHistory';

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

export default OrderStatusList;
