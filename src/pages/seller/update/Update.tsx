import Header from '@/components/layouts/header/Header';
import * as S from './Update.Style';
import { FiPlus } from 'react-icons/fi';
import { IoStorefrontSharp } from 'react-icons/io5';
import Main from '@/components/layouts/main/Main';
import useUpdate from './useUpdate';
import Input from '@/components/form/input/Input';
import TextArea from '@/components/form/textarea/TextArea';
import Checkbox from '@/components/form/checkbox/Checkbox';

const Update: React.FC = () => {
  const {
    handleSubmit,
    submitLogic,
    isSubmitting,
    errors,
    registerObject,
    imagePreviewUrls,
    isUpdatingImage,
    handleCheckboxUpdate,
  } = useUpdate();
  return (
    <>
      <Header userType={'seller'}></Header>
      <Main>
        <S.UpdateForm onSubmit={handleSubmit(submitLogic)}>
          <S.UpdateTitleBox>
            <S.UpdateTitleHeader>
              <IoStorefrontSharp />
              판매 상품 수정
            </S.UpdateTitleHeader>
            <S.UpdateSubmitBox>
              {isSubmitting ? (
                <S.UpdateSpinner spinnerSize={20}>
                  수정 사항을 저장합니다
                </S.UpdateSpinner>
              ) : (
                <></>
              )}
              <S.UpdateSubmitButton
                disabled={isSubmitting}
                type='submit'
                $iconSize={18}
              >
                <FiPlus />
                저장하기
              </S.UpdateSubmitButton>
            </S.UpdateSubmitBox>
          </S.UpdateTitleBox>

          <S.WarningMessageP>
            현재 페이지를 벗어나는 경우 작성된 내용은 모두 사라집니다.
          </S.WarningMessageP>

          <S.UpdateContentContainer>
            <S.UpdateContentColumnBox>
              <S.UpdateContentImageBox>
                <h3>상품 이미지 등록</h3>
                {errors.images && errors.images.message ? (
                  <span className='errorSpan'>
                    {errors.images.message as string}
                  </span>
                ) : (
                  <></>
                )}
                <Checkbox
                  id='imgUpdateCheckbox'
                  description='이미지를 수정합니다.'
                  onChange={handleCheckboxUpdate}
                />
                <S.UpdateContentImagePreviewBox>
                  {imagePreviewUrls && imagePreviewUrls[0] ? (
                    imagePreviewUrls.map((imgUrl, index) => (
                      <S.ImagePreviewItemBox
                        key={`preview_${index}`}
                        $imgSrc={imgUrl}
                      />
                    ))
                  ) : (
                    <span>선택된 이미지가 없습니다.</span>
                  )}
                </S.UpdateContentImagePreviewBox>
                {isUpdatingImage ? (
                  <input
                    {...registerObject.productImages}
                    disabled={isSubmitting}
                    type='file'
                    id=''
                    accept='image/*'
                    multiple
                  />
                ) : (
                  <></>
                )}
              </S.UpdateContentImageBox>
              <S.UpdateContentItemBox>
                <h3>카테고리 설정</h3>
                <Input
                  title='카테고리'
                  placeholder='의류/식품/ 전자기기 등'
                  reactHookForm={registerObject.productCategory}
                  aria-errormessage={
                    errors.productCategory && errors.productCategory.message
                  }
                />
              </S.UpdateContentItemBox>
            </S.UpdateContentColumnBox>

            <S.UpdateContentColumnBox>
              <S.UpdateContentItemBox>
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
              </S.UpdateContentItemBox>
              <S.UpdateContentItemBox>
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
              </S.UpdateContentItemBox>
            </S.UpdateContentColumnBox>
          </S.UpdateContentContainer>
        </S.UpdateForm>
      </Main>
    </>
  );
};

export default Update;
