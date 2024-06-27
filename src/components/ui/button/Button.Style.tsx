import media from '@/style/media';
import styled from 'styled-components';

export type ButtonProps = {
  $isSignedIn?: boolean;
  $showPreIcon?: boolean;
  $showPostIcon?: boolean;
};

export const StyledButton = styled.button<ButtonProps>`
  background: ${(props) => props.theme.color.background};
  border-radius: ${(props) => props.theme.radius};
  font-weight: 800;

  ${media.xlarge`padding: 10px 20px;`}
  ${media.large`padding: 10px 20px;`}
  ${media.medium`padding: 10px 20px;`}
  ${media.small`padding: 10px 20px;`}
  ${media.xsmall`padding: 10px 20px;`}
  ${media.xxsmall`padding: 10px 20px;`};
`;
