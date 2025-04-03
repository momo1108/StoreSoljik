import * as S from './Cart.Style';
import { FiMinus, FiPlus, FiX } from 'react-icons/fi';
import { useCartItemsActions, useCartItemsState } from '@/hooks/useCartItems';
import { useCartUI } from '@/hooks/useCartUI';
import HR from '../hr/HR';
import React from 'react';
import { H4 } from '../header/Header.Style';
import Button from '../button/Button';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProductSchema } from '@/types/FirebaseType';
import Picture from '../picture/Picture';

const Cart = () => {
  const { isOpen, toggleCart } = useCartUI();
  const { items, totalPrice } = useCartItemsState();
  const { updateItem, removeItem } = useCartItemsActions();
  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <S.CartContainer $isOpen={isOpen}>
      <S.HeaderBox>
        <S.Title>장바구니</S.Title>
        <S.CloseButton onClick={toggleCart}>
          <FiX size={24} />
        </S.CloseButton>
      </S.HeaderBox>
      <HR color={'#ddd'} />
      <S.ContentBox>
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            <S.CartItemBox key={index}>
              <Picture
                imageUrlMap={item.productImageUrlMapArray[0]}
                size={120}
                alt={item.productName}
              />
              <S.ItemDetailsBox>
                <H4 className='hideTextOverflow'>{item.productName}</H4>
                <S.ItemQuantityBox>
                  <S.ItemInputBox>
                    <Button
                      onClick={() =>
                        updateItem(
                          item as ProductSchema,
                          item.productQuantity - 1,
                        )
                      }
                    >
                      <FiMinus />
                    </Button>
                    <S.QuantityInput
                      titleVisibility='hidden'
                      onChange={(event) =>
                        updateItem(
                          item as ProductSchema,
                          parseInt(event.target.value),
                        )
                      }
                      attrs={{ value: item.productQuantity }}
                    />
                    <Button
                      onClick={() =>
                        updateItem(
                          item as ProductSchema,
                          item.productQuantity + 1,
                        )
                      }
                    >
                      <FiPlus />
                    </Button>
                  </S.ItemInputBox>
                  <S.DeleteButton
                    onClick={() => removeItem(item as ProductSchema)}
                  >
                    <RiDeleteBin5Line size={24} />
                  </S.DeleteButton>
                </S.ItemQuantityBox>
                <S.ItemPriceBox>
                  {item.productPrice.toLocaleString()} 원 X{' '}
                  {item.productQuantity} ={' '}
                  {(item.productPrice * item.productQuantity).toLocaleString()}{' '}
                  원
                </S.ItemPriceBox>
              </S.ItemDetailsBox>
            </S.CartItemBox>
            <HR color={'#ddd'} />
          </React.Fragment>
        ))}
      </S.ContentBox>
      <HR color={'#ddd'} />
      <S.TotalPriceBox>
        <H4>총 가격</H4>
        <H4>{totalPrice.toLocaleString()} 원</H4>
      </S.TotalPriceBox>
      <HR color={'#ddd'} />
      <S.FooterBox>
        <S.CheckoutButton
          onClick={() => {
            if (items.length) {
              toggleCart();
              navigate('/purchase', {
                state: {
                  prevRoute: window.location.pathname,
                  prevState: state,
                },
              });
            }
          }}
          styleType='primary'
        >
          구매하기
        </S.CheckoutButton>
      </S.FooterBox>
    </S.CartContainer>
  );
};

export default Cart;
