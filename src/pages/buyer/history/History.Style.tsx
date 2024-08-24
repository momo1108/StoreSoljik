// import media from '@/style/media';
import styled from 'styled-components';

export const CategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 950px;
  gap: 20px;
`;

export const OrderStatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
`;

export const OrderStatusList = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: bold;

  svg.greaterThanIcon {
    padding: 5px;
    stroke-linecap: round;
    stroke-linejoin: round;
    transform: scale(2, 2);
  }

  svg.verticalMinusIcon {
    padding: 5px;
    transform: scale(2, 4);
  }
`;

export const OrderStatusListElement = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 10px solid #35528c;
  color: #002c83;

  p.statusCountP {
    color: #000000;

    span.statusCountSpan {
      font-size: ${({ theme }) => theme.fontSize.xxl};
    }
  }

  &.lastLi {
    border-color: #ba2c2c;
    color: #be0000;
    p.statusCountP {
      color: inherit;
    }
  }
`;

export const OrderStatusMenuList = styled.ul`
  display: flex;
  gap: 64px;
  width: 100%;
  background: #1111;
  border-bottom: 1px solid ${(props) => props.theme.color.brighterGray};

  li {
    padding: 12px 16px;
    font-size: ${(props) => props.theme.fontSize.lg};
    font-weight: bold;
  }
`;
