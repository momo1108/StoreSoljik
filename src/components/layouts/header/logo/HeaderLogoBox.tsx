import { MouseEventHandler } from 'react';
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
      $src={'src/assets/images/logo_original.png'}
    ></S.HeaderLogoBox>
  );
};

export default HeaderLogoBox;
