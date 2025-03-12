import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import * as S from './Detail.Style';
import { H2, H3, H4 } from '@/components/ui/header/Header.Style';
import useDetail from './useDetail';
import Carousel from '@/components/ui/carousel/Carousel';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loading from '@/pages/loading/Loading';
import Button from '@/components/ui/button/Button';
import { BiError } from 'react-icons/bi';
import { FaCheck, FaRegCalendarAlt } from 'react-icons/fa';
import { useTheme } from 'styled-components';
import HR from '@/components/ui/hr/HR';
import StateInput from '@/components/form/stateinput/StateInput';
import { LiaCertificateSolid } from 'react-icons/lia';
import useFirebaseListener from '@/hooks/useFirestoreListener';
import { getIsoTime } from '@/utils/utils';
import { Fragment } from 'react/jsx-runtime';
import { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { ProductSchema } from '@/types/FirebaseType';
import { useCartUI } from '@/hooks/useCartUI';
import { useCartItems } from '@/hooks/useCartItems';

const ProductChattingContainer: React.FC = () => {
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

const InfoFormBox: React.FC<{ data: ProductSchema }> = ({ data }) => {
  const { isOpen, toggleCart } = useCartUI();
  const { checkItemIsInCart, addItem } = useCartItems();
  const navigate = useNavigate();
  const param = useParams();

  // 구매 수량 state (input 의 value 로 사용되므로 string 타입 사용)
  const [cartItemQuantity, setCartItemQuantity] = useState<string>('1');
  /**
   * 구매 수량 input 태그의 onchange 이벤트 핸들러 함수.
   * 값의 범위를 1 ~ 200 으로 제한합니다.
   * @param event 이벤트 객체
   */
  const handleOnchangeQuantityInput: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    console.log(event);
    const parsedValue = parseInt(event.target.value);
    let valueToSet = '1';
    if (isNaN(parsedValue)) {
      setCartItemQuantity(valueToSet);
    } else {
      if (parsedValue < 1) valueToSet = '1';
      else if (parsedValue > 200) valueToSet = '200';
      else valueToSet = parsedValue.toString();
      setCartItemQuantity(valueToSet);
    }
  };

  const isProductInCart: boolean = checkItemIsInCart(data);
  const handleClickPurchase = () => {
    if (data) {
      if (!isProductInCart) addItem(data, parseInt(cartItemQuantity));
      navigate('/purchase', {
        state: {
          prevRoute: window.location.pathname,
        },
      });
    }
  };

  useEffect(() => {
    // 여기서 추천상품 스크롤 초기화?
    setCartItemQuantity('1');
    if (isOpen) toggleCart();
  }, [param.id]);

  return (
    <S.InfoFormBox>
      <S.TotalPriceBox>
        <span>총 구매가격{cartItemQuantity}</span>
        <div>
          <H4>
            {data.productPrice.toLocaleString()} X {cartItemQuantity} =
          </H4>{' '}
          <H3>
            {(data.productPrice * parseInt(cartItemQuantity)).toLocaleString()}{' '}
            원
          </H3>
        </div>
      </S.TotalPriceBox>
      <S.InputButtonBox>
        <S.StyledStateInput
          title='구매수량'
          placeholder='1~200개'
          type='number'
          onChange={handleOnchangeQuantityInput}
          attrs={{
            value: cartItemQuantity,
            min: 1,
            max: 200,
          }}
        />
        <S.ButtonBox>
          <Button styleType='primary' onClick={handleClickPurchase}>
            바로 구매하기
          </Button>
          <Button
            styleType={isProductInCart ? 'disabled' : 'primary'}
            disabled={isProductInCart}
            onClick={() => addItem(data!, parseInt(cartItemQuantity))}
          >
            {isProductInCart ? (
              <>
                <FaCheck />
                <span>담아놓은 상품</span>
              </>
            ) : (
              '장바구니에 추가'
            )}
          </Button>
        </S.ButtonBox>
      </S.InputButtonBox>
    </S.InfoFormBox>
  );
};

const Detail: React.FC = () => {
  const {
    data,
    status,
    error,
    refetch,
    recommendData,
    recommendStatus,
    // recommendError,
  } = useDetail();
  const theme = useTheme();

  return (
    <>
      <Header userType='buyer' />
      <Main>
        {status === 'pending' ? (
          <Loading />
        ) : status === 'error' ? (
          <S.ErrorBox>
            <BiError size={200} />
            <H3>판매 상품을 불러오지 못했습니다.</H3>
            <H4>{error?.message}</H4>
            <Button styleType='primary' onClick={() => refetch()}>
              재시도
            </Button>
          </S.ErrorBox>
        ) : data ? (
          <S.DetailContainer>
            <S.ImageContainer>
              <S.CarouselWrapper>
                <Carousel data={data.productImageUrlMapArray} size={500} />
              </S.CarouselWrapper>
              <ProductChattingContainer />
            </S.ImageContainer>
            <S.InfoContainer>
              <S.InfoHeaderP>
                <Link to='/category'>카테고리</Link> {'>'}{' '}
                <Link to='/category' state={{ category: data.productCategory }}>
                  {data.productCategory}
                </Link>
              </S.InfoHeaderP>
              <S.InfoBodyWrapper>
                <S.InfoContentBox>
                  <H3>{data.productName}</H3>
                  <S.PriceDiv>
                    <H4>판매가</H4>
                    <H2>{data.productPrice.toLocaleString()} 원</H2>
                  </S.PriceDiv>
                  <S.DescriptionP>{data.productDescription}</S.DescriptionP>
                </S.InfoContentBox>
                <HR color={theme.color.brighterGray} />
                <InfoFormBox data={data} />
                <HR color={theme.color.brighterGray} />
                <S.RecommendationBox>
                  <H3>추천 상품</H3>
                  <p>같은 카테고리의 다른 최신 상품들을 살펴보세요!</p>
                  <S.RecommendationImageList>
                    {recommendStatus === 'pending' ? (
                      <S.RecommendationSpinner spinnerSize={30}>
                        추천 상품을 불러오는 중입니다.
                      </S.RecommendationSpinner>
                    ) : recommendStatus === 'error' ? (
                      <S.RecommendationErrorBox>
                        <BiError size={200} />
                        <span>{'추천 상품을 불러오지 못했습니다.'}</span>
                        <span>{error?.message}</span>
                      </S.RecommendationErrorBox>
                    ) : recommendData ? (
                      recommendData.result
                        .slice(0, 10)
                        .map((product) => (
                          <S.RecommendationVerticalCard
                            key={`recommend_${product.id}`}
                            data={product}
                          />
                        ))
                    ) : (
                      <S.RecommendationErrorBox>
                        <BiError size={200} />
                        <span>{'추천 상품이 없습니다.'}</span>
                      </S.RecommendationErrorBox>
                    )}
                  </S.RecommendationImageList>
                </S.RecommendationBox>
              </S.InfoBodyWrapper>
            </S.InfoContainer>
          </S.DetailContainer>
        ) : (
          <S.ErrorBox>
            <BiError size={200} />
            <H3>존재하지 않는 상품입니다.</H3>
            <Button styleType='primary' onClick={() => refetch()}>
              재시도
            </Button>
          </S.ErrorBox>
        )}
      </Main>
    </>
  );
};

export default Detail;
