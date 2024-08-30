// import media from '@/style/media';
import Button from '@/components/ui/button/Button';
import styled from 'styled-components';

export const CategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
  gap: 32px;
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
  width: 100%;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: bold;

  svg {
    stroke: #757e8f;
    stroke-width: 3;
    padding: 5px;
  }
  svg.greaterThanIcon {
    transform: scale(2, 2);
  }

  svg.verticalMinusIcon {
    transform: scale(2, 7);
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
      color: #000000;
    }
  }
`;

export const OrderListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const OrderListMenu = styled.ul`
  display: flex;
  gap: 8px;
  width: 100%;
`;

export const OrderListMenuButton = styled(Button)`
  padding: 8px 16px;
  min-width: 80px;
  gap: 4px;

  .countSpan {
    font-size: ${(props) => props.theme.fontSize.sm};
  }
`;

export const OrderListInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const OrderInfoPerDateContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 0 0 8px;
  border-left: 1px solid black;
`;

export const OrderInfoBox = styled.div`
  display: flex;
  padding: 12px;
  gap: 8px;
  border: 1px solid gray;
`;
