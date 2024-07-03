import styled from 'styled-components';

export const SpinnerBox = styled.div`
  display: flex;
  align-items: center;
  font-size: ${(props) => props.theme.fontSize.sm};
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

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes prixClipFix {
    0% {
      clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
    }
    25% {
      clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
    }
    50% {
      clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
    }
    75% {
      clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
    }
    100% {
      clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0);
    }
  }
`;
