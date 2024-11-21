import { useEffect, useRef, useState } from 'react';

const useWebSocket = (url: string) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // WebSocket 연결
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket 연결 성공');
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      console.log(`서버로부터 메시지 수신: ${event.data}`);
      setMessages((prevMessages) => [...prevMessages, event.data]);
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
      socket.close();
    };
  }, [url]);

  const sendMessage = (message: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    } else {
      console.error('WebSocket 연결이 열려있지 않습니다.');
    }
  };

  return { isConnected, messages, sendMessage };
};

export default useWebSocket;
