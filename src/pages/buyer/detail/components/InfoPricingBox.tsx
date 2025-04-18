import * as S from '../Detail.Style';
import { H3, H4 } from '@/components/ui/header/Header.Style';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/ui/button/Button';
import { FaCheck } from 'react-icons/fa';
import { ChangeEventHandler, memo, useEffect, useState } from 'react';
import { ProductSchema } from '@/types/FirebaseType';
import { useCartItemsActions, useCartItemsState } from '@/hooks/useCartItems';
import { useCartUIActions } from '@/hooks/useCartUI';

const PriceCalcBox: React.FC<{ price: number; quantity: string }> = memo(
  ({ price, quantity }) => {
    return (
      <div>
        <H4>
          {price.toLocaleString()} X {quantity} =
        </H4>{' '}
        <H3>{(price * parseInt(quantity)).toLocaleString()} 원</H3>
      </div>
    );
  },
);

const InputButtonBox: React.FC<{
  data: ProductSchema;
  cartItemQuantity: string;
  setCartItemQuantity: React.Dispatch<React.SetStateAction<string>>;
}> = memo(({ data, cartItemQuantity, setCartItemQuantity }) => {
  const { checkItemIsInCart } = useCartItemsState();
  const { addItem } = useCartItemsActions();
  const navigate = useNavigate();

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

  return (
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
  );
});

const InfoPricingBox: React.FC<{ data: ProductSchema }> = ({ data }) => {
  const { closeCart } = useCartUIActions();
  const param = useParams();

  // 구매 수량 state (input 의 value 로 사용되므로 string 타입 사용)
  const [cartItemQuantity, setCartItemQuantity] = useState<string>('1');

  useEffect(() => {
    // 여기서 추천상품 스크롤 초기화?
    setCartItemQuantity('1');
    closeCart();
  }, [param.id]);

  return (
    <S.InfoPricingBox>
      <S.TotalPriceBox>
        <span>총 구매가격</span>
        <PriceCalcBox price={data.productPrice} quantity={cartItemQuantity} />
      </S.TotalPriceBox>
      <InputButtonBox
        data={data}
        cartItemQuantity={cartItemQuantity}
        setCartItemQuantity={setCartItemQuantity}
      />
    </S.InfoPricingBox>
  );
};

export default InfoPricingBox;
