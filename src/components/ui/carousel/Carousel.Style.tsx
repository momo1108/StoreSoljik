import styled from 'styled-components';

type CarouselProps = {
  $size: number;
};

type BackgroundImageProps = {
  $src?: string;
};

/**
 * 이미지 캐러셀
 */

export const CarouselImageContainer = styled.div<CarouselProps>`
  &,
  div {
    width: ${(props) => props.$size}px;
    height: ${(props) => props.$size}px;
  }

  button.slick-arrow {
    &::before {
      color: transparent;
    }
    z-index: 1;
  }

  &:hover button.slick-arrow {
    &::before {
      color: black;
    }
  }
  button.slick-prev {
    left: 1%;
  }
  button.slick-next {
    right: 1%;
  }
  ul.slick-dots {
    bottom: 0;
    display: flex !important;
    justify-content: center;
    gap: 5%;

    li {
      margin: 0;
    }
  }
`;

export const CarouselImageItemBox = styled.div<BackgroundImageProps>`
  background-image: url(${(props) => props.$src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
`;
