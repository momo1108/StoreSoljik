import media from '@/style/media';
import styled from 'styled-components';

export const HeaderTopBox = styled.div`
  display: flex;
  ${media.xlarge`gap: 16px; height: 60px;`}
  ${media.large`gap: 16px; height: 60px;`}
  ${media.medium`gap: 16px; height: 60px;`}
  ${media.small`gap: 12px; height: 50px;`}
  ${media.xsmall`gap: 8px;`}
  ${media.xxsmall`gap: 8px;`}
`;

export const HeaderNavBox = styled.nav`
  display: flex;
  flex: 1 1 auto;
`;

export const HeaderMenuBox = styled.div`
  display: flex;
  align-items: center;
  flex-basis: fit-content;
`;
