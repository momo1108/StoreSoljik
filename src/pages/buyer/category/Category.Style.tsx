// import media from '@/style/media';
import styled from 'styled-components';

export const CategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 950px;
  gap: 20px;
`;

export const FilterBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 3px double ${(props) => props.theme.color.gray};
  border-bottom: 3px double ${(props) => props.theme.color.gray};
  padding: 20px 0;
`;

export const ProductCardList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
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
