import media from '@/style/media';
import styled from 'styled-components';
import NavBar from '@/components/ui/navbar/NavBar';
import Button from '@/components/ui/button/Button';

export const HeaderTopBox = styled.div`
  display: flex;
  ${media.xlarge`gap: 48px; height: 60px;`}
  ${media.large`gap: 32px; height: 60px;`}
  ${media.medium`gap: 16px; height: 60px;`}
  ${media.small`gap: 12px; height: 50px;`}
  ${media.xsmall`gap: 8px;`}
  ${media.xxsmall`gap: 8px;`}
  padding: 10px 0 10px 0;
`;

export const HeaderNavBox = styled.nav`
  display: flex;
  flex: 1 1 auto;
`;

export const HeaderNavBar = styled(NavBar)`
  gap: 40px;
  padding: 10px;
  & > li {
    text-align: center;
    display: flex;
    width: 100px !important;
    height: 100%;
    align-items: center;
    justify-content: center;
    color: #888;

    a {
      display: flex;
      align-items: center;
      height: 100%;
    }

    a:visited {
      color: inherit;
    }

    a:hover,
    a.active {
      color: black;
    }
    a.active {
      border-bottom: 2px solid black;
    }
  }
`;

export const HeaderMenuBox = styled.div`
  display: flex;
  align-items: center;
  flex-basis: fit-content;
`;

export const SignoutButton = styled(Button)`
  padding: 10px;
  border: none;
  &:hover {
    border: none;
  }
`;
