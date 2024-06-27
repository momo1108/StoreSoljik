import media from '@/style/media';
import styled from 'styled-components';

export const Header = styled.body`
  background: ${(props) => props.theme.color.background};
  border-bottom: 1px solid ${(props) => props.theme.color.border};
`;

export const HeaderInnerContainer = styled.header`
  margin: 0 auto;

  ${media.xlarge`
    width: 1100px;
    height: 90px;
  `} ${media.large`
    width: 900px;
    height: 90px;
  `} ${media.medium`
    width: 600px;
    height: 70px;
  `} ${media.small`
    width: 400px;
    height: 60px;
  `} ${media.xsmall`
    width: 90%;
    height: 50px;
  `} ${media.xxsmall`
    width: 95%;
    height: 50px;
  `};
`;

export const HeaderLogoBox = styled.div`
  flex-basis: content;
  ${media.xlarge`width: 100px;`}
  ${media.large`width: 100px;`}
  ${media.medium`width: 100px;`}
  ${media.small`width: 80px;`}
  ${media.xsmall`width: 60px;`}
  ${media.xxsmall`width: 60px;`}
`;
