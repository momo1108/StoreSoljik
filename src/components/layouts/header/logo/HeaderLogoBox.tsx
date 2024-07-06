import { MouseEventHandler } from 'react';
import logoUrl from '@/assets/images/logo_original.png';
import * as S from './HeaderLogoBox.Style';

type HeaderLogoBoxProps = {
  onClick?: MouseEventHandler<HTMLDivElement>;
  isPointer?: boolean;
};

const HeaderLogoBox: React.FC<HeaderLogoBoxProps> = ({
  onClick,
  isPointer = false,
}) => {
  return (
    <S.HeaderLogoBox
      onClick={onClick}
      $isPointer={isPointer}
      $src={logoUrl}
    ></S.HeaderLogoBox>
  );
};

export default HeaderLogoBox;
