import * as S from './Header.Style';
import { useAuth } from '@/hooks/useAuth';
import HeaderContentForGuest from './content/guest/HeaderContentForGuest';
import HeaderContentForBuyer from './content/buyer/HeaderContentForBuyer';
import HeaderContentForSeller from './content/seller/HeaderContentForSeller';

type HeaderProps = {
  userType: 'guest' | 'buyer' | 'seller';
};

const Header: React.FC<HeaderProps> = ({ userType }) => {
  return (
    <S.StyledHeader>
      <S.HeaderInnerContainer>
        {userType === 'guest' ? (
          <HeaderContentForGuest />
        ) : userType === 'buyer' ? (
          <HeaderContentForBuyer />
        ) : (
          <HeaderContentForSeller />
        )}
      </S.HeaderInnerContainer>
    </S.StyledHeader>
  );
};

export default Header;
