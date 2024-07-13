// import media from '@/style/media';
import styled from 'styled-components';

type StyledHRProps = { $color: string; $height: number };

export const StyledHR = styled.hr<StyledHRProps>`
  margin: 0;
  padding: 0;
  border: none;
  width: 100%;
  height: ${({ $height }) => $height}px;
  background: ${({ $color }) => $color};
`;
