import Slider, { Settings } from 'react-slick';
import * as S from './CardCarousel.Style';
import { H3, H4 } from '../header/Header.Style';
import Button from '../button/Button';
import { Link } from 'react-router-dom';
import { ProductSchema } from '@/types/FirebaseType';
import Picture from '../picture/Picture';

export const defaultSetiing = {
  dots: true,
  infinite: true,
  speed: 500,
  arrows: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  swipe: false,
  waitForAnimate: false,
};

type CarouselProps = {
  settings?: Settings;
  data: ProductSchema[];
};

const CardCarousel: React.FC<CarouselProps> = ({
  settings = defaultSetiing,
  data = [],
}) => {
  return (
    <S.CarouselCardContainer>
      <Slider {...settings}>
        {(data as ProductSchema[]).map((product, index) => (
          <div key={`carousel_${index}`}>
            <S.CarouselCardItemBox>
              <Picture
                imageUrlMap={product.productImageUrlMapArray[0]}
                size={240}
              />
              {/* <S.CardImageBox $src={product.productImageUrlArray[0]} /> */}
              <S.CardContentBox>
                <S.CardHeaderBox>
                  <S.HeaderTagBox>
                    <H4 className='category'>{product.productCategory}</H4>
                    <H4 className='rank'>판매량 {index + 1}위 상품</H4>
                  </S.HeaderTagBox>
                  <H3 className='hideTextOverflow'>{product.productName}</H3>
                </S.CardHeaderBox>
                <S.CardDescriptionP>
                  {product.productDescription}
                </S.CardDescriptionP>
                <S.CardFooterBox>
                  <S.LeftFooterBox>
                    <S.PriceBox>
                      <H4>판매가</H4>
                      <p>{product.productPrice.toLocaleString()}원</p>
                    </S.PriceBox>
                    <S.QuantityBox>
                      <H4>재고량</H4>
                      <p>{product.productQuantity.toLocaleString()}개</p>
                    </S.QuantityBox>
                  </S.LeftFooterBox>
                  <Link to={`/detail/${product.id}`}>
                    <Button styleType='primary'>상세보기</Button>
                  </Link>
                </S.CardFooterBox>
              </S.CardContentBox>
            </S.CarouselCardItemBox>
          </div>
        ))}
      </Slider>
    </S.CarouselCardContainer>
  );
};

export default CardCarousel;
