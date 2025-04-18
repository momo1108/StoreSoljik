import { H4 } from '../../header/Header.Style';
import * as S from './VerticalCard.Style';
import { ClassName } from '@/types/GlobalType';
import Carousel from '../../carousel/Carousel';
import { Link } from 'react-router-dom';
import { getIsoDate } from '@/utils/utils';
import { ProductSchema } from '@/types/FirebaseType';

type VerticalCardProps = ClassName & {
  data: ProductSchema;
};

const VerticalCard: React.FC<VerticalCardProps> = ({ data, className }) => {
  const {
    id,
    productName,
    productDescription,
    productImageUrlMapArray,
    productPrice,
    createdAt,
  } = data;
  return (
    <S.CardContainer className={className}>
      <Carousel data={productImageUrlMapArray} />
      <S.CardContentBox>
        <S.CardContentTitleBox>
          <H4 className='hideTextOverflow'>{productName}</H4>
          <S.DatetimeP>
            <span>{getIsoDate(createdAt)}</span>
          </S.DatetimeP>
        </S.CardContentTitleBox>
        <S.DescriptionP className='descr'>{productDescription}</S.DescriptionP>
        <S.PriceQuantityBox>
          <S.PriceP>
            <span id='title'>판매가</span>
            <span id='price'>{productPrice.toLocaleString()} 원</span>
          </S.PriceP>
          <Link to={`/detail/${id}`}>
            <S.MoreButton styleType='primary'>상세보기</S.MoreButton>
          </Link>
        </S.PriceQuantityBox>
      </S.CardContentBox>
    </S.CardContainer>
  );
};

export default VerticalCard;
