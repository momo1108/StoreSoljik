import styled from 'styled-components';

type StyledClampedPProps = {
  $lineLimit: number;
};
export const StyledClampedP = styled.p<StyledClampedPProps>`
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${(props) => props.$lineLimit};
  line-clamp: ${(props) => props.$lineLimit};
`;
