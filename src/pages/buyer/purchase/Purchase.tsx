import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import * as S from './Purchase.Style';
import usePurchase from './usePurchase';
import Button from '@/components/ui/button/Button';
import { useCartItems } from '@/hooks/useCartItems';
import { ProductSchema } from '@/types/FirebaseType';
import React from 'react';
import { H4 } from '@/components/ui/header/Header.Style';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import HR from '@/components/ui/hr/HR';
import Checkbox from '@/components/form/checkbox/Checkbox';

const Purchase: React.FC = () => {
  const {
    registerObject,
    errors,
    handleSubmit,
    submitLogic,
    handleClickPostcode,
    isReadyToCheckout,
    handleUpdateCheckbox,
  } = usePurchase();
  const { items, updateItem, totalPrice, removeItem } = useCartItems();

  return (
    <>
      <Header userType={'buyer'}></Header>
      <Main>
        <S.PurchaseContainer>
          <S.FormContainer>
            <S.ContainerHeaderBox>배송 정보 입력</S.ContainerHeaderBox>
            <S.DeliveryForm id='buyerForm' onSubmit={handleSubmit(submitLogic)}>
              <S.PurchaseInput
                title='구매자'
                reactHookForm={registerObject.buyerName}
                aria-errormessage={errors.buyerName && errors.buyerName.message}
              />
              <S.PurchaseInput
                title='휴대전화번호'
                reactHookForm={registerObject.buyerPhoneNumber}
                aria-errormessage={
                  errors.buyerPhoneNumber && errors.buyerPhoneNumber.message
                }
              />
              <S.PurchaseInput
                title='이메일 주소'
                reactHookForm={registerObject.buyerEmail}
                aria-errormessage={
                  errors.buyerEmail && errors.buyerEmail.message
                }
              />
              <S.PostcodeBox>
                <S.PurchaseInput
                  className='postcodeInput'
                  title='우편번호'
                  reactHookForm={registerObject.buyerPostcode}
                  aria-errormessage={
                    errors.buyerPostcode && errors.buyerPostcode.message
                  }
                />
                <Button styleType='primary' onClick={handleClickPostcode}>
                  우편번호 찾기
                </Button>
              </S.PostcodeBox>
              <S.PurchaseInput
                title='주소'
                reactHookForm={registerObject.buyerAddress1}
                aria-errormessage={
                  errors.buyerAddress1 && errors.buyerAddress1.message
                }
              />
              <S.PurchaseInput
                title='상세주소'
                reactHookForm={registerObject.buyerAddress2}
                aria-errormessage={
                  errors.buyerAddress2 && errors.buyerAddress2.message
                }
              />
            </S.DeliveryForm>
          </S.FormContainer>
          <S.CartContainer>
            <S.ContainerHeaderBox>장바구니 정보</S.ContainerHeaderBox>
            <S.ContentBox>
              {items.map((item, index) => (
                <React.Fragment key={item.id}>
                  <S.CartItemBox key={index}>
                    <S.ItemImg
                      src={item.productImageUrlArray[0]}
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
            <HR color={'#ddd'} />
            <S.FooterBox>
              <Checkbox
                id='purchaseCheckbox'
                description='구매 품목과 결제 금액을 확인했습니다.'
                onChange={handleUpdateCheckbox}
              />
              <S.CheckoutButton
                type='submit'
                attrs={{ form: 'buyerForm' }}
                styleType={isReadyToCheckout ? 'primary' : 'disabled'}
              >
                구매하기
              </S.CheckoutButton>
            </S.FooterBox>
          </S.CartContainer>
        </S.PurchaseContainer>
      </Main>
    </>
  );
};

export default Purchase;
