import { memo, MouseEventHandler } from 'react';
import { H4 } from '../../header/Header.Style';
import * as S from './HorizontalCard.Style';
import { ClassName } from '@/types/GlobalType';
import { getIsoDate, getIsoTime } from '@/utils/utils';
import { ProductSchema } from '@/types/FirebaseType';
import Picture from '../../picture/Picture';

type HorizontalCardProps = ClassName & {
  data: ProductSchema;
  handleClickUpdate: MouseEventHandler<HTMLButtonElement>;
  handleClickDelete: MouseEventHandler<HTMLButtonElement>;
};

const HorizontalCard: React.FC<HorizontalCardProps> = memo(
  ({ data, className, handleClickUpdate, handleClickDelete }) => {
    const {
      productName,
      productDescription,
      productImageUrlMapArray,
      productPrice,
      productQuantity,
      createdAt,
    } = data;

    return (
      <S.CardContainer className={className}>
        <Picture
          imageUrlMap={productImageUrlMapArray[0]}
          size={150}
          alt={productName}
        />
        <S.CardContentBox>
          <S.CardContentTitleBox>
            <H4 className='hideTextOverflow'>{productName}</H4>
            <S.DatetimeP>
              <span>{getIsoDate(createdAt)}</span>
              <span>{getIsoTime(createdAt)}</span>
            </S.DatetimeP>
          </S.CardContentTitleBox>
          <S.DescriptionP>{productDescription}</S.DescriptionP>
          <S.CardContentBottomBox>
            <S.PriceQuantityDiv>
              <S.PriceP>
                <span id='title'>판매가</span>
                <span id='price'>{productPrice.toLocaleString()} 원</span>
              </S.PriceP>
              <S.QuantityP>
                <span id='title'>재고 수량</span>
                <span id='quantity'>{productQuantity} 개</span>
              </S.QuantityP>
            </S.PriceQuantityDiv>
            <S.ButtonBox>
              <S.UpdateButton onClick={handleClickUpdate} styleType='primary'>
                수정
              </S.UpdateButton>
              <S.DeleteButton onClick={handleClickDelete}>삭제</S.DeleteButton>
            </S.ButtonBox>
          </S.CardContentBottomBox>
        </S.CardContentBox>
      </S.CardContainer>
    );
  },
);

export default HorizontalCard;
