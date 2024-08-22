import styled from 'styled-components';
import Button from '../button/Button';

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
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
