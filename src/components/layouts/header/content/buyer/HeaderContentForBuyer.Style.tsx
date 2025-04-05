import Button from '@/components/ui/button/Button';
import NavBar from '@/components/ui/navbar/NavBar';
import media from '@/style/media';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const HeaderTopBox = styled.div`
  display: flex;
  ${media.xlarge`gap: 48px; height: 60px;`}
  ${media.large`gap: 32px; height: 60px;`}
  ${media.medium`gap: 16px; height: 60px;`}
  ${media.small`gap: 12px; height: 50px;`}
  ${media.xsmall`gap: 8px;`}
  ${media.xxsmall`gap: 8px;`}
  padding: 10px 0 10px 0;
  font-weight: bold;
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
    width: 120px !important;
    height: 100%;
    align-items: center;
    justify-content: center;
    color: #888;

    a {
      display: flex;
      align-items: center;
      height: 100%;
      border-bottom: 2px solid transparent;
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
  gap: 32px;
`;

export const CartButton = styled.button`
  position: relative;
  display: flex;
  padding: 0 8px;
  border: none;
  cursor: pointer;
  background: none;
  &:hover > svg {
    animation: shake-lr 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
  }
`;

export const LengthSpan = styled.span`
  position: absolute;
  top: -11px;
  right: 8px;
  padding: 0 4px;
  min-width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.color.background};
  background-color: ${({ theme }) => theme.color.foreground};
  border-radius: 8px;
`;

export const SellerPageLink = styled(Link)`
  padding: 8px;
  border-radius: 8px;
  &:hover {
    background: ${(props) => props.theme.color.brightestGray};
  }
`;

export const SignoutButton = styled(Button)`
  padding: 10px;
  border: none;
  &:hover {
    border: none;
  }
`;
