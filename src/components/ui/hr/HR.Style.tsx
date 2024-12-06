// import media from '@/style/media';
import styled from 'styled-components';

type StyledHRProps = {
  $color: string;
  $height: number;
  $borderStyle:
    | 'none'
    | 'hidden'
    | 'dotted'
    | 'dashed'
    | 'solid'
    | 'double'
    | 'groove'
    | 'ridge'
    | 'inset'
    | 'outset';
};

export const StyledHR = styled.hr<StyledHRProps>`
  margin: 0;
  padding: 0;
  border: none;
  border-bottom: ${({ $height }) => $height}px
    ${({ $borderStyle }) => $borderStyle} ${({ $color }) => $color};
  width: 100%;
`;
