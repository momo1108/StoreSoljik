import { H2, H3 } from '@/components/ui/header/Header.Style';
import styled from 'styled-components';

export const ManagementContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
  gap: 32px;
`;

export const ManagementTitleBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ManagementTitleHeader = styled(H2)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 10px;
`;

export const ManagementBodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ManagementBodyHeader = styled(H3)`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ManagementOrderListFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
