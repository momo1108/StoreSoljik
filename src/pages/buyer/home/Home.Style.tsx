// import media from '@/style/media';
import Button from '@/components/ui/button/Button';
import { H2, H3 } from '@/components/ui/header/Header.Style';
import styled from 'styled-components';

export const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 950px;
  gap: 40px;
`;

export const HotItemBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
`;
export const HomeTitleHeader = styled(H2)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: ${(props) => props.theme.color.invalid};

  svg > path {
    fill: ${(props) => props.theme.color.invalid};
  }
`;

export const HotItemCarouselSkeleton = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 295px;
  padding: 20px 0;
  background: #eee;
`;

export const HotItemCarouselWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
`;

export const CategoryBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CategoryHeaderBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
`;

export const CategoryHeader = styled(H3)`
  &:hover {
    border-bottom: 1px solid black;
  }
`;

export const CategoryButton = styled(Button)`
  padding: 5px;
`;

export const ProductCardList = styled.ul`
  display: flex;
  gap: 20px;

  img {
    border-radius: 0;
  }
`;

export const ErrorBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 380px;
  background: #eee;
  border-radius: ${(props) => props.theme.color.radius};
`;

export const VerticalCardSkeleton = styled.div`
  width: 220px;
  height: 380px;
  background: #eee;
  border-radius: ${(props) => props.theme.color.radius};
`;
