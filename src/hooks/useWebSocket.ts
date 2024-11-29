import { fetchOrders } from '@/services/orderService';
import { where } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFirebaseAuth } from './useFirebaseAuth';
import { OrderStatus } from '@/types/FirebaseType';

export type WebSocketMessageType = {
  type: 'notification' | 'message' | 'join';
  roomId?: string;
  userId?: string;
  message?: string;
  isBuyer?: boolean;
};

const useWebSocket = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const isBuyer = useRef<boolean>(false);
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
          if (res.length) isBuyer.current = true;
        })
        .catch((err) => {
          console.error(err);
        });
    }

    sendMessage({ type: 'join', roomId: param.id });
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
      sendMessage({ type: 'join', roomId: param.id, userId: userInfo?.uid });
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      const data: WebSocketMessageType = JSON.parse(event.data);
      console.log(`서버로부터 메시지 수신`);
      console.dir(data);
      if (data.userId && memberArray.current.indexOf(data.userId) === -1) {
        console.log(memberArray);
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

  const sendMessage = (message: WebSocketMessageType) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({ ...message, isBuyer: isBuyer.current }),
      );
    } else {
      console.error('WebSocket 연결이 열려있지 않습니다.');
    }
  };

  return { isConnected, messages, sendMessage, memberArray };
};

export default useWebSocket;
