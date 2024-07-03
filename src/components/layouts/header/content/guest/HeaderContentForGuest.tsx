import * as S from './HeaderContentForGuest.Style';
import HeaderLogoBox from '../../logo/HeaderLogoBox';

const HeaderContentForGuest: React.FC = () => {
  return (
    <S.HeaderContentContainer>
      <HeaderLogoBox></HeaderLogoBox>
    </S.HeaderContentContainer>
  );
};

export default HeaderContentForGuest;
