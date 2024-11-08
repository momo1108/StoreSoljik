import styled from 'styled-components';
import Button from '../../button/Button';

type SelectContainerProps = {
  $width: number;
};
export const SelectContainer = styled.div<SelectContainerProps>`
  position: relative;
  width: ${({ $width }) => $width}px;
`;

export const Title = styled.h4`
  padding: 0 0 2px 4px;
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

export const StateInput = styled.input`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding: 8px 8px 8px 8px;
  border: 1px solid black;
  border-radius: 8px;
  cursor: default;
`;

export const StateP = styled.p`
  position: relative;
  padding: 8px 24px 8px 8px;
  border: 1px solid black;
  border-radius: 8px;
  cursor: default;

  svg {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 4px;
    margin: auto 0;
    transition: transform 0.4s ease-out;

    &.flip {
      transform: rotateX(-180deg);
    }
  }
`;

export const OptionList = styled.ul`
  position: absolute;
  min-height: 32px;
  top: 100%;
  width: 100%;
  max-height: 210px;
  overflow: auto;
  box-sizing: border-box;
  border: 1px solid black;
  border-radius: 8px;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    content: '없음';
    height: 32px;
    line-height: 32px;
    padding-left: 8px;
    color: ${({ theme }) => theme.color.gray};
  }
`;

export const OptionItem = styled.li`
  position: relative;
  padding: 8px;
  cursor: default;
  background: white;
  z-index: 1;

  &.hidden {
    display: none;
  }
  &.active {
    background: #bbb;
  }
  &:hover {
    background: #ddd;
  }
`;

export const OptionButton = styled(Button)`
  padding: 2px 12px;
  border-color: ${({ theme }) => theme.color.primary};
  border-radius: 0.375rem;
  &:hover {
    border-color: ${({ theme }) => theme.color.primary};
  }
  &.active {
    background: ${({ theme }) => theme.color.primary};
    color: ${({ theme }) => theme.color.primaryForeground};
  }
`;
