import { H2, H3 } from '@/components/ui/header/Header.Style';
import styled from 'styled-components';

export const ManagementContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
  gap: 32px;
`;

export const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TitleHeader = styled(H2)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 10px;
`;

export const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const BodyHeader = styled(H3)`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const OrderListFilter = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
`;

export const OrderListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const OrderPerMonthContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 0 0 8px;
  border-left: 1px solid black;
`;

export const OrderInfoBox = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.color.brightGray};
  border-radius: 8px;
`;

export const DayBox = styled.div`
  text-align: center;
  padding: 4px 16px 0 0;
  color: ${({ theme }) => theme.color.darkGray};
  border-right: 1px solid ${({ theme }) => theme.color.brightGray};
`;

export const ProductBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 180px;
  gap: 12px;

  color: ${({ theme }) => theme.color.darkerGray};
  font-weight: bold;

  div {
    display: flex;
    align-items: center;
    gap: 4px;

    svg {
      flex-shrink: 0;
    }
  }
`;

export const PaymentBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;

  color: ${({ theme }) => theme.color.darkerGray};

  div.totalPrice {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: bold;

    svg {
      flex-shrink: 0;
    }
  }

  p.priceAndCount {
    font-size: ${({ theme }) => theme.fontSize.sm};
  }
`;

export const StatusSelectBox = styled.div`
  margin-left: auto;
`;
