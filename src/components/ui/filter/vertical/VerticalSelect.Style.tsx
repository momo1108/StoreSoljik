import styled from 'styled-components';
import Button from '../../button/Button';

export const SelectContainer = styled.div`
  position: relative;
`;

export const StateP = styled.p`
  position: relative;
  width: 120px;
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
  top: 100%;
  width: 100%;
  max-height: 210px;
  overflow: auto;
  box-sizing: border-box;
  border: 1px solid black;
  border-radius: 8px;
`;

export const OptionItem = styled.li`
  padding: 8px;
  cursor: default;

  &.active,
  &:hover {
    background: #ddd;
  }
`;

export const Title = styled.b`
  width: 85px;
  font-size: ${(props) => props.theme.fontSize.md};
  color: #333;
  border-right: 2px solid black;
`;

export const OptionButton = styled(Button)`
  padding: 2px 12px;
  border-color: ${(props) => props.theme.color.primary};
  border-radius: 0.375rem;
  &:hover {
    border-color: ${(props) => props.theme.color.primary};
  }
  &.active {
    background: ${(props) => props.theme.color.primary};
    color: ${(props) => props.theme.color.primaryForeground};
  }
`;
