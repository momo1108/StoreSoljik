import Header from '@/components/layouts/header/Header';
import Main from '@/components/layouts/main/Main';
import * as S from './Purchase.Style';
import usePurchase from './usePurchase';
import React from 'react';
import HR from '@/components/ui/hr/HR';
import Checkbox from '@/components/form/checkbox/Checkbox';
import CartContentContainer from './components/CartContentContainer';
import FormContainer from './components/FormContainer';

const PurchaseContainer: React.FC = () => {
  const {
    register,
    errors,
    handleSubmit,
    submitLogic,
    setValue,
    isReadyToCheckoutRef,
    isSubmitting,
    productQuantityArray,
    productQuantityArrayStatus,
  } = usePurchase();

  return (
    <S.PurchaseContainer>
      <FormContainer
        register={register}
        handleSubmit={handleSubmit}
        submitLogic={submitLogic}
        errors={errors}
        setValue={setValue}
      />
      <S.CartContainer>
        <S.ContainerHeaderBox>장바구니 정보</S.ContainerHeaderBox>
        <CartContentContainer
          productQuantityArray={productQuantityArray}
          productQuantityArrayStatus={productQuantityArrayStatus}
        />
        <HR color={'#ddd'} />
        <S.FooterBox>
          <Checkbox
            id='purchaseCheckbox'
            description='구매 품목과 결제 금액을 확인했습니다.'
            onChange={(e) => {
              isReadyToCheckoutRef.current = e.target.checked;
            }}
          />
          <S.CheckoutButton
            type='submit'
            attrs={{ form: 'buyerForm' }}
            styleType='primary'
            disabled={isSubmitting}
          >
            구매하기
          </S.CheckoutButton>
        </S.FooterBox>
      </S.CartContainer>
    </S.PurchaseContainer>
  );
};

const Purchase: React.FC = () => {
  return (
    <>
      <Header userType={'buyer'}></Header>
      <Main>
        <PurchaseContainer />
      </Main>
    </>
  );
};

export default Purchase;
