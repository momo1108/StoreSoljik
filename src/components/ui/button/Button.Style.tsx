import media from '@/style/media';
import styled from 'styled-components';
import { ButtonProps } from './Button';

export const StyledButton = styled.button<
  ButtonProps & { $styleType: 'normal' | 'primary' }
>`
  display: flex;
  gap: 4px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  outline: none;
  color: ${(props) =>
    props.$styleType === 'primary'
      ? props.theme.color.primaryForeground
      : 'inherit'};

  background: ${(props) =>
    props.$styleType === 'primary' ? props.theme.color.primary : '#0000'};
  border: 2px solid
    ${(props) =>
      props.$styleType === 'primary'
        ? props.theme.color.primary
        : props.theme.color.border};
  &:hover {
    background: ${(props) =>
      props.$styleType === 'primary'
        ? props.theme.color.primaryHover
        : '#09090909'};
    border: 2px solid
      ${(props) =>
        props.$styleType === 'primary'
          ? props.theme.color.primaryHover
          : props.theme.color.border};
  }
  border-radius: ${(props) => props.theme.color.radius};
  font-size: ${(props) => props.theme.fontSize.base};
  font-weight: bold;

  ${media.xlarge`padding: 10px 20px;`}
  ${media.large`padding: 10px 20px;`}
  ${media.medium`padding: 10px 20px;`}
  ${media.small`padding: 10px 20px;`}
  ${media.xsmall`padding: 10px 20px;`}
  ${media.xxsmall`padding: 10px 20px;`};
`;
