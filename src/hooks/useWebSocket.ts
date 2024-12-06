import { fetchOrders } from '@/services/orderService';
import { where } from 'firebase/firestore';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFirebaseAuth } from './useFirebaseAuth';
import { OrderStatus } from '@/types/FirebaseType';
import { getIsoDate, getKoreanIsoDatetime } from '@/utils/utils';

export type WebSocketMessageType = {
  type: 'notification' | 'message' | 'join' | 'error';
  roomId?: string;
  userId?: string;
  message?: string;
  isBuyer?: boolean;
  createdAt?: string;
};

const useWebSocket = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isBuyer, setIsBuyer] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<WebSocketMessageType[]>([]);
  const memberArray = useRef<string[]>([]);

  const param = useParams();
  const { userInfo } = useFirebaseAuth();

  useEffect(() => {
    console.log(param.id);
    if (param.id) {
      fetchOrders({
        filters: [
          where('buyerId', '==', userInfo?.uid),
          where('orderStatus', '==', OrderStatus.ShipmentStarted),
          where('orderData.id', '==', param.id),
        ],
      })
        .then((res) => {
          if (res.length) setIsBuyer(true);
          else setIsBuyer(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }

    setMessages([]);

    if (socketRef.current) {
      console.log('기존 WebSocket 연결 종료');
      socketRef.current.close();
    }

    // WebSocket 연결
    const socket = new WebSocket('ws://localhost:3000');
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket 연결 성공');
      joinChatting();
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      const data: WebSocketMessageType = JSON.parse(event.data);
      // console.log(`서버로부터 메시지 수신`);
      // console.dir(data);

      if (data.type === 'notification') return;

      if (data.userId && memberArray.current.indexOf(data.userId) === -1) {
        memberArray.current.push(data.userId as string);
      }
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.onclose = () => {
      console.log('WebSocket 연결 종료');
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error('WebSocket 에러:', error);
    };

    // 클린업
    return () => {
      console.log('WebSocket 연결 종료');
      if (socketRef.current) socketRef.current.close();
    };
  }, [param.id]);

  const getMessageType = (msg: WebSocketMessageType) => {
    if (msg.userId === userInfo?.uid) return 'myMessage';
    else return 'userMessage';
  };

  const messagesDailyArray = useMemo<
    Array<[string, (WebSocketMessageType & { messageType: string })[]]>
  >(() => {
    // console.dir(messages);
    const tempMessagesDailyArray: Record<string, WebSocketMessageType[]> = {};
    messages.forEach((messageData: WebSocketMessageType) => {
      const messageDate = getIsoDate(messageData.createdAt as string);
      if (tempMessagesDailyArray[messageDate]) {
        tempMessagesDailyArray[messageDate].push(messageData);
      } else {
        tempMessagesDailyArray[messageDate] = [messageData];
      }
    });
    return Object.entries(tempMessagesDailyArray)
      .sort(([date1], [date2]) => (date1 > date2 ? 1 : -1))
      .map(([date, messages]) => [
        date,
        messages.map((msg) => ({
          ...msg,
          messageType: getMessageType(msg),
        })),
      ]);
  }, [messages]);

  const joinChatting = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'join',
          roomId: param.id,
          userId: userInfo?.uid,
        }),
      );
    } else {
      console.error('WebSocket 연결이 열려있지 않습니다.');
    }
  };

  const sendMessage = (message: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'message',
          roomId: param.id,
          userId: userInfo?.uid,
          message,
          isBuyer,
          createdAt: getKoreanIsoDatetime(),
        }),
      );
    } else {
      console.error('WebSocket 연결이 열려있지 않습니다.');
    }
  };

  return {
    isConnected,
    messages,
    messagesDailyArray,
    sendMessage,
    memberArray,
    getMessageType,
  };
};

export default useWebSocket;
