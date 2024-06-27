import media from '@/style/media';
import styled from 'styled-components';

export const StyledHeader = styled.header`
  background: ${(props) => props.theme.color.background};
  border-bottom: 1px solid ${(props) => props.theme.color.border};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const HeaderInnerContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${media.xlarge`width: 1100px;`}
  ${media.large`width: 900px;`}
  ${media.medium`width: 600px;`}
  ${media.small`width: 400px;`}
  ${media.xsmall`width: 90%;`}
  ${media.xxsmall`width: 95%;`};
`;

export const HeaderTopBox = styled.div`
  display: flex;
  ${media.xlarge`gap: 16px; height: 60px;`}
  ${media.large`gap: 16px; height: 60px;`}
  ${media.medium`gap: 16px; height: 60px;`}
  ${media.small`gap: 12px; height: 50px;`}
  ${media.xsmall`gap: 8px;`}
  ${media.xxsmall`gap: 8px;`}
`;

export const HeaderTopBoxForSigning = styled.div`
  display: flex;
  justify-content: center;
  ${media.xlarge`height: 60px;`}
  ${media.large`height: 60px;`}
  ${media.medium`height: 60px;`}
  ${media.small`height: 50px;`}
`;

export const HeaderLogoBox = styled.div<{ $src: string }>`
  background-image: url(${(props) => props.$src});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  ${media.xlarge`width: 150px;`}
  ${media.large`width: 150px;`}
  ${media.medium`width: 130px;`}
  ${media.small`width: 110px;`}
  ${media.xsmall`width: 100px;`}
  ${media.xxsmall`width: 90px;`}
`;

export const HeaderSearchBox = styled.div`
  display: flex;
  flex: 1 1 auto;
  background: #ccc;
`;

export const HeaderMenuBox = styled.div`
  background: #ccc;
  display: flex;
  align-items: center;
  flex-basis: fit-content;
`;

export const HeaderNavBox = styled.div`
  display: flex;
  background: #ccc;
`;
