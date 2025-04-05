import * as S from '../Detail.Style';
import { H4 } from '@/components/ui/header/Header.Style';
import { FaRegCalendarAlt } from 'react-icons/fa';
import StateInput from '@/components/form/stateinput/StateInput';
import { LiaCertificateSolid } from 'react-icons/lia';
import useFirebaseListener from '@/hooks/useFirestoreListener';
import { getIsoTime } from '@/utils/utils';
import { Fragment } from 'react/jsx-runtime';
import { useEffect, useRef } from 'react';

const ChattingContainer: React.FC = () => {
  const { messagesDailyArray, sendMessage, isConnected, memberArray } =
    useFirebaseListener();
  const chattingBoxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chattingBoxRef.current)
      chattingBoxRef.current.scrollTop = chattingBoxRef.current.scrollHeight;
  }, [messagesDailyArray]);
  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (e.key === 'Enter') {
      sendMessage(target.value);
      target.value = '';
    }
  };

  return (
    <S.ChattingContainer>
      <H4>실시간 채팅</H4>
      <p className='descr'>
        이 상품을 보고있는 다른 회원님들이나 구매자와 소통해보세요!
      </p>
      <S.ChattingBox ref={chattingBoxRef}>
        {isConnected ? (
          <>
            <div className='notification'>채팅에 연결됐습니다.</div>
            {messagesDailyArray.map(([date, messages]) => (
              <Fragment key={`messageBox_${date}`}>
                <div className='date'>
                  <FaRegCalendarAlt />
                  {date}
                </div>
                {messages.map((msg, index, msgArr) => (
                  <div
                    key={`message_${msg.userId}_${index}`}
                    className={`${msg.messageType} ${
                      index > 0 && msg.userId === msgArr[index - 1].userId
                        ? 'hideHeader'
                        : ''
                    }`}
                  >
                    <span className={`header ${msg.messageType}`}>
                      {msg.isBuyer ? (
                        <span className='buyerTag'>
                          <LiaCertificateSolid color='white' />
                          구매자
                        </span>
                      ) : (
                        <></>
                      )}
                      {msg.messageType === 'myMessage'
                        ? '나'
                        : msg.messageType === 'userMessage'
                          ? `회원${memberArray.current.indexOf(msg.userId as string)}`
                          : ''}
                    </span>
                    <span>{msg.message}</span>
                    <span className='time'>
                      {getIsoTime(msg.createdAt as string)}
                    </span>
                  </div>
                ))}
              </Fragment>
            ))}
          </>
        ) : (
          <H4>채팅에 연결되지 않았습니다.</H4>
        )}
      </S.ChattingBox>
      <StateInput
        titleVisibility='hidden'
        placeholder='메세지를 입력하시고 엔터키로 전송하세요.'
        disabled={isConnected}
        attrs={{
          onKeyDown: handleKeydown,
        }}
      />
    </S.ChattingContainer>
  );
};

export default ChattingContainer;
