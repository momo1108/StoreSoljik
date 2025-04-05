import usePostcode from '@/hooks/usePostcode';
import * as S from '../Purchase.Style';
import Button from '@/components/ui/button/Button';
import { PurchaseFormData } from '@/types/FormType';
import { createPurchaseRegisterObject } from '@/utils/formRegisterUtils';
import React, { memo, MouseEventHandler } from 'react';
import {
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import { DaumPostcodeResult } from '@/types/DaumPostcodeType';

type FormContainerProps = {
  register: UseFormRegister<PurchaseFormData>;
  handleSubmit: UseFormHandleSubmit<PurchaseFormData, undefined>;
  submitLogic: SubmitHandler<PurchaseFormData>;
  errors: FieldErrors<PurchaseFormData>;
  setValue: UseFormSetValue<PurchaseFormData>;
};

const FormContainer: React.FC<FormContainerProps> = memo(
  ({ register, handleSubmit, submitLogic, errors, setValue }) => {
    const registerObject = createPurchaseRegisterObject(register);
    const { openPostcodeSearch } = usePostcode();

    const setPostcodeAddress = (data: DaumPostcodeResult) => {
      // 각 주소의 노출 규칙에 따라 주소를 조합한다.
      // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
      let addr = ''; // 주소 변수
      let extraAddr = ''; // 참고항목 변수

      //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
      if (data.userSelectedType === 'R') {
        // 사용자가 도로명 주소를 선택했을 경우
        addr = data.roadAddress;
      } else {
        // 사용자가 지번 주소를 선택했을 경우(J)
        addr = data.jibunAddress;
      }

      if (data.userSelectedType === 'R') {
        // 법정동명이 있을 경우 추가한다. (법정리는 제외)
        // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        // 건물명이 있고, 공동주택일 경우 추가한다.
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraAddr +=
            extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
        }
        // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
        if (extraAddr !== '') {
          extraAddr = ' (' + extraAddr + ')';
        }
      }

      setValue('buyerPostcode', data.zonecode, { shouldValidate: true });
      setValue('buyerAddress1', addr, { shouldValidate: true });
    };

    const handleClickPostcode: MouseEventHandler<HTMLButtonElement> = () => {
      openPostcodeSearch(setPostcodeAddress);
    };

    return (
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
            aria-errormessage={errors.buyerEmail && errors.buyerEmail.message}
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
    );
  },
);

export default FormContainer;
