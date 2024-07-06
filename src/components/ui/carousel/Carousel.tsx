import Slider from 'react-slick';
import * as S from './Carousel.Style';

type CarouselProps = {
  width: number;
  height: number;
};
const Carousel: React.FC<CarouselProps> = ({ width = 100, height = 100 }) => {
  const settings = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 500,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
  };
  return (
    <S.CarouselContainer
      width={width}
      height={height}
      className='slider-container'
    >
      <Slider {...settings}>
        <div>
          <h3 style={{ width: 500, height: 500, background: '#623' }}>1</h3>
        </div>
        <div>
          <h3 style={{ width: 500, height: 500, background: '#322' }}>2</h3>
        </div>
        <div>
          <h3 style={{ width: 500, height: 500, background: '#555' }}>3</h3>
        </div>
        <div>
          <h3 style={{ width: 500, height: 500, background: '#71a' }}>4</h3>
        </div>
        <div>
          <h3 style={{ width: 500, height: 500, background: '#a22' }}>5</h3>
        </div>
        <div>
          <h3 style={{ width: 500, height: 500, background: '#c5f' }}>6</h3>
        </div>
      </Slider>
    </S.CarouselContainer>
  );
};

export default Carousel;
