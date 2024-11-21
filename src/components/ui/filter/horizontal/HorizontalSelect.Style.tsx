import styled from 'styled-components';
import Button from '../../button/Button';

export const Container = styled.div`
  display: flex;
  padding: 5px;
  gap: 6px;
  border-radius: 8px;
  background: ${(props) => props.theme.color.brightestGray};
  align-items: center;
`;

export const OptionButton = styled(Button)`
  padding: 6px 16px;
  color: ${(props) => props.theme.color.gray};
  border-color: transparent;
  border-radius: 0.375rem;
  &:hover {
    border-color: ${(props) => props.theme.color.brighterGray};
    background: ${(props) => props.theme.color.brighterGray};
  }
  &.active {
    color: black;
    border-color: white;
    background: white;
  }
`;
