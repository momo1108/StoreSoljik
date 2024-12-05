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
import { getIsoDate, getKoreanIsoDatetime } from '@/utils/utils';

export type FirebaseMessageType = {
  userId?: string;
  message?: string;
  isBuyer?: boolean;
  createdAt?: string;
};

const useFirebaseListener = () => {
  const unsubChatting = useRef<Unsubscribe | null>(null);
  const [isBuyer, setIsBuyer] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<FirebaseMessageType[]>([]);
  const [messagesPerDate, setMessagesPerDate] = useState<
    Record<string, FirebaseMessageType[]>
  >({});
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
          const tempMessagesPerDate: Record<string, FirebaseMessageType[]> = {};
          querySnapshot.docs.forEach((doc) => {
            const messageData = doc.data() as FirebaseMessageType;
            const messageDate = getIsoDate(messageData.createdAt as string);
            if (tempMessagesPerDate[messageDate]) {
              tempMessagesPerDate[messageDate].push(messageData);
            } else {
              tempMessagesPerDate[messageDate] = [messageData];
            }
          });
          setMessagesPerDate(tempMessagesPerDate);
          setMessages(
            querySnapshot.docs.map((doc) => {
              return doc.data() as FirebaseMessageType;
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

  const sendMessage = (message: FirebaseMessageType) => {
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

  const getMessageType = (msg: FirebaseMessageType) => {
    if (msg.userId === userInfo?.uid) return 'myMessage';
    else return 'userMessage';
  };

  return {
    isConnected,
    messages,
    messagesPerDate,
    sendMessage,
    memberArray,
    getMessageType,
  };
};

export default useFirebaseListener;
