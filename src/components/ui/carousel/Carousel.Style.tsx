import styled from 'styled-components';

export const CarouselContainer = styled.div<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;

  button.slick-arrow {
    color: #500;
    z-index: 1;
  }
  button.slick-prev {
    left: 2%;
  }
  button.slick-next {
    right: 2%;
  }
`;
