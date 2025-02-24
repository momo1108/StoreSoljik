import {
  addDoc,
  collection,
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

export type FirestoreMessageType = {
  userId?: string;
  message?: string;
  isBuyer?: boolean;
  createdAt?: string;
};

const useFirestoreListener = () => {
  const unsubChatting = useRef<Unsubscribe | null>(null);
  const [isBuyer, setIsBuyer] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<FirestoreMessageType[]>([]);
  const [messagesDailyArray, setMessagesDailyArray] = useState<
    Array<[string, (FirestoreMessageType & { messageType: string })[]]>
  >([]);
  const memberArray = useRef<string[]>([]);

  const param = useParams();
  const { userInfo } = useFirebaseAuth();

  useEffect(() => {
    // console.log(param.id);
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
          const tempMessagesDailyArray: Record<string, FirestoreMessageType[]> =
            {};
          querySnapshot.docs.forEach((doc) => {
            const messageData = doc.data() as FirestoreMessageType;
            const messageDate = getIsoDate(messageData.createdAt as string);
            if (tempMessagesDailyArray[messageDate]) {
              tempMessagesDailyArray[messageDate].push(messageData);
            } else {
              tempMessagesDailyArray[messageDate] = [messageData];
            }
          });

          setMessagesDailyArray(
            Object.entries(tempMessagesDailyArray)
              .sort(([date1], [date2]) => (date1 > date2 ? 1 : -1))
              .map(([date, messages]) => [
                date,
                messages.map((msg) => ({
                  ...msg,
                  messageType: getMessageType(msg),
                })),
              ]),
          );
          setMessages(
            querySnapshot.docs.map((doc) => {
              return doc.data() as FirestoreMessageType;
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

  const sendMessage = (message: string) => {
    if (unsubChatting && unsubChatting.current) {
      addDoc(collection(db, 'product', param.id as string, 'chatting'), {
        message,
        userId: userInfo?.uid,
        isBuyer,
        createdAt: getKoreanIsoDatetime(),
      });
    } else {
      console.error(
        'Firestore 의 Product Document 에 리스너가 설정되지 않았습니다.',
      );
    }
  };

  const getMessageType = (msg: FirestoreMessageType) => {
    if (msg.userId === userInfo?.uid) return 'myMessage';
    else return 'userMessage';
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

export default useFirestoreListener;
