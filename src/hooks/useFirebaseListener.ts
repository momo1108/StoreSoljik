import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
  where,
} from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFirebaseAuth } from './useFirebaseAuth';
import { db } from '@/firebase';
import { fetchOrders } from '@/services/orderService';
import { OrderStatus } from '@/types/FirebaseType';
import { getKoreanIsoDatetime } from '@/utils/utils';

export type WebSocketMessageType = {
  type: 'notification' | 'message' | 'join';
  roomId?: string;
  userId?: string;
  message?: string;
  isBuyer?: boolean;
};

const useFirebaseListener = () => {
  const unsubChatting = useRef<Unsubscribe | null>(null);
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
        })
        .catch((err) => {
          console.error(err);
        });

      setIsConnected(false);
      if (unsubChatting && unsubChatting.current) {
        unsubChatting.current();
      }
      unsubChatting.current = onSnapshot(
        query(
          collection(db, 'product', param.id, 'chatting'),
          orderBy('createdAt', 'asc'),
        ),
        (querySnapshot) => {
          console.log(querySnapshot);
          setMessages(
            querySnapshot.docs.map((doc) => {
              return doc.data() as WebSocketMessageType;
            }),
          );
        },
        (error) => {
          console.error(error);
        },
      );

      setIsConnected(true);

      return () => {
        if (unsubChatting && unsubChatting.current) {
          unsubChatting.current();
        }
      };
    }
  }, [param.id]);

  const sendMessage = (message: WebSocketMessageType) => {
    if (unsubChatting && unsubChatting.current) {
      addDoc(collection(db, 'product', param.id as string, 'chatting'), {
        ...message,
        isBuyer,
        createdAt: getKoreanIsoDatetime(),
      });
    } else {
      console.error(
        'Firestore 의 Product Document 에 리스너가 설정되지 않았습니다.',
      );
    }
  };

  return { isConnected, messages, sendMessage, memberArray };
};

export default useFirebaseListener;
