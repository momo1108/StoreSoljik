import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

export type WebSocketMessageType = {
  type: 'notification' | 'message' | 'join';
  roomId?: string;
  userId?: string;
  message?: string;
};

const useWebSocket = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<WebSocketMessageType[]>([]);
  const memberMap: Map<string, number> = new Map();

  const param = useParams();
  useEffect(() => {
    console.log(param.id);
    sendMessage({ type: 'join', roomId: param.id });
  }, [param.id]);

  useEffect(() => {
    console.log(param.id);
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
      sendMessage({ type: 'join', roomId: param.id });
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      const data: WebSocketMessageType = JSON.parse(event.data);
      console.log(`서버로부터 메시지 수신: ${data}`);
      console.dir(data.userId);
      console.log(data.userId && memberMap.get(data.userId));
      if (data.userId && !memberMap.get(data.userId)) {
        memberMap.set(data.userId, memberMap.size + 1);
        console.log('set', memberMap);
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
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket 연결이 열려있지 않습니다.');
    }
  };

  return { isConnected, messages, sendMessage, memberMap };
};

export default useWebSocket;
