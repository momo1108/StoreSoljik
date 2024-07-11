import Slider, { Settings } from 'react-slick';
import * as S from './Carousel.Style';

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
  data: string[];
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
        {data.map(($src, index) => (
          <div className='slider-item-div' key={`carousel_${index}`}>
            <S.CarouselImageItemBox $src={$src as string} />
          </div>
        ))}
      </Slider>
    </S.CarouselImageContainer>
  );
};

export default Carousel;
