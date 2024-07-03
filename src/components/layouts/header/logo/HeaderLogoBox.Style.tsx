import media from '@/style/media';
import styled from 'styled-components';

export const HeaderLogoBox = styled.div<{ $src: string; $isPointer: boolean }>`
  background-image: url(${(props) => props.$src});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  ${media.xlarge`width: 180px;`}
  ${media.large`width: 180px;`}
  ${media.medium`width: 160px;`}
  ${media.small`width: 130px;`}
  ${media.xsmall`width: 110px;`}
  ${media.xxsmall`width: 100px;`}

  cursor: ${(props) => (props.$isPointer ? 'pointer' : 'auto')};
`;
