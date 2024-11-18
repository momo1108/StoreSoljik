// import media from '@/style/media';
import { H2 } from '@/components/ui/header/Header.Style';
import styled from 'styled-components';

export const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 1080px;
  padding: 0 10px;
  gap: 25px;
`;

export const ItemsTitleHeader = styled(H2)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 10px;
`;

export const ItemsListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

export const ItemsListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ItemsListContentBox = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px 0;
`;

export const ErrorBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  color: ${(props) => props.theme.color.destructive};
  font-size: ${(props) => props.theme.fontSize.xl};
  font-weight: bold;
`;

export const SpinnerBox = styled.div`
  display: flex;
  width: 100%;
  height: 150px;
  padding: 15px;
  justify-content: center;
  align-items: center;
`;

export const InViewDiv = styled.div`
  width: 100%;
`;
