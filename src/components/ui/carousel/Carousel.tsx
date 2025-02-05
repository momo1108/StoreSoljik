import Slider, { Settings } from 'react-slick';
import * as S from './Carousel.Style';
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
  data: Record<string, string>[];
  size?: number;
};

const Carousel: React.FC<CarouselProps> = ({
  settings = defaultSetiing,
  data = [],
  size = 220,
}) => {
  return (
    <S.CarouselImageContainer $size={size}>
      <Slider {...settings}>
        {data.map((record, index) => (
          <div className='slider-item-div' key={`carousel_${index}`}>
            <Picture imageUrlMap={record} size={size} />
          </div>
        ))}
      </Slider>
    </S.CarouselImageContainer>
  );
};

export default Carousel;
