// import media from '@/style/media';
import Button from '@/components/ui/button/Button';
import styled from 'styled-components';

export const HistoryContainer = styled.div`
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
  color: ${({ theme }) => theme.color.active};

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
  gap: 32px;
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
  flex-direction: column;
  padding: 12px;
  gap: 12px;
  border: 1px solid gray;
  border-radius: 8px;
`;

export const OrderDateP = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.color.gray};
`;

export const OrderInfoContentBox = styled.div`
  display: flex;
  gap: 12px;
`;

export const OrderImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  flex-shrink: 0;
  border-radius: 8px;
  box-shadow:
    rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
`;

export const OrderContentBox = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
`;

export const OrderContentMenuBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h4 {
    position: relative;
    padding-top: 16px;
    &::before {
      position: absolute;
      content: '주문 상태';
      font-size: ${({ theme }) => theme.fontSize.sm};
      line-height: ${({ theme }) => theme.fontSize.sm};
      color: ${({ theme }) => theme.color.primary};
      top: 0;
      left: 0;
    }
    display: flex;
    align-items: center;
    gap: 6px;

    .active {
      color: ${({ theme }) => theme.color.active};
    }
    .activeCancel {
      color: ${({ theme }) => theme.color.destructive};
    }
    .inactive {
      color: ${({ theme }) => theme.color.brightGray};
    }
  }
  svg {
    stroke: ${({ theme }) => theme.color.brighterGray};
    stroke-width: 3;
    padding: 2px;
    transform: scale(0.7);
  }
`;

export const OrderContentDescrBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  .productNameHeader:hover {
    color: ${({ theme }) => theme.color.darkBlue};
  }
  p {
    color: ${({ theme }) => theme.color.gray};
    span {
      color: black;
    }
  }
`;

export const OrderDetailButton = styled(Button)`
  border-width: 1px;
  &:hover {
    border-width: 1px;
  }
`;

export const EmptyOrderInfoBox = styled.div`
  padding: 24px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 8px;
`;

export const InViewDiv = styled.div`
  width: 100%;
`;

export const OrderDetailListItemBox = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  align-items: center;
`;

export const CarouselWrapperBox = styled.div`
  border-radius: 8%;
  overflow: hidden;
  box-shadow:
    rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  flex-shrink: 0;
`;

export const ItemInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  flex-shrink: 0;
  gap: 8px;
`;

export const ItemQuantityStrong = styled.strong`
  margin-left: auto;
  width: 50px;
  flex-shrink: 0;
`;

export const OrderTotalPriceBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
