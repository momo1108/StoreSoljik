import Header from '@/components/layouts/header/Header';
import * as S from './Registration.Style';
import { FiPlus } from 'react-icons/fi';
import { IoStorefrontSharp } from 'react-icons/io5';
import Main from '@/components/layouts/main/Main';
import useRegistration from './useRegistration';
import Input from '@/components/form/input/Input';
import TextArea from '@/components/form/textarea/TextArea';

const Registration: React.FC = () => {
  const {
    handleSubmit,
    submitLogic,
    isSubmitting,
    errors,
    registerObject,
    imagePreviewUrls,
  } = useRegistration();
  return (
    <>
      <Header userType={'seller'}></Header>
      <Main>
        <S.RegistrationForm onSubmit={handleSubmit(submitLogic)}>
          <S.RegistrationTitleBox>
            <S.RegistrationTitleHeader>
              <IoStorefrontSharp />
              판매 상품 등록
            </S.RegistrationTitleHeader>
            <S.RegistrationSubmitButton
              disabled={isSubmitting}
              type='submit'
              $iconSize={18}
            >
              <FiPlus />
              등록하기
            </S.RegistrationSubmitButton>
          </S.RegistrationTitleBox>

          <S.WarningMessageP>
            현재 페이지를 벗어나는 경우 작성된 내용은 모두 사라집니다.
          </S.WarningMessageP>

          <S.RegistrationContentBox>
            <S.RegistrationContentColumnContainer>
              <S.RegistrationContentImageBox>
                <h3>상품 이미지 등록</h3>
                {errors.images && errors.images.message ? (
                  <span className='errorSpan'>
                    {errors.images.message as string}
                  </span>
                ) : (
                  <></>
                )}
                <S.RegistrationContentImagePreviewBox>
                  {imagePreviewUrls && imagePreviewUrls[0] ? (
                    imagePreviewUrls.map((imgUrl, index) => (
                      <S.ImagePreviewItemBox
                        key={`preview_${index}`}
                        $imgSrc={imgUrl}
                      />
                    ))
                  ) : (
                    <span>이미지를 업로드해주세요.</span>
                  )}
                </S.RegistrationContentImagePreviewBox>
                <input
                  {...registerObject.productImages}
                  disabled={isSubmitting}
                  type='file'
                  id=''
                  accept='image/*'
                  multiple
                />
              </S.RegistrationContentImageBox>
              <S.RegistrationContentItemBox>
                <h3>카테고리 설정</h3>
                <Input
                  title='카테고리'
                  placeholder='의류/식품/ 전자기기 등'
                  reactHookForm={registerObject.productCategory}
                  aria-errormessage={
                    errors.productCategory && errors.productCategory.message
                  }
                />
              </S.RegistrationContentItemBox>
            </S.RegistrationContentColumnContainer>

            <S.RegistrationContentColumnContainer>
              <S.RegistrationContentItemBox>
                <h3>판매 상품 정보</h3>
                <Input
                  title='상품명'
                  reactHookForm={registerObject.productName}
                  aria-errormessage={
                    errors.productName && errors.productName.message
                  }
                />
                <TextArea
                  title='상품설명'
                  reactHookForm={registerObject.productDescription}
                  aria-errormessage={
                    errors.productDescription &&
                    errors.productDescription.message
                  }
                />
              </S.RegistrationContentItemBox>
              <S.RegistrationContentItemBox>
                <h3>상품 가격 및 재고량</h3>
                <Input
                  title='상품 가격(원 단위, 숫자만 입력)'
                  type='number'
                  reactHookForm={registerObject.productPrice}
                  aria-errormessage={
                    errors.productPrice && errors.productPrice.message
                  }
                />
                <Input
                  title='재고량(숫자만 입력)'
                  type='number'
                  reactHookForm={registerObject.productQuantity}
                  aria-errormessage={
                    errors.productQuantity && errors.productQuantity.message
                  }
                />
              </S.RegistrationContentItemBox>
            </S.RegistrationContentColumnContainer>
          </S.RegistrationContentBox>
        </S.RegistrationForm>
      </Main>
    </>
  );
};

export default Registration;
