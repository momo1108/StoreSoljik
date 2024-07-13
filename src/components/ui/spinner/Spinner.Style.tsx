import styled from 'styled-components';

export const SpinnerBox = styled.div<{ $size: number }>`
  display: flex;
  align-items: center;
  font-size: ${(props) => props.$size}px;
  font-weight: bold;
  gap: 8px;
`;

export const SpinnerSpan = styled.span<{ $size: number }>`
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  border-radius: 50%;
  position: relative;
  animation: rotate 1s linear infinite;
  &::before,
  &::after {
    content: '';
    box-sizing: border-box;
    position: absolute;
    inset: 0px;
    border-radius: 50%;
    border: ${(props) => props.$size / 9.6}px solid #ddd;
    animation: prixClipFix 2s linear infinite;
  }
  &::after {
    border-color: #2d3648;
    animation:
      prixClipFix 2s linear infinite,
      rotate 0.5s linear infinite reverse;
    inset: ${(props) => props.$size / 8}px;
  }
`;
