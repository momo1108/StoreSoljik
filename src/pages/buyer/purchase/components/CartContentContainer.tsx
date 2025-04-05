import * as S from '../Purchase.Style';
import Button from '@/components/ui/button/Button';
import { ProductSchema } from '@/types/FirebaseType';
import React, { memo } from 'react';
import { H4 } from '@/components/ui/header/Header.Style';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import HR from '@/components/ui/hr/HR';
import { useCartItemsActions, useCartItemsState } from '@/hooks/useCartItems';
import Picture from '@/components/ui/picture/Picture';

type CartContentContainerProps = {
  productQuantityArray: ProductSchema[] | undefined;
  productQuantityArrayStatus: 'error' | 'success' | 'pending';
};

const CartContentContainer: React.FC<CartContentContainerProps> = memo(
  ({ productQuantityArray, productQuantityArrayStatus }) => {
    const { items, totalPrice } = useCartItemsState();
    const { updateItem, removeItem } = useCartItemsActions();

    return (
      <>
        <S.ContainerHeaderBox>장바구니 정보</S.ContainerHeaderBox>
        <S.ContentBox>
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              <S.CartItemBox key={index}>
                <Picture
                  imageUrlMap={item.productImageUrlMapArray[0]}
                  size={120}
                />
                {/* <S.ItemImg
                      src={item.productImageUrlArray[0]}
                      alt={item.productName}
                    /> */}
                <S.ItemDetailsBox>
                  <S.ItemDatailHeader>
                    <H4 className='hideTextOverflow'>{item.productName}</H4>
                    <p>
                      재고량:{' '}
                      {productQuantityArrayStatus === 'pending'
                        ? '불러오는 중입니다.'
                        : productQuantityArrayStatus === 'error'
                          ? '불러오지 못했습니다.'
                          : productQuantityArray?.find(
                              (product) => product.id === item.id,
                            )?.productQuantity || '불러오지 못했습니다.'}
                    </p>
                  </S.ItemDatailHeader>
                  <S.ItemQuantityBox>
                    <S.ItemInputBox>
                      <Button
                        onClick={() =>
                          updateItem(
                            item as ProductSchema,
                            item.productQuantity - 1,
                            productQuantityArray?.find(
                              (product) => product.id === item.id,
                            )?.productQuantity || 200,
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
                            productQuantityArray?.find(
                              (product) => product.id === item.id,
                            )?.productQuantity || 200,
                          )
                        }
                        attrs={{ value: item.productQuantity }}
                      />
                      <Button
                        onClick={() =>
                          updateItem(
                            item as ProductSchema,
                            item.productQuantity + 1,
                            productQuantityArray?.find(
                              (product) => product.id === item.id,
                            )?.productQuantity || 200,
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
                    {(
                      item.productPrice * item.productQuantity
                    ).toLocaleString()}{' '}
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
      </>
    );
  },
);

export default CartContentContainer;
