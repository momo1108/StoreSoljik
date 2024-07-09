import styled from 'styled-components';

type BackgroundImageProps = {
  $src?: string;
};

/**
 * 이미지 캐러셀
 */

export const CarouselImageContainer = styled.div`
  &,
  div {
    width: 220px;
    height: 220px;
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
  }
`;

/**
 * 데이터 캐러셀
 */

export const CarouselCardContainer = styled.div`
  border-radius: ${(props) => props.theme.color.radius};
  box-shadow:
    rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;

  button.slick-arrow {
    &::before {
      color: black;
    }
    z-index: 1;
  }
  button.slick-prev {
    left: 1%;
  }
  button.slick-next {
    right: 1%;
  }
  ul.slick-dots {
    bottom: 5px;
  }
`;

export const CarouselImageItemBox = styled.div<BackgroundImageProps>`
  background-image: url(${(props) => props.$src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
`;

export const CarouselCardItemBox = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px 50px 30px 50px;
  gap: 40px;
`;

export const CardImageBox = styled.div<BackgroundImageProps>`
  border-radius: ${(props) => props.theme.color.radius};
  flex-shrink: 0;
  width: 240px;
  height: 240px;
  background-image: url(${(props) => props.$src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
`;

export const CardContentBox = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
`;

export const CardHeaderBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 5px;
`;

export const HeaderTagBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  & > h4.category {
    flex-shrink: 0;
    font-size: ${(props) => props.theme.fontSize.sm};
    padding: 2px 8px;
    background: ${(props) => props.theme.color.primary};
    color: ${(props) => props.theme.color.primaryForeground};
    border-radius: ${(props) => props.theme.color.radius};
  }
  & > h4.rank {
    flex-shrink: 0;
    font-size: ${(props) => props.theme.fontSize.sm};
    padding: 2px 8px;
    background: ${(props) => props.theme.color.destructive};
    color: ${(props) => props.theme.color.destructiveForeground};
    border-radius: ${(props) => props.theme.color.radius};
  }
`;

export const CardDescriptionP = styled.p`
  color: ${(props) => props.theme.color.gray};
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  line-clamp: 5;
`;

export const CardFooterBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-top: auto;
`;

export const LeftFooterBox = styled.div`
  display: flex;
  align-items: end;
  gap: 20px;
`;

export const PriceBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-weight: bold;
  p {
    font-size: ${(props) => props.theme.fontSize.xl};
  }
`;

export const QuantityBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-weight: bold;
  color: ${(props) => props.theme.color.invalid};
  h4 {
    font-size: ${(props) => props.theme.fontSize.md};
  }
  p {
    font-size: ${(props) => props.theme.fontSize.lg};
  }
`;
