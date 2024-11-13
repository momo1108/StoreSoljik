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
