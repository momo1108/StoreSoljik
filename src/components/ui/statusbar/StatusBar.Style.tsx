import styled from 'styled-components';
import { H4 } from '../header/Header.Style';

export const StatusBarWrapper = styled(H4)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;

  svg {
    stroke: ${({ theme }) => theme.color.brighterGray};
    stroke-width: 3;
    padding: 2px;
    transform: scale(0.7);
  }
`;

export const StatusSpan = styled.span<{
  $isActive: boolean;
  $statusType: 'normal' | 'danger';
}>`
  color: ${({ $isActive, $statusType, theme }) =>
    $isActive
      ? $statusType === 'normal'
        ? theme.color.active
        : theme.color.destructive
      : theme.color.brightGray};
`;
