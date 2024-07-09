import { H4 } from '../../header/Header.Style';
import * as S from './VerticalCard.Style';
import { ClassName } from '@/types/GlobalType';
import { ProductSchema } from '@/firebase';
import Carousel from '../../carousel/Carousel';

type VerticalCardProps = ClassName & {
  data: ProductSchema;
};

const VerticalCard: React.FC<VerticalCardProps> = ({ data, className }) => {
  const {
    productName,
    productDescription,
    productImageUrlArray,
    productPrice,
    createdAt,
  } = data;
  return (
    <S.CardContainer className={className}>
      <Carousel type='image' data={productImageUrlArray} />
      <S.CardContentBox>
        <S.CardContentTitleBox>
          <H4 className='hideTextOverflow'>{productName}</H4>
          <S.DatetimeP>
            <span>{createdAt.slice(0, 10)}</span>
          </S.DatetimeP>
        </S.CardContentTitleBox>
        <S.DescriptionP>{productDescription}</S.DescriptionP>
        <S.PriceQuantityBox>
          <S.PriceP>
            <span id='title'>판매가</span>
            <span id='price'>{productPrice.toLocaleString()} 원</span>
          </S.PriceP>
          <S.MoreButton styleType='primary'>더보기</S.MoreButton>
        </S.PriceQuantityBox>
      </S.CardContentBox>
    </S.CardContainer>
  );
};

export default VerticalCard;
